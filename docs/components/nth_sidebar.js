import { component, html, sideEffect, getHost } from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-sidebar', function * (state) {
  const className = css`
    position: fixed;
    top: 30px;
    display: flex;
    flex-direction: column;
    width: 170px;
    max-height: 100%;
    z-index: 1000;
    .logo {
      font-size: 2em;
      font-weight: bold;
      border: 3px solid #297491;
      padding-right: 50px;
      padding-top: 50px;
      padding-left: 15px;
      padding-bottom: 15px;
      margin-top: 0px;
      color: #084c69;
      .nth {
        color: #1f81a6;
      }
    }
    .slogan {
      font-size: 0.9em;
      line-height: 1.2em;
      padding: 10px;
      padding-top: 8px;
      background: #297491;
      color: white;
      font-weight: normal;
      font-style: normal;
    }
    nav {
      display: block;
      padding-right: 15px;
      font-size: 0.9em;
      overflow: auto;
      z-index: 2000;
      ul {
        margin: 0;
        padding: 0;
        padding-top: 0.8em;
        list-style: none;
        li {
          padding-left: 15px;
          line-height: 1.1em;
          padding-bottom: 0.8em;
        }
      }
      > ul {
        padding-top: 20px;
      }
    }

    @media only screen and (max-width: 600px) {
      width: 100%;
      position: initial;
    }
  `;

  for (;;) {
    yield () => {
      return html`
        <aside class="${className}">
          <div class="logo sans">e<span class="nth">nth</span>.js</div>
          <div class="slogan">
            Not just the nth JavaScript framework you found today! 😉
          </div>
          <nav>
            <ul>
              <li>
                <a href="#">Intro</a>
              </li>
              <li>
                <a href="#getting-started">Getting started</a>
                <ul>
                  <li><a href="#basic-usage">Basic usage</a></li>
                </ul>
              </li>
              <li>
                <a href="#components">Components</a>
                <ul>
                  <li><a href="#host-element">Host element</a></li>
                  <li><a href="#state">State</a></li>
                  <li>
                    <a href="#attributes-properties">Attributes & Props</a>
                  </li>
                  <li><a href="#side-effects">Side effects</a></li>
                  <li><a href="#custom-events">Custom Events</a></li>
                </ul>
              </li>
              <li>
                <a href="#">Directives</a>
                <ul>
                  <li><a href="#">Implementing directives</a></li>
                  <li><a href="#">Fallbacks</a></li>
                  <li>
                    <a href="#">Inbuilts</a>
                    <ul>
                      <li><a href="#">attr</a></li>
                      <li><a href="#">clss</a></li>
                      <li><a href="#">frag</a></li>
                      <li><a href="#">input</a></li>
                      <li><a href="#">list</a></li>
                      <li><a href="#">prop</a></li>
                      <li><a href="#">sub</a></li>
                      <li><a href="#">text</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>
      `;
    };
  }
});
