import { createDirective } from '../directive';
import { PriorityLevel, schedule } from '../../scheduler/scheduler';

export const input = createDirective(function*(
  node: HTMLElement,
  cb: (value: string) => void
) {
  const cbRef = {
    cb,
  };
  node.addEventListener('input', e => {
    const value: string = (e.target as HTMLInputElement).value;
    schedule(() => cbRef.cb(value), PriorityLevel.NORMAL);
  });
  for (;;) {
    cbRef.cb = (yield)[0];
  }
});
