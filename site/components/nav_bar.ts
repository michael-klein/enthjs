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
} from '../../dist/src/index.js';
import { getCss } from '../utils.ts';

component('nth-navbar', () => {
  const css = getCss();
  return {
    render: () => {
      return html`
        <nav
          ${css`
            background: black;
            color: #f1f2f2;
            padding-top: 20px;
            padding-bottom: 20px;
            font-family: 'Rubik', sans-serif;
          `}
        >
          <nth-container>
            <div
              ${css`
                display: flex;
              `}
            >
              <div
                ${css`
                  color: #a2a9a9;
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