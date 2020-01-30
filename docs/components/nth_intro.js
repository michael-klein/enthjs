import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-intro', function * () {
  const todoClass = css`
    position: relative;
    border: 3px solid #297491;
    padding: 20px;
    margin-top: 10px;
    padding-bottom 20px;
    .codepenlink {
      position:absolute;
      right: 0px;
      bottom: 0px;
      border-top: 3px solid #297491;
      border-left: 3px solid #297491;
      padding: 2px;
      padding-left: 5px;
      padding-right: 5px;
      line-height: 1em;
      background: #297491;
      a {
        font-size: 0.9em;
        color:white;
      }
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
              The library is written in typescript and built as es6 modules. Most parts, including all templating directives, can be loaded on a as-needed basis. In other words, you don't have to to load 50kb of code that you mostly may not need.
            </p>
            <p> 
              Obviously, the features listed above are only available in the latest browsers (that does not include IE11), so you might need to use babel transforms and/or polyfills to support some of them.
            </p>
            <p>  
              Before we go into more detail, here is the obligatory, arbitrary todo app, implemented with enthjs:
              <div class="${todoClass}">
                <todo-app></todo-app>
                <div class="codepenlink"><a target="blank" href="https://codepen.io/Skaryon/pen/YzPjZzL">
                  open in codepen
                </a></div>
              </div>
            </p>
        <nth-anchor id="production-ready"><h2>Is this ready for production?</h2></nth-anchor>
        <p>
        Absolutely not!
        </p>
        <p>
          The framework is neither feature complety, nor have I written a single test, yet. It should be seen as a learning excercise that I'm publishing to check out if there may be some larger interest. I intend, however, to at least use it for personal projects going forward. In other words: Feel free to play with enthjs and build things but don't expect the level of polish you'd get from react, vue & co.
        </p>
        <p>
          Here's a rough list of what's missing and of net steps I intend to take with the library:
          <ul>
            <li>
              Write tests - obviously.
            </li>
            <li>
              Make it possible to instantiate the library with fallbacks bound to it (instead of setting global fallbacks)
            </li>
            <li>
              Make state.attributes and state.properties optional
            </li>
            <li>
              Correctly handle SVG
            </li>
            <li>
              Add some automatic support screen readers and other assistive technologies (such as automatic "role" inheritance)
            </li>
            <li>
              Create a CLI to automate some things such as project scaffolding
            </li>
          </ul>
        </p>
      `;
    };
  }
});
