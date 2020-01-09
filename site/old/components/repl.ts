import {
  html,
  component,
  sub,
  getElement,
  sideEffect,
  text,
} from '../../../src';
import { getCss } from '../utils.ts';
import { parse, prettyPrint } from 'recast';
import { schedule } from '../../../src/old/scheduler';

component('nth-repl', () => {
  const css = getCss();
  const element = getElement();
  sideEffect(
    () => {
      element.shadowRoot.appendChild(
        document.querySelector('#codemirrorcss').cloneNode(true)
      );
      element.shadowRoot.appendChild(
        document.querySelector('#codemirrortheme').cloneNode(true)
      );
      schedule(() => {
        requestAnimationFrame(() => {
          CodeMirror(element.shadowRoot.querySelector('#editor'), {
            value: prettyPrint(parse('function myScript(){return 100;}')).code,
            mode: 'javascript',
            lineNumbers: true,
            theme: 'darcula',
          });
        });
      });
      document.body.classList.add('repl');
      return () => document.body.classList.remove('repl');
    },
    () => []
  );
  return {
    render: () => {
      return html`
        <div
          ${css`
            background: white;
            display: flex;
            height: calc(100% - 64px);
            flex-direction: column;
          `}
        >
          <div>
            asdasdasd
          </div>
          <div
            ${css`
              flex: auto;
              display: flex;
            `}
          >
            <div
              ${css`
                flex: 1;
                display: flex;
                flex-direction: column;
              `}
            >
              <div
                id="editor"
                ${css`
                  flex: auto;
                  flex-direction: column;
                  display: flex;
                  .CodeMirror {
                    flex: auto;
                  }
                `}
              ></div>
            </div>
            <div
              ${css`
                flex: 1;
              `}
            >
              fsdfsd
            </div>
          </div>
        </div>
      `;
    },
  };
});
