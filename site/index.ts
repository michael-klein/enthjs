import 'regenerator-runtime/runtime';
import { html, DirectiveType } from '../src/dom/html';
import { render } from '../src/dom/render';
import { text } from '../src/dom/directives/text';
import { sub } from '../src/dom/directives/sub';
import { attr } from '../src/dom/directives/attr';
import { input } from '../src/dom/directives/input';

let count = 0;
let renderPromise: Promise<void>;
let nextQueued = false;
let value = '';
function queueRender() {
  if (!renderPromise) {
    renderPromise = render(
      document.body,
      html`
        <div>
          ${sub(html`
            <div>
              <div>${'hello'}</div>
              <div>
                ${html`
                  <span>foo</span>
                `}
              </div>
              <div ${'loool'} ${attr('data-test', `${count}`)}>
                ${text(`${count}`)}
              </div>
            </div>
          `)}
        </div>
        <div>
          ${sub(html`
            <div>
              <div ${text(`${count}`)}>${'world'}</div>
              <div ${'loool'}>${text(`${count}`)}</div>
            </div>
          `)}
        </div>
        <div>
          <div>input value: ${value}</div>
          <div>
            <input
              type="text"
              ${attr('value', value)}
              ${input(v => {
                value = v;
                queueRender();
              })}
            />
          </div>
        </div>
      `,
      data => {
        if (
          (data.type === DirectiveType.TEXT &&
            typeof data.staticValue === 'string') ||
          typeof data.staticValue === 'number'
        ) {
          data.directive = text(data.staticValue + '');
        }
        if (
          data.type === DirectiveType.TEXT &&
          typeof data.staticValue === 'object' &&
          data.staticValue.dynamicData
        ) {
          data.directive = sub(data.staticValue);
        }
        return data;
      }
    ).then(() => {
      renderPromise = undefined;
    });
  } else {
    if (nextQueued) {
      renderPromise.then(() => {
        nextQueued = undefined;
        queueRender();
      });
    }
  }
}

setInterval(() => {
  count++;
  queueRender();
}, 1000);
