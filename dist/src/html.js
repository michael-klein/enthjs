import { IS_DIRECTIVE } from "./directive.js";
import { sub } from "./directives/sub.js";
const isLetter = (c) => {
    return c.toLowerCase() != c.toUpperCase();
};
export var DirectiveType;
(function (DirectiveType) {
    DirectiveType[DirectiveType["TEXT"] = 0] = "TEXT";
    DirectiveType[DirectiveType["ATTRIBUTE"] = 1] = "ATTRIBUTE";
    DirectiveType[DirectiveType["ATTRIBUTE_VALUE"] = 2] = "ATTRIBUTE_VALUE";
})(DirectiveType || (DirectiveType = {}));
const insertAttributeMarker = (marker, si, appendedStatic) => {
    while (si++) {
        const char = appendedStatic.charAt(si);
        if (!char) {
            break;
        }
        if (char === ' ') {
            return (appendedStatic.slice(0, si) + ' ' + marker + appendedStatic.slice(si));
        }
    }
    return appendedStatic;
};
export const getTextMarker = (id) => {
    return `tm-${id}`;
};
export const getAttributeMarker = (id) => {
    return `data-am-${id}`;
};
function isDirective(thing) {
    return thing.is && thing.is === IS_DIRECTIVE;
}
function isHTMLResult(thing) {
    return thing.template && thing.directives;
}
let resultCache = new WeakMap();
export const html = (staticParts, ...dynamicParts) => {
    let result = resultCache.get(staticParts);
    if (!result) {
        let appendedStatic = '';
        const directives = [];
        for (let i = 0; i < dynamicParts.length; i++) {
            let dynamicPart = dynamicParts[i];
            const staticPart = staticParts[i];
            appendedStatic += staticPart;
            if (!isDirective(dynamicPart)) {
                if (isHTMLResult(dynamicPart)) {
                    const htmlResult = dynamicPart;
                    dynamicPart = sub(() => htmlResult);
                }
                else {
                    appendedStatic += dynamicPart;
                    continue;
                }
            }
            let id = directives.push({
                d: dynamicPart,
            }) - 1;
            let si = appendedStatic.length + 1;
            let attributeValueMode = false;
            let attributeMode = false;
            let attributeNameFound = false;
            let attributeName = '';
            while (si--) {
                const char = appendedStatic.charAt(si);
                const nextChar = appendedStatic.charAt(si - 1);
                const nextNextChar = appendedStatic.charAt(si - 2);
                if (char === '>' || si === 0) {
                    let marker = getTextMarker(id);
                    appendedStatic += `<${marker}>&zwnj;</${marker}>`;
                    directives[id].t = DirectiveType.TEXT;
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
                    appendedStatic = insertAttributeMarker(getAttributeMarker(id), si, appendedStatic);
                    directives[id].t = DirectiveType.ATTRIBUTE_VALUE;
                    directives[id].a = attributeName;
                    if (appendedStatic[appendedStatic.length - 1] === ' ') {
                        appendedStatic = appendedStatic.slice(0, appendedStatic.length - 1);
                    }
                    break;
                }
                if (char === '<' && !attributeValueMode) {
                    appendedStatic = insertAttributeMarker(getAttributeMarker(id), si, appendedStatic);
                    directives[id].t = DirectiveType.ATTRIBUTE;
                    break;
                }
            }
        }
        appendedStatic += staticParts[staticParts.length - 1];
        const template = document.createElement('template');
        template.innerHTML = appendedStatic;
        result = {
            template,
            directives,
        };
    }
    else {
        let directiveIndex = 0;
        dynamicParts.forEach((value) => {
            if (isDirective(value) || isHTMLResult(value)) {
                if (isHTMLResult(value)) {
                    result.directives[directiveIndex].d = {
                        args: [() => value],
                        factory: undefined,
                    };
                }
                else {
                    result.directives[directiveIndex].d = value;
                }
                directiveIndex++;
            }
        });
    }
    resultCache.set(staticParts, result);
    return result;
};
//# sourceMappingURL=html.js.map