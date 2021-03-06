import { createDirective } from '../directive';

export const prop = createDirective(function*(
  node: Node,
  name: string,
  value: any
) {
  if (node instanceof HTMLElement) {
    node.removeAttribute(name);
    for (;;) {
      if (name.startsWith('.')) {
        name = name.replace('.', '');
      }
      (node as any)[name] = value;
      const newArgs = yield;
      name = newArgs[0];
      value = newArgs[1];
    }
  }
});
