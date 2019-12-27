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
import web_window from '../images/web_window2.svg';
component('nth-intro', () => {
  const css = getCss();
  return {
    render: () => {
      return html`
        <div ${css`
          background: black;
          padding-top: 50px;
        `}>
          <nth-container>
            <div ${css`
              display: flex;
            `}>
              <div ${css`
                flex: 1;
                color: white;
                font-size: 2.5em;
                font-family: 'Rubik', sans-serif;
                display: flex;
                align-items: center;
                padding-bottom: 50px;
              `}> 
                <div ${css`
                  max-width: 90%;
                `}>
                Not just the <span ${css`
                  color: #ea5353;
                `}>nth</span> JavaScript framework you found today!
              </div>
            </div>
              <div ${css`
                flex: 1;
                overflow: hidden;
              `}>
                <img src="${web_window}" ${css`
        width: 140%;
        margin-left: -16%;
      `} />
              </div>
            </div>
          </nth-container>
        </nav>
      `;
    },
  };
});
