import { DirectiveType } from './html';

export interface DOMUpdate {
  node: Node;
  newNode?: Node;
  type: DOMUpdateType;
  value?: string;
  name?: string;
}
export enum DOMUpdateType {
  TEXT,
  REPLACE_NODE,
  ADD_NODE,
  INSERT_BEFORE,
  REMOVE,
  ADD_CLASS,
  REMOVE_CLASS,
  SET_ATTRIBUTE,
}

export type DirectiveGenerator<Args extends any[] = any[]> =
  | Generator<DOMUpdate[] | Promise<DOMUpdate[]> | void, void, Args>
  | AsyncGenerator<DOMUpdate[] | Promise<DOMUpdate[]> | void, void, Args>;
export interface DirectiveGeneratorFactoryThis {
  type: DirectiveType;
}
export type DirectiveGeneratorFactory<
  N extends Node = Node,
  Args extends any[] = any[]
> = (
  this: DirectiveGeneratorFactoryThis,
  node: N,
  ...initialArgs: Args
) => DirectiveGenerator<Args>;
export const IS_DIRECTIVE = Symbol.for('directive');
export interface DirectiveResult<
  N extends Node = Node,
  Args extends any[] = any[]
> {
  [IS_DIRECTIVE]: true;
  factory: DirectiveGeneratorFactory<N, Args>;
  args: Args;
  directive: Directive;
}
export type Directive<N extends Node = Node, Args extends any[] = any[]> = (
  ...args: Args
) => DirectiveResult<N, Args>;
export function createDirective<
  Args extends any[],
  N extends Node = any,
  F extends DirectiveGeneratorFactory<N, Args> = DirectiveGeneratorFactory<
    N,
    Args
  >
>(
  factory: F
): F extends (node: N, ...initialArgs: infer A) => DirectiveGenerator<any>
  ? Directive<N, A>
  : never {
  return ((factory: F) => {
    const directive = function(...args: Args) {
      return {
        [IS_DIRECTIVE]: true,
        factory,
        args,
        directive,
      };
    } as any;
    return directive;
  })(factory);
}
