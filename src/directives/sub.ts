import { createDirective } from '../directive';
import { PriorityLevel, schedule } from '../scheduler';
import { HTMLResult } from '../html';
import { clear, render } from '../render';

export const sub = createDirective(function*(node: Text, cb: () => HTMLResult) {
  let span: HTMLSpanElement;
  if (node.nodeType === 3) {
    span = document.createElement('span');
    node.parentElement.insertBefore(span, node);
    node.parentElement.removeChild(node);
    for (;;) {
      schedule(() => {
        clear(span as HTMLElement);
        render(span as HTMLElement, cb());
      }, PriorityLevel.USER_BLOCKING);
      cb = (yield)[0];
    }
  }
});
