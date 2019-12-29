import { html, component } from '../../src/index.ts';
import { getCss } from '../utils.ts';
import { sub } from '../../src';

component('nth-navbar', () => {
  const css = getCss();

  function renderLogo() {
    return html`
      <div
        ${css`
          color: #a2a9a9;
          font-size: 1.3em;
          background: #1a505b;
          padding: 5px;
          box-shadow: inset 0 0 3px #0000006b;
          border-radius: 4px;
          position: relative;
          white-space: nowrap;
          > span {
            color: #ea5353;
          }
        `}
      >
        <div
          ${css`
            position: absolute;
            right: -2.5em;
            top: -0.7em;
            font-size: 0.5em;
            letter-spacing: 0.05em;
            color: white;
            border: 1px solid #e45b5b;
            background: #ea5353;
            padding: 2px;
            border-radius: 2px;
          `}
        >
          alpha
        </div>
        e<span>nth</span>-js
      </div>
    `;
  }
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
              ${sub(renderLogo())}
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
                  a,
                  a:link,
                  a:active,
                  a:hover {
                    text-decoration: none;
                    color: inherit;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
                `}
              >
                <div><a href="#/">Intro</a></div>
                <div><a href="#/getting-started">Getting started</a></div>
                <div><a href="#/docs">Docs</a></div>
                <div>Github</div>
              </div>
            </div>
          </nth-container>
        </nav>
      `;
    },
  };
});
