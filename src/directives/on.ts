import { createDirective } from '../directive';
import { PriorityLevel, schedule } from '../scheduler';

export const on = createDirective(function*(
  node: HTMLElement,
  name: string,
  cb: <E extends Event>(e: E) => void
) {
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
