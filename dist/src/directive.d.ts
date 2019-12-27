export interface DOMUpdate {
    node: Node;
    newNode?: Node;
    type: DOMUpdateType;
    value?: string;
    name?: string;
}
export declare enum DOMUpdateType {
    TEXT = 0,
    REPLACE_NODE = 1,
    ADD_NODE = 2,
    INSERT_BEFORE = 3,
    REMOVE = 4,
    ADD_CLASS = 5,
    REMOVE_CLASS = 6
}
export declare type DirectiveGenerator<Args extends any[] = any[]> = Generator<DOMUpdate[] | Promise<DOMUpdate[]> | void, void, Args>;
export declare type DirectiveGeneratorFactory<N extends Node = Node, Args extends any[] = any[]> = (node: N, ...initialArgs: Args) => DirectiveGenerator<Args>;
export interface DirectiveResult<N extends Node = Node, Args extends any[] = any[]> {
    factory: DirectiveGeneratorFactory<N, Args>;
    args: Args;
    directive: Directive;
}
export declare type Directive<N extends Node = Node, Args extends any[] = any[]> = (...args: Args) => DirectiveResult<N, Args>;
export declare const IS_DIRECTIVE: unique symbol;
export declare function createDirective<Args extends any[], N extends Node = any, F extends DirectiveGeneratorFactory<N, Args> = DirectiveGeneratorFactory<N, Args>>(factory: F): F extends (node: N, ...initialArgs: infer A) => DirectiveGenerator<any> ? Directive<N, A> : never;