import { createDirective, DOMUpdateType, DOMUpdate } from '../directive';

export const frag = createDirective(function*(node: Text, html: string) {
  if (node.nodeType === 3) {
    const start = document.createComment('');
    let result: DOMUpdate[] = [
      {
        type: DOMUpdateType.REPLACE_NODE,
        node,
        newNode: start as any,
      },
    ];
    const template = document.createElement('template');
    let prevChildren: Node[] = [];
    for (;;) {
      template.innerHTML = html;
      const frag = template.content;
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
      html = (yield result)[0];
      result = [];
    }
  }
});
