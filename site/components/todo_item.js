import { component, html } from '../../dist/src/index.js';

component('todo-item', function*(state) {
  for (;;) {
    yield () => {
      const { items = [], properties, attributes } = state;
      const { done } = properties;
      const { label = '' } = attributes;
      return html`
        <li>
          <span
            >${done
              ? html`
                  <s>${label}</s>
                `
              : html`
                  ${label}
                `}
          </span>
          ${html`
            <button onclick="${e => console.log(e)}">
              ${!done ? 'done' : 'not done'}
            </button>
          `}
        </li>
      `;
    };
  }
});
