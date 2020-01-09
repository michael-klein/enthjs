import { createDirective, DOMUpdate, DOMUpdateType } from '../directive';
import { DirectiveType } from '../html';

export const attr = createDirective(function*(
  node: Node,
  name: string,
  value: string
) {
  if (node instanceof HTMLElement && this.type === DirectiveType.ATTRIBUTE) {
    for (;;) {
      const result: DOMUpdate[] = [
        {
          type: DOMUpdateType.SET_ATTRIBUTE,
          node,
          value,
          name,
        },
      ];
      const newArgs = yield result;
      name = newArgs[0];
      value = newArgs[1];
    }
  }
});
