import {
  component,
  html,
  getHost,
  sideEffect,
  createEvent,
} from '../../dist/src/index.js';
import { css } from '../css.js';
import { toggled } from './nth_highlight.js';

component('nth-components', function * (state) {
  const className = css`
    attributes-properties,
    attributes-properties-sideffects {
      position: relative;
      border: 3px solid #297491;
      padding: 20px;
      margin-top: 10px;
      padding-bottom: 20px;
      display: block;
    }
  `;
  for (;;) {
    yield () => {
      return html`
        <span class="${className}">
          <nth-anchor id="components"><h1>Components</h1></nth-anchor>
          <p>
            enthjs components are web components and can thus be used like any
            other HTML tag in your markup. A basic enthjs component can be as
            simple as this:
            <nth-highlight
              .code="${`
                  import {component, html} from 'enthjs';
                  // define a <hello-world> web component that renders hello world.
                  component('hello-world', function * () {
                    yield () => {
                      return html\`<div>hello world!</div>\`;
                    };
                  });              
              `}"
            ></nth-highlight>
          </p>
          <p>
            Components are defined as generator functions that yield render
            functions. For a simple, non dynamic component as the one above, it
            is fine to yield once.
          </p>
          <p>
            Dynamic components may need to yield different results on subsequent
            render calls. This can be achieved e.g. using a non-terminating for
            loop:
            <nth-highlight
              .code="${toggled`
                  import {component, html${['', ', text']}} from 'enthjs';
                  // define a <hello-world> web component that renders hello world.
                  component('current-date', function * () {
                    // anything above the for loop can be though of as the setup phase
                    // create new state variables here, subscriptions, etc.
                    for (;;) {
                      yield () => {
                        // this will print a different date on each render call
                        return html\`<div>Current date: \${${[
                          `new Date().getDate()`,
                          `text(new Date().getDate())`,
                        ]}\}!</div>\`;
                      };
                    }
                  });              
              `}"
            ></nth-highlight>
          </p>
          <nth-anchor id="host-element"><h2>Host Element</h2></nth-anchor>
          <p>
            Sometimes you might need to get access to the host element, that is,
            the DOM element the web components is mounted on. You may use the
            getHost helper functions to do so:
            <nth-highlight
              .code="${toggled`
                  import {component, getHost, html${[
                    '',
                    ', text',
                  ]}} from 'enthjs';

                  component('get-host', function * (state) {
                    // getHost can only be called in the setup phase
                    // calling it in subsequent renders or async functions will error
                    const host = getHost();
                    for (;;) {
                      yield () => {
                        return html\`<div>Host tagname: \${${[
                          `host.tagName`,
                          `text(host.tagName)`,
                        ]}\}</div>\`;
                      };
                    }
                  });              
              `}"
            ></nth-highlight>
          </p>
          <nth-anchor id="state"><h2>State</h2></nth-anchor>
          <p>
            Enthjs components will be passed a state object as first argument.
            This object is heavily proxified and writing to it or subtrees of it
            will trigger re-renders.
            <nth-highlight
              .code="${toggled`
                  import {component, html${['', ', text']}} from 'enthjs';

                  component('count-up', function * (state) {
                    // we define and initialize count on state 
                    state.count = 0;

                    // it's possible to directly subscribe to state updates:
                    state.on(value => console.log("hi"));

                    setInterval(() => {
                      //state is proxified, so this will trigger a re-render
                      state.count++;
                    },1000);
                    // Note: How to handle clearing intervals etc. will be explained a bit later

                    for (;;) {
                      yield () => {
                        return html\`<div>Count value: \${${[
                          `state.count`,
                          `text(state.count)`,
                        ]}\}</div>\`;
                      };
                    }
                  });              
              `}"
            ></nth-highlight>
          </p>
          <p>
            You can also create new proxified state variables with the $state
            factory function and merge these with the main state. This is useful
            to create reusable pieces of functionality that are not closely tied
            to one component:

            <nth-highlight
              .code="${toggled`
                  import {component, html, $state${[
                    '',
                    ', text',
                  ]}} from 'enthjs';

                  // this will make the count up functionality available to any component
                  function getCounter() {
                    const countState = $state({count:0});
                    setInterval(() => {
                      countState.count++;
                    },1000);
                    return countState;
                  }

                  component('count-up', function * (state) {

                  const countState = getCounter();

                  // we have to merge countState with the main state to have it trigger re-renders
                  // this will make count available on countState and update when countState does
                  state.merge(countState);

                  for (;;) {
                    yield () => {
                      return html\`<div>Count value: \${${[
                        `state.count`,
                        `text(state.count)`,
                      ]}\}</div>\`;
                    };
                  }
                  });              
              `}"
            ></nth-highlight>
          </p>
          <nth-anchor id="attributes-properties"
            ><h2>Attributes & Properties</h2></nth-anchor
          >
          <p>
            Enthjs will put two default entries on the state object: properties
            and attributes. Properties represents actual properties on the host
            element object. Attributes in turn represents attributes on the HTML
            tag.
          </p>
          <p>
            Both attributes and properties will trigger re-renders when changed
            from the outside AND will update properties and attributes on the
            host element when modified from within the component!
          </p>
          <p>
            Below is a very simple component which renders the values of the foo
            attribute and bar property on the host element to inputs. You can
            inspect it in the DOM to see the foo attribute update as you type
            and updating the value by hand will update the input in turn. In the
            same vein, you can print or reassign the bar property on the
            element. I've console.logged the element to make this easier!

            <attributes-properties></attributes-properties>
          </p>
          <p>
            Here's the source code for the above component:

            <nth-highlight
              .code="${toggled`
              import {component, getHost, html, $state${[
                '',
                ', on, prop',
              ]}} from 'enthjs';
                  
              component('attributes-properties', function * (state) {
                console.log("I'm here!", getHost());
                for (;;) {
                  yield () => {
                    const { attributes, properties } = state;
                    const { foo = '' } = attributes;
                    const { bar = '' } = properties;
                    return html\`
                      <div>
                        'foo' attribute value: <input
                          type="text"
                          ${[`.value="\${foo}"`, `\${prop("value",foo)\}`]}
                          ${[
                            `oninput="\${e => (state.attributes.foo = e.target.value)\}"`,
                            `\${on("input",e => (state.attributes.foo = e.target.value))\}`,
                          ]}
                        />
                        <div>
                          'bar' property value: <input
                            type="text"
                            ${[`.value="\${bar}"`, `\${prop("value",bar)\}`]}
                            ${[
                              `oninput="\${e => (state.properties.bar = e.target.value)\}"`,
                              `\${on("input",e => (state.properties.bar = e.target.value))\}`,
                            ]}
                          />
                        </div>
                      </div>
                    \`;
                  };
                }
              });      
              `}"
            ></nth-highlight>
          </p>
          <nth-anchor id="side-effects"><h2>Side effects</h2></nth-anchor>
          <p>
            Enthjs offers a mechanism to run side effects after render calls
            which is similiar to the useEffect hook in react but doesn't suffer
            from the problem of stale closures. Below is the above
            attributes-properties component with added side effects:
            <attributes-properties-sideffects></attributes-properties-sideffects>
          </p>
          <p>
            As you can tell, the values of foo and bar are now synchronized.
            This is achieved with two side effects, like so:

            <nth-highlight
              .code="${`
                import { component, getHost, html, $state } from "enthjs";

                component('attributes-properties-sideffects', function * (state) {
                  // side effects run after every render...
                  // the 'sideEffect' helper can only be used in the setup phase
                  sideEffect(
                    () => {
                      state.properties.bar = state.attributes.foo;
                    },
                    // ... if the values in the array returned here change
                    // this works just like it would in react!
                    () => [state.attributes.foo]
                  );
                  sideEffect(
                    () => {
                      state.attributes.foo = state.properties.bar;
                    },
                    () => [state.properties.bar]
                  );
                  // ... same render loop as above
                });      
              `}"
            ></nth-highlight>
          </p>
          <p>
            Also similiar to react, you may return a cleanup function from your
            side effect which runs before the side effect is next executed (and
            on component dismount). The counter example from further up can be
            improved using this to actually remove the listener:

            <nth-highlight
              .code="${`
                  // this will make the count up functionality available to any component
                  function getCounter() {
                    const countState = $state({count:0});
                    sideEffect(() => {
                      const handler = () => {
                        countState.count++;
                      }
                      setInterval(handler,1000);
                      return () => clearInterval(handler)
                    }, () => []);
                    return countState;
                  }          
              `}"
            ></nth-highlight>
            Together with $state, this will equip you with everything you need
            to build nicely decoupled pieces of composable functionalities akin
            to react hooks!
          </p>
          <nth-anchor id="custom-events"><h2>Custom Events</h2></nth-anchor>
          <p>
            Sometimes you might want to emit custom events from your web
            component host element. Enthjs provides the createEvent helper for
            that purpose:
            <nth-highlight
              .code="${`
                  // define your custom event in the setup phase
                  const fire = createEvent(
                    'yourEvent',
                    // the second argument is an optional CustomEventInit and defaults to this:
                    {
                      bubbles: true,
                      composed: true,
                    }
                  );
                  // fire it from the host element anytime you want like this:
                  fire('hello'); // event.detail = 'hello'          
              `}"
            ></nth-highlight></p
        ></span>
      `;
    };
  }
});
component('attributes-properties', function * (state) {
  for (;;) {
    yield () => {
      const { attributes, properties } = state;
      const { foo = '' } = attributes;
      const { bar = '' } = properties;
      return html`
        <div>
          'foo' attribute value:
          <input
            type="text"
            .value="${foo}"
            oninput="${e => (state.attributes.foo = e.target.value)}"
          />
          <div>
            'bar' property value:
            <input
              type="text"
              .value="${bar}"
              oninput="${e => (state.properties.bar = e.target.value)}"
            />
          </div>
        </div>
      `;
    };
  }
});

component('attributes-properties-sideffects', function * (state) {
  sideEffect(
    () => {
      state.properties.bar = state.attributes.foo;
    },
    () => [state.attributes.foo]
  );
  sideEffect(
    () => {
      state.attributes.foo = state.properties.bar;
    },
    () => [state.properties.bar]
  );
  for (;;) {
    yield () => {
      const { attributes, properties } = state;
      const { foo = '' } = attributes;
      const { bar = '' } = properties;
      return html`
        <div>
          'foo' attribute value:
          <input
            type="text"
            .value="${foo}"
            oninput="${e => (state.attributes.foo = e.target.value)}"
          />
          <div>
            'bar' property value:
            <input
              type="text"
              .value="${bar}"
              oninput="${e => (state.properties.bar = e.target.value)}"
            />
          </div>
        </div>
      `;
    };
  }
});
