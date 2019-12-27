import { createDirective, DOMUpdate, DOMUpdateType } from '../directive';

export const clss = createDirective(function*(node: Node, classes: string) {
  if (node instanceof HTMLElement) {
    let oldClasses: string[] = [];
    for (;;) {
      const result: DOMUpdate[] = [];
      oldClasses.forEach(oldCls =>
        result.push({
          type: DOMUpdateType.REMOVE_CLASS,
          node,
          value: oldCls,
        })
      );
      oldClasses = classes.trim().split(' ');
      oldClasses.forEach(cls =>
        result.push({
          type: DOMUpdateType.ADD_CLASS,
          node,
          value: cls,
        })
      );
      classes = (yield result)[0];
    }
  }
});
