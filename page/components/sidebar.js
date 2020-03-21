import { html, component, sideEffect } from "../../src/index.js";
import { getCss } from "../utils.js";

component("enthjs-sidebar", function*(state) {
  const css = getCss();

  function renderLogo() {
    const logoClass = css`
      width: 258px;
      text-align: justify;

      .enthjs {
        line-height: 1;
        margin-bottom: 0.5rem;
        font-size: 3rem;
        opacity: 1;
        transition: opacity 1.5s 0.5s ease;
        &.transition-start {
          opacity: 0;
        }
      }
      .sub {
        opacity: 1;
        transition: opacity 1.5s 1s ease;
        &.transition-start {
          opacity: 0;
        }
      }
    `;
    return html`
      <div class="${logoClass}">
        <div class="bungee enthjs" @transition=${{ in: 2000 }}>ENTHJS</div>
        <div class="sub" @transition=${{ in: 2500 }}>
          Not (?) just the nth JavaScript framework you found this week!
        </div>
      </div>
    `;
  }

  function renderNav() {
    const navClass = css`
      margin-top: 3rem;
      ul {
        line-height: 1.6rem;
        li {
          font-size: 1.3rem;
          ul {
            padding-bottom: 1rem;
            li {
              font-size: 1rem;
              padding-left: 1rem;
            }
          }
        }
      }
      a {
        color: inherit;
        text-decoration: none;
        &:href,
        &:link,
        &:active,
        &:hover {
          color: inherit;
          text-decoration: none;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    `;
    return html`
      <nav class="${navClass} darker">
        <ul>
          <li>
            <a href="#">Intro</a>
            <ul>
              <li>
                <a href="#production-ready">Is this ready for production?</a>
              </li>
            </ul>
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
                <a href="#attributes-properties">Attributes &amp; Props</a>
              </li>
              <li><a href="#side-effects">Side effects</a></li>
              <li><a href="#custom-events">Custom Events</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    `;
  }

  const sideBarClass = css`
    width: 100%;
    height: 100%;
    max-width: 300px;
    padding-top: 40px;
    padding-bottom: 40px;
    padding-right: 20px;

    position: relative;
  `;

  for (;;) {
    yield html`
      <div class=${sideBarClass}>
        ${renderLogo()} ${renderNav()}
      </div>
    `;
  }
});
