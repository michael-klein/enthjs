import 'regenerator-runtime/runtime';
import { html, DirectiveType } from '../src/dom/html';
import { render, defineFallback } from '../src/dom/render';
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
          ${html`
            <div>
              <div>${'hello'}</div>
              <div>
                ${html`
                  <span>foo</span>
                `}
              </div>
              <div ${'loool'} ${attr('data-test', `${count}`)}>
                ${`${count}`}
              </div>
            </div>
          `}
        </div>
        <div>
          ${html`
            <div>
              <div ${count}>${'world'}</div>
              <div ${'loool'}>${count}</div>
            </div>
          `}
        </div>
        <div>
          <div>input value: ${value}</div>
          <div>
            <input
              type="text"
              value="${value}"
              ${input(v => {
                value = v;
                queueRender();
              })}
            />
          </div>
        </div>
      `
    ).then(() => {
      renderPromise = undefined;
      if (nextQueued) {
        nextQueued = false;
        queueRender();
      }
    });
  } else {
    nextQueued = true;
  }
}

setInterval(() => {
  count++;
  queueRender();
}, 1000);

defineFallback(data => {
  if (
    data.type === DirectiveType.TEXT &&
    (typeof data.staticValue === 'string' ||
      typeof data.staticValue === 'number')
  ) {
    data.directive = text(data.staticValue + '');
  }
  if (
    data.type === DirectiveType.ATTRIBUTE_VALUE &&
    (typeof data.staticValue === 'string' ||
      typeof data.staticValue === 'number')
  ) {
    data.directive = attr(data.attribute, data.staticValue + '');
  }
  if (
    data.type === DirectiveType.TEXT &&
    typeof data.staticValue === 'object' &&
    data.staticValue.dynamicData
  ) {
    data.directive = sub(data.staticValue);
  }
  return data;
});
