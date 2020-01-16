import { component, html } from '../../dist/src/index.js';

function createItem(label) {
  return {
    label,
    done: false,
    id: `item-${Date.now()}-${label.replace(/ /g, '-')}`,
  };
}

component('todo-app', function*(state) {
  state.items = [createItem('todo item')];

  function inputKeyUpHandler(e) {
    if (e.key === 'Enter') {
      state.items.unshift(createItem(state.inputValue));
      state.inputValue = '';
    }
  }

  for (;;) {
    yield () => {
      const { items = [], inputValue = '' } = state;
      return html`
        <div>
          <input
            type="text"
            placeholder="add todo item"
            .value="${inputValue}"
            oninput="${e => (state.inputValue = e.target.value)}"
            onkeyup="${inputKeyUpHandler}"
          />
        </div>
        <ul>
          ${items
            .filter(item => !item.done)
            .map(
              item => html`
                <todo-item
                  key="${item.id}"
                  label="${item.label}"
                  .done="${item.done}"
                ></todo-item>
              `
            )}
        </ul>
      `;
    };
  }
});
