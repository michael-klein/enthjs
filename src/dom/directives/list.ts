import { createDirective, DOMUpdateType, DOMUpdate } from '../directive';
import { HTMLResult } from '../html';
import { render } from '../render';

export function getKey(htmlResult: HTMLResult): string {
  for (const dynamicData of htmlResult.dynamicData) {
    if (dynamicData.attribute === 'key') {
      dynamicData.directive = key(dynamicData.staticValue);
      delete dynamicData.staticValue;
    }
    if (dynamicData.directive) {
      if ((dynamicData.directive.directive as any) === key) {
        return dynamicData.directive.args[0];
      }
    }
  }
  return htmlResult.staticParts.join();
}

export const list = createDirective(function*(
  node: Text,
  htmlResults: HTMLResult[]
) {
  if (node.nodeType === 3) {
    const root = document.createDocumentFragment();
    const end = document.createComment('');
    const start = document.createComment('');
    root.appendChild(start);
    root.appendChild(end);
    const keyToFragmentsMap: Map<string, [DocumentFragment, Node]> = new Map();
    let results: DOMUpdate[] = [
      {
        type: DOMUpdateType.REPLACE_NODE,
        node,
        newNode: root,
      },
    ];
    let oldKeyOrder: string[] = [];
    for (;;) {
      const keyOrder: string[] = htmlResults.map(result => {
        const key = getKey(result);
        if (!keyToFragmentsMap.has(key)) {
          const frag = document.createDocumentFragment();
          render(frag as any, result);
          if (frag.childNodes.length > 1) {
            throw 'List items should only render a single node!';
          }
          keyToFragmentsMap.set(key, [frag, frag.childNodes[0]]);
        } else {
          const frag = keyToFragmentsMap.get(key)[0] as DocumentFragment;
          render(frag as any, result);
        }
        return key;
      });

      function tryInsert(
        key: string,
        oldIndex: number,
        newIndex: number
      ): void {
        const next = keyOrder[newIndex + 1];
        const nextIndex = keyOrder.indexOf(next);
        if (nextIndex === -1) {
          if (
            oldIndex < Math.max(0, oldKeyOrder.length - 1) ||
            newIndex === -1
          ) {
            results.push({
              type: DOMUpdateType.INSERT_BEFORE,
              node: end,
              newNode: keyToFragmentsMap.get(key)[1],
            });
            if (oldIndex > -1) {
              oldKeyOrder.splice(oldIndex, 1);
            }
            oldKeyOrder.push(key);
          }
        } else if (oldKeyOrder.indexOf(next) === nextIndex) {
          results.push({
            type: DOMUpdateType.INSERT_BEFORE,
            node: keyToFragmentsMap.get(next)[1],
            newNode: keyToFragmentsMap.get(key)[1],
          });
          if (oldIndex > -1) {
            oldKeyOrder.splice(oldIndex, 1);
          }
          oldKeyOrder.splice(oldKeyOrder.indexOf(next), 0, key);
        } else {
          const previous = keyOrder[newIndex - 1];
          const previousIndex = keyOrder.indexOf(previous);
          if (previousIndex === -1) {
            results.push({
              type: DOMUpdateType.INSERT_AFTER,
              node: start,
              newNode: keyToFragmentsMap.get(key)[1],
            });
            if (oldIndex > -1) {
              oldKeyOrder.splice(oldIndex, 1);
            }
            oldKeyOrder.unshift(key);
          } else if (oldKeyOrder.indexOf(previous) === previousIndex) {
            results.push({
              type: DOMUpdateType.INSERT_AFTER,
              node: keyToFragmentsMap.get(previous)[1],
              newNode: keyToFragmentsMap.get(key)[1],
            });
            if (oldIndex > -1) {
              oldKeyOrder.splice(oldIndex, 1);
            }
            oldKeyOrder.splice(oldKeyOrder.indexOf(next) + 1, 0, key);
          }
        }
      }

      function handleKey(key: string): void {
        const oldIndex = oldKeyOrder.indexOf(key);
        const newIndex = keyOrder.indexOf(key);
        if (oldIndex !== newIndex) {
          if (oldIndex > -1 && newIndex === -1) {
            results.push({
              type: DOMUpdateType.REMOVE,
              node: keyToFragmentsMap.get(key)[1],
            });
            oldKeyOrder.splice(oldIndex, 1);
          } else {
            tryInsert(key, oldIndex, newIndex);
          }
        }
      }
      let j = 0;
      while (keyOrder.join() !== oldKeyOrder.join()) {
        j++;
        if (j > keyOrder.length) {
          break;
        }
        const oldKeyOrderCopy = [...oldKeyOrder];
        const keyOrderCopy = [...keyOrder];
        for (
          let i = 0;
          i < Math.max(oldKeyOrder.length, keyOrder.length);
          i++
        ) {
          let key = oldKeyOrderCopy[i];
          if (key && keyOrder.indexOf(key) !== i) {
            handleKey(key);
          }
          key = keyOrderCopy[i];
          if (key && oldKeyOrder.indexOf(key) !== i) {
            handleKey(key);
          }
        }
      }
      htmlResults = (yield results)[0];
      results = [];
    }
  }
});

export const key = createDirective(function*(
  node: HTMLElement,
  _keyName: string
) {
  node.removeAttribute('key');
});
