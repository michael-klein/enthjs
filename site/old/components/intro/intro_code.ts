import {
  html,
  $state,
  sideEffect,
  component,
  sub,
  attr,
  prop,
  getElement,
} from '../../../../src/export';
import { getCss } from '../../utils.ts';
import { computerAnimation } from '../animations/computer_animation';
import { getIsInView } from '../../utils';

component('nth-intro-section-code', () => {
  const css = getCss();
  const $isInView = getIsInView();
  return {
    watch: [$isInView],
    render: () => html`
      <div
        ${css`
          background: #098ba7;
          margin-top: 100px;
          padding-top: 40px;
          padding-bottom: 40px;
        `}
      >
        <nth-container>
          <div
            ${css`
              color: white;
              font-size: 2em;
              font-family: 'Rubik', sans-serif;
              text-align: center;
              margin-bottom: 10px;
              opacity: ${$isInView.value ? '1' : '0'};
              transition: all 1s;
            `}
          >
            Here's the obligatory example todo app:
          </div>
          <div
            ${css`
              display: flex;
            `}
          >
            <div
              ${css`
                max-height: 500px;
                flex: auto;
                opacity: ${$isInView.value ? '1' : '0'};
                transition: all 1s;
                transition-delay: 0.5s;
              `}
            >
              <nth-highlight
                ${attr('style', 'max-height: 400px;')}
                ${prop(
                  'code',
                  `
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
                prop
              } from "enthjs";
              
              component("todo-item", () => {
                const $label = $attr("label");
                const $onUpArrowClicked = $prop("onUpArrowClicked");
                const $done = $prop("done");
                const $onDownArrowClicked = $prop("onDownArrowClicked");
                const $onCheckClicked = $prop("onCheckClicked");
              
                function renderNotDoneItem() {
                  return html\`
                    <li>
                      <button \${on("click", () => $onCheckClicked.value())}>✓</button>
                      <button \${on("click", () => $onUpArrowClicked.value())}>🠝</button>
                      <button \${on("click", () => $onDownArrowClicked.value())}>🠟</button>
                      \${text($label.value)}
                    </li>
                  \`;
                }
              
                function renderDoneItem() {
                  return html\`
                    <li style="text-decoration: line-through;">
                      <button \${on("click", () => $onCheckClicked.value())}>x</button>
                      \${text($label.value)}
                    </li>
                  \`;
                }
              
                return {
                  watch: [$label, $onUpArrowClicked, $onDownArrowClicked, $done],
                  render: () => {
                    return html\`
                      \${sub($done.value ? renderDoneItem() : renderNotDoneItem())}
                    \`;
                  }
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
                return "item_" + Date.now();
              }
              
              component("todo-list", () => {
                const $list = $state({
                  items: [{ label: "item1", id: generateItemId(), done: false }]
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
                  if (e.key === "Enter" && e.target.value.length > 0) {
                    $list.items.push({ label: e.target.value, id: generateItemId() });
                    e.target.value = "";
                  }
                }
              
                function renderItem(item, done) {
                  return html\`
                    <todo-item
                      \${prop("onUpArrowClicked", () => moveItemUp(item.id))}
                      \${prop("onDownArrowClicked", () => moveItemDown(item.id))}
                      \${prop("onCheckClicked", () => (item.done = !item.done))}
                      \${prop("done", done)}
                      \${key(item.id)}
                      \${attr("label", item.label)}
                      \${attr("id", item.id)}
                    />
                  \`;
                }
              
                return {
                  watch: [$list],
                  render: () => {
                    return html\`
                      <div>
                        <div>
                          <input
                            type="text"
                            placeholder="add task"
                            \${on("keyup", addItemEntered)}
                          />
                        </div>
                        <ul>
                          \${list(
                            $list.items
                              .filter(item => !item.done)
                              .map(item => renderItem(item, false))
                          )}
                        </ul>
                        <ul>
                          \${list(
                            $list.items
                              .filter(item => item.done)
                              .map(item => renderItem(item, true))
                          )}
                        </ul>
                      </div>
                    \`;
                  }
                };
              });              
              `
                )}
              >
              </nth-highlight>
            </div>
            <div
              ${css`
                background: #14505d;
                padding: 10px;
                border-radius: 4px;
                box-shadow: inset 0 0 3px #0000006b;
                color: white;
                min-width: 40%;
                margin-left: 10px;
                overflow: auto;
                opacity: ${$isInView.value ? '1' : '0'};
                transition: all 1s;
                transition-delay: 1s;
              `}
            >
              <nth-todo-list></nth-todo-list>
            </div>
          </div>
        </nth-container>
      </div>
    `,
  };
});
