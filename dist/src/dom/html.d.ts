import { DirectiveResult } from './directive';
export declare enum DirectiveType {
    TEXT = 0,
    ATTRIBUTE = 1,
    ATTRIBUTE_VALUE = 2
}
export interface DynamicData {
    directive?: DirectiveResult;
    staticValue?: any;
    marker?: string;
    type?: DirectiveType;
    attribute?: string;
    dx?: number;
    staticParts: TemplateStringsArray;
}
export declare const getTextMarker: (id: number) => string;
export declare const getAttributeMarker: (id: number) => string;
export interface HTMLResult {
    dynamicData: DynamicData[];
    staticParts: TemplateStringsArray;
    key?: string;
}
export declare type HTML = typeof html;
export declare function isDirective(thing: any): boolean;
export declare const html: (staticParts: TemplateStringsArray, ...dynamicParts: any[]) => HTMLResult;
