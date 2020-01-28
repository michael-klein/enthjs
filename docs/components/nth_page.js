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
      padding-left: 220px;
      text-align: justify;
      position: relative;
      min-width: 0;
      &:before {
        content: '';
        position: fixed;
        height: 30px;
        top: 0px;
        left: 0px;
        width: 100%;
        background: white;
        z-index: 1000;
      }
    }
    .toggle-fallbacks {
      z-index: 2000;
      top: 0px;
      padding-bottom: 3px;
      padding-top: 5px;
      position: sticky;
      margin-top: 12px;
      right: 20px;
      display: flex;
      color: #084c69;
      font-size: 0.8em;
      align-items: center;
      justify-content: flex-end;
      margin-left: -20px;
      margin-right: -20px;
      padding-right: 20px;
      a {
        transform: translateY(-5px);
        font-size: 0.9em;
      }
      nth-toggle {
        margin-left: 5px;
      }
    }

    nth-intro {
      margin-top: -79px;
      display: block;
    }
    @media only screen and (max-width: 600px) {
      display: block;
      max-width: 100%;
      padding: 30px;
      .toggle-fallback {
        margin-top: 0px;
        background: white;
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
            <nth-getting-started></nth-getting-started>
            <nth-components></nth-components>
            <p>
              <br /><br />
              ...to be continued
            </p>
          </main>
        </div>
      `;
    };
  }
});
