import { createDirective } from '../directive';

export const text = createDirective(function*(node: Text, value: string) {
  for (;;) {
    node.textContent = value;
    value = (yield)[0];
  }
});
