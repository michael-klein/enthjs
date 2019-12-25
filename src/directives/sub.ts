import { createDirective, DOMUpdateType } from '../directive';
import { HTMLResult } from '../html';
import { render } from '../render';

export const sub = createDirective(function*(
  node: Text,
  htmlResult: HTMLResult
) {
  if (node.nodeType === 3) {
    let span: HTMLSpanElement;
    for (;;) {
      const newSpan = document.createElement('span');
      render(newSpan as HTMLElement, htmlResult);
      const result = [
        {
          type: DOMUpdateType.REPLACE_NODE,
          node: node.parentElement ? node : span,
          newNode: newSpan,
        },
      ];
      span = newSpan;
      htmlResult = (yield result)[0];
    }
  }
});
