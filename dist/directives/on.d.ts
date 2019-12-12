import { PriorityLevel } from '../scheduler';
export declare const onHandler: (node: HTMLInputElement, schedule: (cb: () => void, priority?: PriorityLevel) => Promise<void>, name: string, cb: <E extends Event>(e: E) => void) => void;
export declare const on: import("../directive").Directive<any, [string, <E extends Event>(e: E) => void]>;
