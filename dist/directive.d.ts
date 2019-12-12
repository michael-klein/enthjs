import { Schedule } from './scheduler';
export declare type Directive<N extends Node = Node, Args extends any[] = any[]> = (...args: Args) => (node: N) => void;
export declare type DirectiveHandler<N extends Node = any, Args extends any[] = any[]> = (node: N, schedule: Schedule, ...args: Args) => void | Node;
export declare function createDirective<Args extends any[] = any[], N extends Node = any, D extends DirectiveHandler<N, Args> = DirectiveHandler<N, Args>>(handler: D): D extends (node: N, schedule: Schedule, ...args: infer A) => void ? Directive<N, A> : never;
