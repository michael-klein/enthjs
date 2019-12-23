import { createDirective, DOMUpdateType } from '../directive';
import { HTMLResult } from '../html';
import { render } from '../render';

export const sub = createDirective(function*(node: Text, cb: () => HTMLResult) {
  if (node.nodeType === 3) {
    let span: HTMLSpanElement;
    for (;;) {
      cb = (yield new Promise(resolve => {
        const newSpan = document.createElement('span');
        render(newSpan as HTMLElement, cb());
        resolve([
          {
            type: DOMUpdateType.REPLACE_NODE,
            node: node.parentElement ? node : span,
            newNode: newSpan,
          },
        ]);
        span = newSpan;
      }))[0];
    }
  }
});
