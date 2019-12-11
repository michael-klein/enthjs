import { HTMLResult } from './html';
export interface ComponentDefinition {
    render: () => HTMLResult;
}
export declare type Setup = () => ComponentDefinition;
export declare const component: (name: string, setup: Setup) => void;
