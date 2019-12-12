import { schedule, Schedule } from './scheduler';

export type Directive<N extends Node = Node, Args extends any[] = any[]> = (
  ...args: Args
) => (node: N) => void;
export type DirectiveHandler<
  N extends Node = any,
  Args extends any[] = any[]
> = (node: N, schedule: Schedule, ...args: Args) => void | Node;
export function createDirective<
  Args extends any[] = any[],
  N extends Node = any,
  D extends DirectiveHandler<N, Args> = DirectiveHandler<N, Args>
>(
  handler: D
): D extends (node: N, schedule: Schedule, ...args: infer A) => void
  ? Directive<N, A>
  : never {
  return ((...args: Args) => {
    return (node: N) => {
      return handler(node, schedule, ...args);
    };
  }) as D extends (node: N, schedule: Schedule, ...args: infer A) => void
    ? Directive<N, A>
    : never;
}
