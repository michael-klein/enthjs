export declare type CleanUp = () => void;
export declare type SideEffect = () => void | CleanUp;
export declare const sideEffect: (effect: () => void, dependencies?: () => any[]) => void;
export declare const runSideEffects: (element: HTMLElement) => Promise<void[]>;
