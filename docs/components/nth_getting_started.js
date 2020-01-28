import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-getting-started', function * () {
  css();
  for (;;) {
    yield () => {
      return html`
        <h1>Getting Started</h1>
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
                  import {component,html} from 'https://cdn.jsdelivr.net/npm/enthjs@latest/dist/src/index.js';       
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
      `;
    };
  }
});
