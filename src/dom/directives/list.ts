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
    const start = document.createComment('');
    root.appendChild(start);
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
      const inserts: string[] = [];
      const removals: string[] = [...oldKeyOrder];
      const moves: string[] = [];
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
        if (!oldKeyOrder.includes(key)) {
          inserts.push(key);
        } else {
          moves.push(key);
          removals.splice(removals.indexOf(key), 1);
        }
        return key;
      });
      for (const key of inserts) {
        let after: string = null;
        for (let i = keyOrder.indexOf(key) + 1; i < keyOrder.length; i++) {
          after = oldKeyOrder[oldKeyOrder.indexOf(keyOrder[i])];
          if (after) {
            break;
          }
        }
        if (after) {
          results.push({
            type: DOMUpdateType.INSERT_BEFORE,
            node: keyToFragmentsMap.get(after)[1],
            newNode: keyToFragmentsMap.get(key)[1],
          } as DOMUpdate);
          oldKeyOrder.splice(oldKeyOrder.indexOf(after), 0, key);
        } else {
          results.push({
            type: DOMUpdateType.INSERT_BEFORE,
            node: start,
            newNode: keyToFragmentsMap.get(key)[1],
          } as DOMUpdate);
          oldKeyOrder.push(key);
        }
      }
      for (const key of removals) {
        const node = keyToFragmentsMap.get(key)[1];
        results.push({
          type: DOMUpdateType.REMOVE,
          node,
        } as DOMUpdate);
        oldKeyOrder.splice(oldKeyOrder.indexOf(key), 1);
      }
      for (const key of moves) {
        const newKeyIndex = keyOrder.indexOf(key);
        const oldKeyIndex = oldKeyOrder.indexOf(key);
        const node = keyToFragmentsMap.get(key)[1];
        if (newKeyIndex !== oldKeyIndex) {
          if (newKeyIndex < keyOrder.length - 1) {
            results.push({
              type: DOMUpdateType.INSERT_BEFORE,
              node: keyToFragmentsMap.get(keyOrder[newKeyIndex + 1])[1],
              newNode: node,
            } as DOMUpdate);
            oldKeyOrder.splice(oldKeyIndex, 1);
            oldKeyOrder.splice(
              oldKeyOrder.indexOf(keyOrder[newKeyIndex + 1]),
              0,
              key
            );
          } else {
            results.push({
              type: DOMUpdateType.INSERT_BEFORE,
              node: start,
              newNode: node,
            } as DOMUpdate);
            oldKeyOrder.splice(oldKeyIndex, 1);
            oldKeyOrder.push(key);
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
