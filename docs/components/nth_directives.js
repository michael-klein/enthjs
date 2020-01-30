import {
  component,
  html,
  text,
  attr,
  prop,
  sub,
  list,
  clss,
  frag,
} from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-directives', function * () {
  css();
  for (;;) {
    yield () => {
      return html`
        <nth-anchor id="directives"><h1>Directives</h1></nth-anchor>
        <p>
          Directives are what makes templates actually dynamic. Without them,
          re-rendering templates would always yield the same result. The most
          basic example of a directive is the following:
          <nth-highlight
            .code="${`
                  import {component, html, text} from 'enthjs';

                  component('some-component', function * (state) {
                    // we use the getCounter method from 
                    // the component documentation further up here
                    const countState = getCounter();
                    state.merge(countState);
                    for (;;) {
                      yield () => {
                        return html\`<div>count: \${text(state.count)\}</div>\`;
                      };
                    }
                  });              
              `}"
          ></nth-highlight>
          text will be called each render and actually update the text content
          of the corresponding text node. Enthjs does not process templates on
          subsequent renders at all and does not implement any fancy DOM diffing
          in the main render method. All it does is to call directives
          repeatadly with the latest arguments and the DOM node they're mounted
          to and it leaves updating the view to them.
        </p>
        <nth-anchor id="implementing-directives"
          ><h2>Implementing directives</h2></nth-anchor
        >
        <p>
          Directives, just like components, are implemented using generator
          functions. Here's the implementation of the text directive used above:
          <nth-highlight
            .code="${`
                  import { createDirective, DOMUpdateType, DirectiveType } from 'enthjs';
                  
                  export const text = createDirective(function*(node: Text, value: string) {
                    if (this.type === DirectiveType.TEXT) {
                      for (;;) {
                        const result = yield [
                          {
                            node,
                            value,
                            type: DOMUpdateType.TEXT,
                          },
                        ];
                        value = result[0];
                      }
                    }
                  });                            
              `}"
          ></nth-highlight>
          Directive generators will always be passed the DOM node the directive
          is mounted to as first argument and spread remaining arguments passed
          in the template behind that (so in this case, the second argument is
          the passed string value).
        </p>
        <p>
          Directives are not supposed to directly modify the DOM, instead the
          yield array with instructions to modify the DOM. Enthjs will schedule
          and batch all updates for improved performance. yield will in turn
          return the next arguments array for the next render call.
        </p>
        <p>
          Enthjs also binds some information to the this of generators.
          this.type will indicate the type of directive binding the directive
          was found on (in the case of text, it has to be put on a text node).
          Most directives only work on specific nodes or on attributes. Valid
          directive types are: TEXT, ATTRIBUTE, ATTRIBUTE_VALUE
        </p>
        <p>
          Additionally, this.container will point to the container element the
          template with the directive was mounted to.
        </p>
        <p>
          <nth-anchor id="fallbacks"><h2>Fallbacks</h2></nth-anchor>
        </p>
        <p>
          With the 'use fallbacks' toggle in the top right corner switched on,
          you might have noticed that most of the code snippets before displayed
          no directives at all. This is because enthjs has a method to
          automatically use fallback directives in templates without
          specifically putting them there. Here's how you might define a text
          fallback:
          <nth-highlight
            .code="${`
                  import { defineFallback, text } from 'enthjs';

                  // the callback passed to defineFallback will be called whenever
                  // enthjs finds a non-directive value in a template
                  defineFallback(data => {
                    // data.type indicates where the value was found
                    if (data.type === DirectiveType.TEXT) {
                      // if it's either a string or a number, we insert the text directive here
                      if (
                        typeof data.staticValue === 'string' ||
                        typeof data.staticValue === 'number'
                      ) {
                        data.directive = text(data.staticValue);
                      }
                    }
                  });                                 
              `}"
          ></nth-highlight>
          It's important to note that defineFallback currently applies globally
          to all render calls (this is subject to refinement);
        </p>
        <p>
          Enthjs exports a applyDefaultFallback function you can call to
          automatically apply fallbacks for all default directives (see below).
          That way you can mostly concentrate on writing templates without
          typing out the directive calls all the time.
          <nth-highlight
            .code="${`
                  import { applyDefaultFallback } from 'enthjs';
                  
                  // call this once before you define your components
                  applyDefaultFallback();
              `}"
          ></nth-highlight>
        </p>
        <p>
          The reason for handling directives this way is so that developers can
          selectively only use the ones they need and keep their code size
          small. If we implemented a templating language with baked in
          templating directives, doing so would be much harder.
        </p>
        <nth-anchor id="built-in-directives"
          ><h2>Built-in directives</h2></nth-anchor
        >
        <p>
          Enthjs exports a number of directives for the most typical use cases.
          They are: text, list, attr, clss, frag, input, on, prop, sub, text
        </p>
        <p>
          Below are some simple, commented examples of each of them:
          <nth-highlight
            .code="${`
                // text will insert the provided text on each render:
                html\`
                  <div>$\{text(state.count)}</div>
                \`;

                // attr will set attribute values
                // default fallback: attributeName="attributeValue"
                html\`
                  <div $\{attr('attributeName', 'attributeValue')}>foo</div>
                \`;

                // prop will set property values on the element instance
                // default fallback: .propertyName="propertyValue"
                html\`
                  <div $\{prop('propertyName', 'propertyValue')}>foo</div>
                \`;

                // clss will set classes on the element
                html\`
                  <div $\{clss('some class names')}>foo</div>
                \`;

                // sub can render changing htmlResults
                // default fallback: <div>$\{Math.random() > 0 ? html\`foo\` : html\`bar\`}</div>
                html\`
                  <div>
                    $\{sub(
                      Math.random() > 0
                        ? html\`
                            foo
                          \`
                        : html\`
                            bar
                          \`
                    )}
                    foo
                  </div>
                \`;

                // list will intelligently update lists using the provided keys
                // instead of rebuilding list items when the order changes, it will just change the order
                // default fallback: <ul>$\{someArray.map(item =>html\`<li key="$\{item.key">$\{item.text}</li>\`}</ul>
                html\`
                  <ul>
                    $\{list(
                      someArray.map(
                        item =>
                          html\`
                            <li $\{key(item.key)}>$\{item.text}</li>
                          \`
                      )
                    )}
                  </ul>
                \`;

                // frag will completely forgo the normal render pipeline and
                // set innerHTML on the element it is used on
                html\`
                  <div $\{frag('<div>Some html</div>')}>foo</div>
                \`;
              `}"
          ></nth-highlight>
        </p>
      `;
    };
  }
});
