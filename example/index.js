import { html, render, component } from "../src/index.js";
import { sideEffect } from "../src/component.js";

function shuffle(a) {
  a.unshift(a.pop());
  return a;
}
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Component2 = component(function*(state) {
  let i = 0;
  sideEffect(
    () => {
      const index = i++;
      console.log("effect #" + index);
      return () => {
        console.log("cleanup #" + index);
      };
    },
    () => []
  );

  for (;;) {
    yield html`
      <div>sub: ${state.props.test}</div>
    `;
  }
});
const Component = component(function*(state) {
  state.count = 0;
  state.showComp2 = true;
  for (;;) {
    yield html`
      <div>
        count: ${state.count}
        <button onclick="${() => state.count++}">+</button>
      </div>
      ${state.showComp2 &&
        html`
          <${Component2} test=${state.count} />
        `}
      <button onclick=${e => (state.showComp2 = !state.showComp2)}>
        toggle sub component
      </button>
      <div>input value:${state.input}</div>
      <input
        type="text"
        .value=${state.input}
        oninput="${e => {
          state.input = e.target.value;
          console.log("hi");
        }}"
      />
      <ul>
        ${shuffle(arr).map(a => {
          return html`
            <li key=${a}><span>${a}</span></li>
          `;
        })}
      </ul>
    `;
  }
});
const template = html`
  <h1>test</h1>
  <div>
    <${Component} />
  </div>
`;
render(document.getElementById("app"), template);
