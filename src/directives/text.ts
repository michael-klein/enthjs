import { createDirective } from '../directive';
import { Schedule } from '../scheduler';

export const text = createDirective(
  (node: Text, schedule: Schedule, value: string) => {
    if (node instanceof Text) {
      schedule(() => {
        node.textContent = value;
      });
    }
  }
);
