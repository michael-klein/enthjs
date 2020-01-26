import { HTMLResult } from './html';
import { State } from '../reactivity/reactivity';
export declare type ComponentGenerator = Generator<() => HTMLResult>;
export declare type ComponentGeneratorFactory<StateType extends {}> = (state: State<StateType>) => ComponentGenerator;
export declare type ConnectedListener = () => void | (() => void);
declare const COMPONENT_CONTEXT: unique symbol;
interface SideEffect {
    cb: ConnectedListener;
    cleanUp?: () => void;
    deps: () => any[];
    prevDeps?: any[];
    canRun?: boolean;
}
interface ComponentContext {
    connectedListeners: ConnectedListener[];
    sideEffects: SideEffect[];
    host: HTMLElement;
}
export declare function getHost<E extends HTMLElement>(): E;
export declare function sideEffect(cb: ConnectedListener, deps?: () => any[]): void;
export declare function connected(cb: ConnectedListener): void;
declare global {
    interface Window {
        [COMPONENT_CONTEXT]: ComponentContext;
    }
}
export declare function component<StateValueType extends {} = {
    [key: string]: any;
}, StateType extends StateValueType & {
    attributes: {
        [key: string]: string;
    };
    properties: {
        [key: string]: any;
    };
} = StateValueType & {
    attributes: {
        [key: string]: string;
    };
    properties: {
        [key: string]: any;
    };
}, S extends State<StateType> = State<StateType>>(name: string, factory: ComponentGeneratorFactory<StateType>): void;
export {};
