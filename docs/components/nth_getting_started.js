import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-getting-started', function * () {
  css();
  for (;;) {
    yield () => {
      return html`
        <h2>Install</h2>
        <p>
          You can of course install enthjs from npm
          <nth-highlight
            .code="${`
                  // npm install enthjs      
                  // in your code:
                  import {component,html} from 'enthjs';       
              `}"
          ></nth-highlight>
          Or import it from a CDN:

          <nth-highlight
            .code="${`
                  import {component,html} from 'insert';       
              `}"
          ></nth-highlight>
          Enthjs is distributed as es6 modules.
        </p>
        <h2>Basic usage</h2>
        <p>
          If you just want to render some template to a container, this will do
          the trick:
          <nth-highlight
            .code="${`
                  import {render, html} from 'enthjs';
                  render(document.getElementById('#container'), html\`<div>hello world!</div>\`);             
              `}"
          ></nth-highlight>
          Note: Render will return a Promise that resolves once it's done.
        </p>
        <h2>Components</h2>
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
      `;
    };
  }
});
