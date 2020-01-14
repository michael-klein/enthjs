import 'regenerator-runtime/runtime';
import { html } from '../src/dom/html';
import { attr } from '../src/dom/directives/attr';
import { input } from '../src/dom/directives/input';
import { component, sideEffect } from '../src/dom/component';
import { State, $state } from '../src/reactivity/reactivity';
import './init';

// basically what custom hooks are in react
function countUp(): State<{ count: number }> {
  const $count = $state({ count: 0 });

  // like useEffect
  // will be called on every render
  // since the main part of the component (before the for loop)
  // is NOT re-run on every render, we don't need to deal with
  // stale closures
  sideEffect(
    () => {
      const id = setInterval(() => {
        $count.count = ($count.count ?? 0) + 1;
      }, 1000);
      return () => clearInterval(id); // cleanUp
    },
    () => [] // dependencies, like in useEffect
  );

  return $count;
}

component<{ count: number; value: string }>('test-component', function*(
  // whenever state changes, the component will re-render
  // state will eventually also container values/props on the host element
  state
) {
  const $count = countUp();
  state.merge($count);

  // we can set up the state, register sideEffects etc before this for loop
  // since that is only run once on initialization
  for (;;) {
    // a re-render means getting the next
    // render function from this generator and running it
    yield () => {
      const { value = '', count = 0 } = state;

      function renderCounter() {
        return html`
          <div>
            ${html`
              <div>
                <div>${'hello world'}</div>
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
        `;
      }

      function renderInput() {
        return html`
          <div>
            <div>input value: ${value}</div>
            <div>
              <input
                type="text"
                value="${value}"
                ${input(v => {
                  state.attributes.foo = v;
                  state.value = v;
                })}
              />
            </div>
          </div>
        `;
      }

      return html`
        <p>
          ${renderCounter()}
        </p>
        <p>${renderInput()}</p>
      `;
    };
  }
});
