export declare enum DirectiveType {
    TEXT = 0,
    ATTRIBUTE = 1,
    ATTRIBUTE_VALUE = 2
}
export interface DirectiveData {
    d: Function;
    t?: DirectiveType;
    a?: string;
    n?: Node;
}
export declare const getTextMarker: (id: number) => string;
export declare const getAttributeMarker: (id: number) => string;
export interface HTMLResult {
    template: HTMLTemplateElement;
    directives: DirectiveData[];
}
export declare const html: (staticParts: TemplateStringsArray, ...dynamicParts: any[]) => HTMLResult;
