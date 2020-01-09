import { createDirective, DOMUpdateType, DOMUpdate } from '../directive';
import { HTMLResult, DirectiveType } from '../html';
import { render } from '../render';

export const sub = createDirective(async function*(
  node: Text,
  htmlResult: HTMLResult
) {
  if (this.type === DirectiveType.TEXT) {
    const start = document.createComment('');
    let result: DOMUpdate[] = [
      {
        type: DOMUpdateType.REPLACE_NODE,
        node,
        newNode: start as any,
      },
    ];
    let prevParts: TemplateStringsArray;
    let prevFrag: DocumentFragment;
    let prevChildren: Node[] = [];
    for (;;) {
      if (prevParts === htmlResult.staticParts) {
        await render(prevFrag as any, htmlResult);
      } else {
        const frag = document.createDocumentFragment();
        await render(frag as any, htmlResult);
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
        prevParts = htmlResult.staticParts;
        prevFrag = frag;
      }
      htmlResult = (yield result)[0];
      result = [];
    }
  }
});
