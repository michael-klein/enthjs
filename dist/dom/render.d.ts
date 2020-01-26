import { HTMLResult, DirectiveType, DynamicData } from './html';
export declare const clear: (container: HTMLElement) => void;
export declare type Fallback = (data: DynamicData) => DynamicData;
export declare function defineFallback(fallback: Fallback): void;
export declare type DirectiveFallback = (data: DynamicData) => DynamicData;
export interface DirectiveFallbacks {
    [DirectiveType.ATTRIBUTE]: DirectiveFallback;
}
export declare const render: (container: Node, htmlResult: HTMLResult) => Promise<void>;
