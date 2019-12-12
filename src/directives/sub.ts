import { createDirective } from '../directive';
import { Schedule, PriorityLevel } from '../scheduler';
import { HTMLResult } from '../html';
import { clear, render } from '../render';

export const sub = createDirective(
  (node: Node, schedule: Schedule, cb: () => HTMLResult) => {
    if (node.nodeType === 3) {
      const span = document.createElement('span');
      node.parentElement.insertBefore(span, node);
      node.parentElement.removeChild(node);
      node = span;
    }
    schedule(() => {
      clear(node as HTMLElement);
      render(node as HTMLElement, cb());
    }, PriorityLevel.USER_BLOCKING);
    return node;
  }
);
