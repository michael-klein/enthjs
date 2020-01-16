import { IS_DIRECTIVE } from "./directive.js";
const isLetter = (c) => {
    return c.toLowerCase() != c.toUpperCase();
};
export var DirectiveType;
(function (DirectiveType) {
    DirectiveType[DirectiveType["TEXT"] = 0] = "TEXT";
    DirectiveType[DirectiveType["ATTRIBUTE"] = 1] = "ATTRIBUTE";
    DirectiveType[DirectiveType["ATTRIBUTE_VALUE"] = 2] = "ATTRIBUTE_VALUE";
})(DirectiveType || (DirectiveType = {}));
export const getTextMarker = (id) => {
    return `tm-${id}`;
};
export const getAttributeMarker = (id) => {
    return `data-am-${id}`;
};
export const IS_HTML_RESULT = Symbol.for('html_result');
export function isDirective(thing) {
    return typeof thing === 'object' && thing[IS_DIRECTIVE];
}
let resultCache = new WeakMap();
export const html = (staticParts, ...dynamicParts) => {
    let result = resultCache.get(staticParts);
    if (!result) {
        let appendedStatic = '';
        const dynamicData = [];
        for (let i = 0; i < dynamicParts.length; i++) {
            const dynamicPart = dynamicParts[i];
            const staticPart = staticParts[i];
            appendedStatic += staticPart;
            let dx = 0;
            let id = dynamicData.push({ staticParts }) - 1;
            const currentDynamicData = dynamicData[id];
            if (isDirective(dynamicPart)) {
                currentDynamicData.directive = dynamicPart;
            }
            else {
                currentDynamicData.staticValue = dynamicPart;
            }
            let si = appendedStatic.length + 1;
            let attributeValueMode = false;
            let attributeMode = false;
            let attributeNameFound = false;
            let attributeName = '';
            while (si--) {
                dx++;
                const char = appendedStatic.charAt(si);
                const nextChar = appendedStatic.charAt(si - 1);
                const nextNextChar = appendedStatic.charAt(si - 2);
                if (char === '>' || si === 0) {
                    let marker = getTextMarker(id);
                    currentDynamicData.marker = `<${marker}>&zwnj;</${marker}>`;
                    currentDynamicData.type = DirectiveType.TEXT;
                    break;
                }
                if (char === '"' &&
                    nextChar === '=' &&
                    isLetter(nextNextChar) &&
                    !attributeMode) {
                    attributeValueMode = true;
                    continue;
                }
                if (char === '"' && nextNextChar !== '=' && !attributeValueMode) {
                    attributeValueMode = false;
                    attributeMode = true;
                    continue;
                }
                if (attributeValueMode &&
                    char !== '"' &&
                    char !== '=' &&
                    !attributeNameFound) {
                    if (char !== ' ') {
                        attributeName = char + attributeName;
                    }
                    else {
                        attributeNameFound = true;
                    }
                }
                if (char === '<' && attributeValueMode) {
                    currentDynamicData.marker = getAttributeMarker(id);
                    currentDynamicData.type = DirectiveType.ATTRIBUTE_VALUE;
                    currentDynamicData.attribute = attributeName;
                    break;
                }
                if (char === '<' && !attributeValueMode) {
                    currentDynamicData.marker = getAttributeMarker(id);
                    currentDynamicData.type = DirectiveType.ATTRIBUTE;
                    break;
                }
            }
            currentDynamicData.dx = dx;
        }
        appendedStatic += staticParts[staticParts.length - 1];
        result = {
            dynamicData,
            staticParts,
            [IS_HTML_RESULT]: true,
        };
        resultCache.set(staticParts, result);
    }
    else {
        result = {
            ...result,
            dynamicData: result.dynamicData.map((data, id) => {
                if (!isDirective(dynamicParts[id])) {
                    return {
                        ...data,
                        directive: undefined,
                        staticValue: dynamicParts[id],
                    };
                }
                else {
                    return {
                        ...data,
                        staticValue: undefined,
                        directive: dynamicParts[id],
                    };
                }
            }),
        };
    }
    return result;
};
//# sourceMappingURL=html.js.map