import { html, component } from '../../src/index.ts';
import { getCss } from '../utils.ts';
import { sub, prop } from '../../src';

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
            margin-top: 74px;
          `}
        ></div>
        <nav
          ${css`
            position: fixed;
            width: 100%;
            background: #098ba7;
            top: 0px;
            color: #f1f2f2;
            padding-top: 20px;
            padding-bottom: 20px;
            font-family: 'Rubik', sans-serif;
            z-index: 100;
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
                  <nth-link ${prop('css', getLinkCss)} path="/docs"
                    >Docs</nth-link
                  >
                </div>
                <div>Github</div>
              </div>
            </div>
          </nth-container>
        </nav>
      `;
    },
  };
});
