import {
  html,
  $attr,
  text,
  attr,
  on,
  $state,
  $prop,
  component,
  list,
  key,
  sub,
  prop,
} from '../../../src/export';

component('nth-todo-item', () => {
  const $label = $attr('label');
  const $onUpArrowClicked = $prop('onUpArrowClicked');
  const $done = $prop('done');
  const $onDownArrowClicked = $prop('onDownArrowClicked');
  const $onCheckClicked = $prop('onCheckClicked');

  function renderNotDoneItem() {
    return html`
      <li>
        <button ${on('click', () => $onCheckClicked.value())}>✓</button>
        <button ${on('click', () => $onUpArrowClicked.value())}>🠝</button>
        <button ${on('click', () => $onDownArrowClicked.value())}>🠟</button>
        ${text($label.value)}
      </li>
    `;
  }

  function renderDoneItem() {
    return html`
      <li style="text-decoration: line-through;">
        <button ${on('click', () => $onCheckClicked.value())}>x</button>
        ${text($label.value)}
      </li>
    `;
  }

  return {
    watch: [$label, $onUpArrowClicked, $onDownArrowClicked, $done],
    render: () => {
      return html`
        ${sub($done.value ? renderDoneItem() : renderNotDoneItem())}
      `;
    },
  };
});

function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
}

function generateItemId() {
  return 'item_' + Date.now();
}

component('nth-todo-list', () => {
  const $list = $state({
    items: [{ label: 'item1', id: generateItemId(), done: false }],
  });

  function moveItemUp(id) {
    const index = $list.items.findIndex(item => item.id === id);
    if (index > 0) {
      arrayMove($list.items, index, index - 1);
    }
  }
  function moveItemDown(id) {
    const index = $list.items.findIndex(item => item.id === id);
    if (index < $list.items.length - 1) {
      arrayMove($list.items, index, index + 1);
    }
  }

  function addItemEntered(e) {
    if (e.key === 'Enter' && e.target.value.length > 0) {
      $list.items.push({ label: e.target.value, id: generateItemId() });
      e.target.value = '';
    }
  }

  function renderItem(item, done) {
    return html`
      <nth-todo-item
        ${prop('onUpArrowClicked', () => moveItemUp(item.id))}
        ${prop('onDownArrowClicked', () => moveItemDown(item.id))}
        ${prop('onCheckClicked', () => (item.done = !item.done))}
        ${prop('done', done)}
        ${key(item.id)}
        ${attr('label', item.label)}
        ${attr('id', item.id)}
      />
    `;
  }

  return {
    watch: [$list],
    render: () => {
      return html`
        <div>
          <div>
            <input
              type="text"
              placeholder="add task"
              ${on('keyup', addItemEntered)}
            />
          </div>
          <ul>
            ${list(
              $list.items
                .filter(item => !item.done)
                .map(item => renderItem(item, false))
            )}
          </ul>
          <ul>
            ${list(
              $list.items
                .filter(item => item.done)
                .map(item => renderItem(item, true))
            )}
          </ul>
        </div>
      `;
    },
  };
});
