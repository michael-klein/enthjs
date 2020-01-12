import 'regenerator-runtime/runtime';
import { html, DirectiveType } from '../src/dom/html';
import { render, defineFallback } from '../src/dom/render';
import { text } from '../src/dom/directives/text';
import { sub } from '../src/dom/directives/sub';
import { attr } from '../src/dom/directives/attr';
import { input } from '../src/dom/directives/input';
import { component, connected } from '../src/dom/component';
import { State, $state } from '../src/reactivity/reactivity';

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

function countUp(): State<{ count: number }> {
  const $count = $state({ count: 0 });
  connected(() => {
    const id = setInterval(() => {
      $count.count++;
    }, 1000);
    return () => clearInterval(id);
  });
  return $count;
}

component('test-component', function*(
  state: State<{ count: number; value: string }>
) {
  state.value = '';
  state.count = 0;

  const $count = countUp();
  state.merge($count);

  for (;;) {
    yield () => {
      const { value, count } = state;
      return html`
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
                state.value = v;
              })}
            />
          </div>
        </div>
      `;
    };
  }
});
