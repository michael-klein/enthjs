import { component, html } from '../../dist/src/index.js';

function createItem(label) {
  return {
    label,
    done: false,
    id: `item-${Date.now()}-${label.replace(/ /g, '-')}`,
  };
}
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
component('todo-app', function*(state) {
  state.items = [createItem('todo item')];

  function inputKeyUpHandler(e) {
    if (e.key === 'Enter') {
      state.items.unshift(createItem(state.inputValue));
      state.inputValue = '';
    }
  }

  function toggleDone(item) {
    item.done = !item.done;
  }

  for (;;) {
    yield () => {
      const { items = [], inputValue = '' } = state;
      const done = items.filter(item => item.done);
      const notDone = items.filter(item => !item.done);
      const sorted = [...notDone, ...done];
      return html`
        <div>
          <button onclick="${() => shuffle(state.items)}">shuffle</button>
          <input
            type="text"
            placeholder="add todo item"
            .value="${inputValue}"
            oninput="${e => (state.inputValue = e.target.value)}"
            onkeyup="${inputKeyUpHandler}"
          />
        </div>
        <ul>
          ${sorted.map(
            item => html`
              <todo-item
                key="${item.id}"
                label="${item.label}"
                .done="${item.done}"
                ondoneclicked="${() => toggleDone(item)}"
              ></todo-item>
            `
          )}
        </ul>
      `;
    };
  }
});
