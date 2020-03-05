import { html, render, component } from "../src/index.js";
import { sideEffect } from "../src/component.js";

function shuffle(a) {
  a.unshift(a.pop());
  return a;
}
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

component("test-component2", function*(state) {
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
      <div>time two: ${state.attributes.test * 2}</div>
    `;
  }
});
component("test-component", function*(state) {
  state.count = 0;
  state.showComp2 = true;
  for (;;) {
    yield html`
      <style>
        test-component2 {
          display: block;
          transition: opacity 4s;
          opacity: 1;
        }
        test-component2.transition-start {
          opacity: 0;
        }
        test-component2.transition-fade-in {
          opacity: 1;
        }
        test-component2.transition-fade-out {
          opacity: 0;
        }
      </style>
      <div>
        <span>count: ${state.count} </span>
        <button onclick="${() => state.count++}">+</button>
      </div>
      ${state.showComp2 &&
        html`
          <test-component2
            test=${state.count}
            @transition=${{ in: 4000, out: 2000 }}
          />
        `}
      <button onclick=${e => (state.showComp2 = !state.showComp2)}>
        toggle test-component2
      </button>
      <div>input value:${state.input}</div>
      <input
        type="text"
        .value=${state.input}
        oninput="${e => {
          state.input = e.target.value;
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
    <test-component />
  </div>
`;
render(document.getElementById("app"), template);
