export declare type SideEffect = () => void;
export declare const sideEffect: (effect: () => void) => void;
export declare const runSideEffects: (element: HTMLElement) => Promise<void[]>;
