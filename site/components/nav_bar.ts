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
        <nav
          ${css`
            position: fixed;
            width: 100%;
            background: #098ba7;
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
                `}
              >
                <div>Intro</div>
                <div>Getting started</div>
                <div>Docs</div>
                <div>Github</div>
              </div>
            </div>
          </nth-container>
        </nav>
      `;
    },
  };
});
