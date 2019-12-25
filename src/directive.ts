export interface DOMUpdate {
  node: Node;
  newNode?: Node;
  type: DOMUpdateType;
  value?: string;
}
export enum DOMUpdateType {
  TEXT,
  REPLACE_NODE,
  ADD_NODE,
  INSERT_BEFORE,
  REMOVE,
}

export type DirectiveGenerator<Args extends any[] = any[]> = Generator<
  DOMUpdate[] | Promise<DOMUpdate[]> | void,
  void,
  Args
>;

export type DirectiveGeneratorFactory<
  N extends Node = Node,
  Args extends any[] = any[]
> = (node: N, ...initialArgs: Args) => DirectiveGenerator<Args>;
export interface DirectiveResult<
  N extends Node = Node,
  Args extends any[] = any[]
> {
  factory: DirectiveGeneratorFactory<N, Args>;
  args: Args;
  directive: Directive;
}
export type Directive<N extends Node = Node, Args extends any[] = any[]> = (
  ...args: Args
) => DirectiveResult<N, Args>;
export const IS_DIRECTIVE = Symbol('directive');
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
        is: IS_DIRECTIVE,
        factory,
        args,
        directive,
      };
    } as any;
    return directive;
  })(factory);
}
