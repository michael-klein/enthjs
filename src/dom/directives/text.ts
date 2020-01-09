import { createDirective, DOMUpdateType } from '../directive';
import { DirectiveType } from '../html';

export const text = createDirective(function*(node: Text, value: string) {
  if (this.type === DirectiveType.TEXT) {
    for (;;) {
      const result = yield [
        {
          node,
          value,
          type: DOMUpdateType.TEXT,
        },
      ];
      value = result[0];
    }
  }
});
