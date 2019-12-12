import { createDirective } from '../directive';
import { Schedule, PriorityLevel } from '../scheduler';
import { onHandler } from './on';

export const input = createDirective(
  (node: HTMLInputElement, schedule: Schedule, cb: (value: string) => void) =>
    onHandler(node, schedule, 'input', e => {
      const value: string = (e.target as HTMLInputElement).value;
      schedule(() => cb(value), PriorityLevel.USER_BLOCKING);
    })
);
