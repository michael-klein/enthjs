import { DirectiveResult } from './directive';
export declare enum DirectiveType {
    TEXT = 0,
    ATTRIBUTE = 1,
    ATTRIBUTE_VALUE = 2
}
export interface DirectiveData {
    d: DirectiveResult;
    t?: DirectiveType;
    a?: string;
}
export declare const getTextMarker: (id: number) => string;
export declare const getAttributeMarker: (id: number) => string;
export interface HTMLResult {
    template: HTMLTemplateElement;
    directives: DirectiveData[];
}
export declare const html: (staticParts: TemplateStringsArray, ...dynamicParts: any[]) => HTMLResult;
