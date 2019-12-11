import { createDirective } from '../directive';
import { PriorityLevel, Schedule } from '../scheduler';

const valueMap: WeakMap<HTMLInputElement, string> = new WeakMap();
export const input = createDirective(
  (node: HTMLInputElement, schedule: Schedule, cb: (value: string) => void) => {
    if (node instanceof HTMLInputElement) {
      if (!valueMap.has(node)) {
        valueMap.set(node, node.value);
        node.addEventListener('input', e => {
          const value: string = (e.target as HTMLInputElement).value;
          if (value !== valueMap.get(node)) {
            schedule(() => cb(value), PriorityLevel.USER_BLOCKING);
            valueMap.set(node, value);
          }
        });
      }
    }
  }
);
