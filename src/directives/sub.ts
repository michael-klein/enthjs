import { createDirective, DOMUpdateType, DOMUpdate } from '../directive';
import { HTMLResult } from '../html';
import { render } from '../render';

export const sub = createDirective(function*(
  node: Text,
  htmlResult: HTMLResult
) {
  if (node.nodeType === 3) {
    const start = document.createComment('');
    let result: DOMUpdate[] = [
      {
        type: DOMUpdateType.REPLACE_NODE,
        node,
        newNode: start as any,
      },
    ];
    let prevTemplate: HTMLTemplateElement;
    let prevFrag: DocumentFragment;
    let prevChildren: Node[] = [];
    for (;;) {
      if (prevTemplate === htmlResult.template) {
        render(prevFrag as any, htmlResult);
      } else {
        const frag = document.createDocumentFragment();
        render(frag as any, htmlResult);
        prevChildren.forEach(child => {
          result.push({
            type: DOMUpdateType.REMOVE,
            node: child,
          });
        });
        prevChildren = [];
        frag.childNodes.forEach(child => {
          prevChildren.push(child);
          result.push({
            type: DOMUpdateType.INSERT_BEFORE,
            node: start,
            newNode: child,
          });
        });
        prevTemplate = htmlResult.template;
        prevFrag = frag;
      }
      htmlResult = (yield result)[0];
      result = [];
    }
  }
});
