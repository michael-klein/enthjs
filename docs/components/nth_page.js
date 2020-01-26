import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-page', function * (state) {
  const className = css`
    max-width: 900px;
    width: 100%;
    margin: 0px auto;
    display: flex;
    padding: 40px;
    padding-top: 70px;
    position: relative;
    * {
      line-height: 1.7em;
    }
    main {
      padding-top: calc(50px - 0.7em);
      padding-left: 60px;
      text-align: justify;
    }
    .toggle-fallbacks {
      position: absolute;
      margin-top: 2px;
      right: 40px;
      display: flex;
      color: #084c69;
      font-size: 0.8em;
      align-items: center;
      justify-content: center;
      a {
        transform: translateY(-5px);
        font-size: 0.9em;
      }
      nth-toggle {
        margin-left: 5px;
      }
    }
  `;
  for (;;) {
    yield () => {
      return html`
        <div class="${className}">
          <nth-sidebar></nth-sidebar>
          <div class="toggle-fallbacks">
            use fallbacks<a href="#">?</a>
            <nth-toggle
              .toggled="${true}"
              ontoggled="${e => console.log(e.detail)}"
            ></nth-toggle>
          </div>
          <main>
            <h1>hello</h1>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div>
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
            </div>
            <todo-app></todo-app>
          </main>
        </div>
      `;
    };
  }
});
