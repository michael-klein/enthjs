import { createDirective } from '../directive';
import { PriorityLevel, Schedule } from '../scheduler';

const handlerMap: WeakMap<HTMLInputElement, string[]> = new WeakMap();
export const onHandler = (
  node: HTMLInputElement,
  schedule: Schedule,
  name: string,
  cb: <E extends Event>(e: E) => void
) => {
  if (!handlerMap.has(node) && !(handlerMap.get(node) || []).includes(name)) {
    handlerMap.set(
      node,
      [].concat(name, handlerMap.get(node)).filter(n => n)
    );
    node.addEventListener(name, e => {
      schedule(() => cb(e), PriorityLevel.IMMEDIATE);
    });
  }
};
export const on = createDirective(onHandler);
