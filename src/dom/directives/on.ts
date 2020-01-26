import { createDirective } from '../directive';
import { schedule, PriorityLevel } from '../../scheduler/scheduler';

export const on = createDirective(function*(
  node: HTMLElement,
  name: string,
  cb: <E extends Event>(e: E) => void
) {
  node.removeAttribute(name);
  if (name.startsWith('on')) {
    name = name.replace('on', '');
  }
  const cbRef = {
    cb,
  };
  node.addEventListener(name, e => {
    schedule(() => cbRef.cb(e), PriorityLevel.IMMEDIATE);
  });
  for (;;) {
    cbRef.cb = (yield)[1];
  }
});
