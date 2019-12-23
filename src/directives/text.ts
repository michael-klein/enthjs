import { createDirective, DOMUpdateType } from '../directive';

export const text = createDirective(function*(node: Text, value: string) {
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
});
