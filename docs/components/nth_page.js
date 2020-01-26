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
      padding-left: 60px;
      text-align: justify;
    }
    .toggle-fallbacks {
      top: 0px;
      padding-bottom: 3px;
      padding-top: 3px;
      margin-top: calc(47px - 0.7em);
      position: sticky;
      margin-top: 2px;
      right: 20px;
      display: flex;
      color: #084c69;
      font-size: 0.8em;
      align-items: center;
      justify-content: flex-end;
      background: white;
      a {
        transform: translateY(-5px);
        font-size: 0.9em;
      }
      nth-toggle {
        margin-left: 5px;
      }
    }

    @media only screen and (max-width: 600px) {
      display: block;
      max-width: 100%;
      padding: 30px;
      .toggle-fallback {
        margin-top: 0px;
      }
      main {
        padding-left: 0px;
      }
    }
  `;
  for (;;) {
    yield () => {
      return html`
        <div class="${className}">
          <nth-sidebar></nth-sidebar>
          <main>
            <div class="toggle-fallbacks">
              use fallbacks<a href="#">?</a>
              <nth-toggle
                .toggled="${true}"
                ontoggled="${e => console.log(e.detail)}"
              ></nth-toggle>
            </div>
            <nth-intro></nth-intro>
            <p>
              ...to be continued
            </p>
          </main>
        </div>
      `;
    };
  }
});
