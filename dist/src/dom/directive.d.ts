import { DirectiveType } from './html';
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
    REMOVE_CLASS = 6,
    SET_ATTRIBUTE = 7
}
export declare type DirectiveGenerator<Args extends any[] = any[]> = Generator<DOMUpdate[] | Promise<DOMUpdate[]> | void, void, Args> | AsyncGenerator<DOMUpdate[] | Promise<DOMUpdate[]> | void, void, Args>;
export interface DirectiveGeneratorFactoryThis {
    type: DirectiveType;
}
export declare type DirectiveGeneratorFactory<N extends Node = Node, Args extends any[] = any[]> = (this: DirectiveGeneratorFactoryThis, node: N, ...initialArgs: Args) => DirectiveGenerator<Args>;
export declare const IS_DIRECTIVE: unique symbol;
export interface DirectiveResult<N extends Node = any, Args extends any[] = any> {
    [IS_DIRECTIVE]: true;
    factory: DirectiveGeneratorFactory<N, Args>;
    args: Args;
    directive: Directive;
}
export declare type Directive<N extends Node = Node, Args extends any[] = any[]> = (...args: Args) => DirectiveResult<N, Args>;
export declare function createDirective<Args extends any[], N extends Node = any, F extends DirectiveGeneratorFactory<N, Args> = DirectiveGeneratorFactory<N, Args>>(factory: F): F extends (node: N, ...initialArgs: infer A) => DirectiveGenerator<any> ? Directive<N, A> : never;
