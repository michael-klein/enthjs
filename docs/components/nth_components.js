import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-components', function * (state) {
  css();
  for (;;) {
    yield () => {
      return html`
        <h1>Components</h1>
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
          functions. For a simple, non dynamic component as the one above, it is
          fine to yield once.
        </p>
        <p>
          Dynamic components may need to yield different results on subsequent
          render calls. This can be achieved e.g. using a non-terminating for
          loop:
          <nth-highlight
            .code="${`
                  import {component, html} from 'enthjs';
                  // define a <hello-world> web component that renders hello world.
                  component('current-date', function * () {
                    // anything above the for loop can be though of as the setup phase
                    // create new state variables here, subscriptions, etc.
                    for (;;) {
                      yield () => {
                        // this will print a different date on each render call
                        return html\`<div>Current date: ${new Date().getDate()}!</div>\`;
                      };
                    }
                  });              
              `}"
          ></nth-highlight>
        </p>
        <h2>Host Element</h2>
        <p>
          Sometimes you might need to get access to the host element, that is,
          the DOM element the web components is mounted on. You may use the
          getHost helper functions to do so:
          <nth-highlight
            .code="${`
                  import {component, html, getHost} from 'enthjs';

                  component('get-host', function * (state) {
                    // getHost can only be called in the setup phase
                    // calling it in subsequent renders or async functions will error
                    const host = getHost();
                    for (;;) {
                      yield () => {
                        return html\`<div>Host tagname: \${host.tagName\}</div>\`;
                      };
                    }
                  });              
              `}"
          ></nth-highlight>
        </p>
        <h2>State</h2>
        <p>
          Enthjs components will be passed a state object as first argument.
          This object is heavily proxified and writing to it or subtrees of it
          will trigger re-renders.
          <nth-highlight
            .code="${`
                  import {component, html} from 'enthjs';

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
                      return html\`<div>Count value: state.count</div>\`;
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
            .code="${`
                  import {component, html, $state} from 'enthjs';

                  // this will make the count up functionality available to any component
                  function getCounter() {
                    const countState = $state({count:0});
                    setInterval(() => {
                      countState.count++;
                    },1000);
                    return countState;
                  }

                  component('count-up', function * (state) {

                  const countState = getCountet();

                  // we have to merge countState with the main state to have it trigger re-renders
                  // this will make count available on countState and update when countState does
                  state.merge(countState);

                  for (;;) {
                    yield () => {
                      return html\`<div>Count value: state.count</div>\`;
                    };
                  }
                  });              
              `}"
          ></nth-highlight>
        </p>
        <h2>Attributes & Properties</h2>
        <p>
          Enthjs will put two default entries on the state object: properties
          and attributes. Properties represents actual properties on the host
          element object. Attributes in turn represents attributes on the HTML
          tag.
        </p>
        <p>
          Both attributes and properties will trigger re-renders when changed
          from the outside AND will update properties and attributes on the host
          element when modified from within the component!
        </p>
      `;
    };
  }
});
