import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';
component('nth-intro', function * () {
  const todoClass = css`
    position: relative;
    border: 3px solid #79b9e8;
    padding: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    a > img {
      height: 30px;
      position: absolute;
      right: -2px;
      bottom: -2px;
    }
  `;
  for (;;) {
    yield () => {
      return html`
            <h1>Intro</h1>
            <p>
              enthjs is a JavaScript view library that the latest(-ish) language
              features such as:
              <ul>
                <li>web components for encapsulation</li>
                <li>
                  generators to define components and templating directives
                </li>
                <li>tagged template literals for templating</li>
                <li>proxies for change tracking</li>
              </ul>
              The library is written in typescript and build as es modules. Most parts, including all templating directives, can be loaded on a as-needed basis. In other words, you do not need to load 50kb of code that you mostly may not need. Obviously, the features listed above are only available in the latest browsers (that does not include IE11), so you might need to use babel transforms and/or polyfills to support some of them.
            </p>
            <p>
              A very simple enthjs component can be as simple as this:
              <nth-highlight
                .code="${`
                  import {component, html} from 'enthjs';

                  component('a-component', function * () {
                    yield () => {
                      return html\`<div>hello world!</div>\`;
                    };
                  });              
              `}"
              ></nth-highlight>
            </p> 
            <p>  
              Before we go into more detail, here is the obligatory, arbitrary todo app, implemented with enthjs:
              <div class="${todoClass}">
                <todo-app></todo-app>
                <a target="blank" href="https://codesandbox.io/s/relaxed-resonance-hm2f5?fontsize=14&hidenavigation=1&theme=dark">
                  <img alt="Edit enthjs todo example" src="https://codesandbox.io/static/img/play-codesandbox.svg">
                </a>
              </div>
            </p>
      `;
    };
  }
});
