import {
  html,
  $attr,
  text,
  on,
  input,
  $state,
  $prop,
  getElement,
  sideEffect,
  component,
  list,
  sub,
  key,
  clss,
} from '../../src/index.ts';
import { getCss } from '../utils.ts';

component('nth-navbar', () => {
  const css = getCss();
  return {
    render: () => {
      return html`
        <nav
          ${css`
            position: fixed;
            width: 100%;
            background: black;
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
              <div
                ${css`
                  color: #a2a9a9;
                  font-size: 1.3em;
                  > span {
                    color: #ea5353;
                  }
                `}
              >
                e<span>nth</span>-js
              </div>
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
