import { component, html, createEvent } from '../../dist/src/index.js';

component('todo-item', function*(state) {
  const doneClicked = createEvent('doneclicked');
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
          <button onclick="${e => doneClicked()}">
            ${!done ? 'done' : 'not done'}
          </button>
        </li>
      `;
    };
  }
});
