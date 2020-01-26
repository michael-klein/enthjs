import { DirectiveResult } from './directive';
export declare enum DirectiveType {
    TEXT = "TEXT",
    ATTRIBUTE = "ATTRIBUTE",
    ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE"
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
export declare const IS_HTML_RESULT: unique symbol;
export interface HTMLResult {
    dynamicData: DynamicData[];
    staticParts: TemplateStringsArray;
    key?: string;
    [IS_HTML_RESULT]: true;
    template?: HTMLTemplateElement;
}
export declare type HTML = typeof html;
export declare function isDirective(thing: any): boolean;
export declare const html: (staticParts: TemplateStringsArray, ...dynamicParts: any[]) => HTMLResult;
