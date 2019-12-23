import { HTMLResult } from './html';
import { State } from './reactivity';
export interface ComponentDefinition {
    render: () => HTMLResult;
    watch?: State<{}>[];
}
export declare type Setup = () => ComponentDefinition;
export declare const component: (name: string, setup: Setup) => void;
