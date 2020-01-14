import { createDirective, DOMUpdateType, DOMUpdate } from '../directive';
import { HTMLResult, getAttributeMarker, isDirective } from '../html';
import { render } from '../render';

export function getKey(
  htmlResult: HTMLResult,
  template: HTMLTemplateElement
): string {
  let id: number = 0;
  for (const dynamicData of htmlResult.dynamicData) {
    if (isDirective(dynamicData)) {
      if ((dynamicData.directive.directive as any) === key) {
        const listNode = template.content.querySelector(
          `[${getAttributeMarker(id)}]`
        );
        if (listNode && !listNode.parentElement)
          return dynamicData.directive.args[0];
      }
    }
    id++;
  }
  return htmlResult.staticParts.join();
}

export const list = createDirective(function*(
  node: Text,
  htmlResults: HTMLResult[]
) {
  if (node.nodeType === 3) {
    const { template } = this;
    const root = document.createDocumentFragment();
    const start = document.createComment('');
    root.appendChild(start);
    const keyToFragmentsMap: Map<
      string,
      (DocumentFragment | Node)[]
    > = new Map();
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
        const key = getKey(result, template);
        if (!keyToFragmentsMap.has(key)) {
          const frag = document.createDocumentFragment();
          render(frag as any, result);
          keyToFragmentsMap.set(key, [frag, ...Array.from(frag.childNodes)]);
        } else {
          const frag = keyToFragmentsMap.get(key)[0] as DocumentFragment;
          render(frag as any, result);
        }
        return key;
      });
      if (oldKeyOrder.join('') !== keyOrder.join('')) {
        results = results.concat(
          keyOrder.flatMap(newKey => {
            const oldIndex = oldKeyOrder.indexOf(newKey);
            if (oldIndex > -1) {
              oldKeyOrder.splice(oldIndex, 1);
            }
            const [, ...children] = keyToFragmentsMap.get(newKey);
            return children.map(child => {
              return {
                type: DOMUpdateType.INSERT_BEFORE,
                node: start,
                newNode: child,
              } as DOMUpdate;
            });
          })
        );
        results = results.concat(
          oldKeyOrder.flatMap(oldKey => {
            const [, ...children] = keyToFragmentsMap.get(oldKey);
            keyToFragmentsMap.delete(oldKey);
            return children.map(child => {
              return {
                type: DOMUpdateType.REMOVE,
                node: child,
              } as DOMUpdate;
            });
          })
        );
      }
      oldKeyOrder = keyOrder;
      htmlResults = (yield results)[0];
      results = [];
    }
  }
});

export const key = createDirective(function*(_node: Text, _keyName: string) {});
