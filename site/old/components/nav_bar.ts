import { html, component } from '../../src/index.ts';
import { getCss } from '../utils.ts';
import { prop } from '../../../src';
import { GitHub } from 'simple-icons';
component('nth-navbar', () => {
  const css = getCss();
  const getLinkCss = css => css`
    &,
    &:link,
    &:active,
    &:visited {
      text-decoration: none;
      color: white;
    }
    &:hover {
      color: white;
      text-decoration: underline;
    }
    &.active {
      text-decoration: underline;
    }
  `;
  return {
    render: () => {
      return html`
        <div
          ${css`
            height: 64px;
            background: #098ba7;
            @media only screen and (max-width: 600px) {
              display: none;
            }
          `}
        ></div>
        <nav
          ${css`
            position: fixed;
            width: 100%;
            background: #098ba7;
            top: 0px;
            color: #f1f2f2;
            padding-top: 15px;
            padding-bottom: 15px;
            font-family: 'Rubik', sans-serif;
            z-index: 100;
            height: 64px;
            @media only screen and (max-width: 600px) {
              top: initial;
              bottom: 0px;
              height: auto;
            }
          `}
        >
          <nth-container>
            <div
              ${css`
                display: flex;
                align-items: center;
              `}
            >
              <span
                ${css`
                  font-size: 1.3em;
                `}
              >
                <nth-logo
                  ${prop('showAlpha', true)}
                  ${prop('showFullName', true)}
                ></nth-logo
              ></span>
              <div
                ${css`
                  display: flex;
                  flex: auto;
                  justify-content: flex-end;
                  letter-spacing: 0.045em;
                  & > div {
                    flex: none;
                    margin-left: 20px;
                  }
                  @media only screen and (max-width: 600px) {
                    flex-wrap: wrap;
                    line-height: 2em;
                  }
                `}
              >
                <div>
                  <nth-link ${prop('css', getLinkCss)} path="/">Intro</nth-link>
                </div>
                <div>
                  <nth-link ${prop('css', getLinkCss)} path="/getting-started"
                    >Getting started</nth-link
                  >
                </div>
                <div>
                  <nth-link ${prop('css', getLinkCss)} path="/repl"
                    >repl</nth-link
                  >
                </div>
                <div
                  ${css`
                    opacity: 0.5;
                  `}
                >
                  Docs
                </div>
                <div
                  ${css`
                    display: flex;
                    align-items: center;
                    > svg {
                      fill: #e7edee;
                      height: 17px !important;
                      margin-left: 4px;
                      filter: drop-shadow(0px 1px 1.5px rgba(0, 0, 0, 0.3));
                    }
                  `}
                >
                  Github
                  ${GitHub.svg.replace('<svg', '<svg style="height: 17px;" ')}
                </div>
              </div>
            </div>
          </nth-container>
        </nav>
      `;
    },
  };
});
