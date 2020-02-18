import { html, render, $state, proxify, component } from "../src/index.js";

const state = $state({ input: "", component: true });
function shuffle(a) {
  a.unshift(a.pop());
  return a;
}
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const Component = component(function*() {
  for (;;) {
    yield html`
      <div>
        <div>hello</div>
        <span>world</span>
      </div>
    `;
  }
});
state.on(() => {
  const template = html`
    <div>
      count: ${state.count}
      <button onclick="${() => state.count++}">+</button>
    </div>
    <div>input value:${state.input}</div>
    <input type="text" oninput="${e => (state.input = e.target.value)}" />
    <ul>
      ${shuffle(arr).map(a => {
        return html`
          <li key=${a}><span>${a}</span></li>
        `;
      })}
    </ul>
    ${state.component
      ? html`
          <${Component} />
        `
      : html``}
    <div>ho</div>
    <button onclick="${() => (state.component = !state.component)}">
      toggle
    </button>
  `;
  render(document.getElementById("app"), template);
});

state.count = 0;
