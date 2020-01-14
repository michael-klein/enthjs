import { defineFallback } from "./render.js";
import { DirectiveType } from "./html.js";
import { attr } from "./directives/attr.js";
import { text } from "./directives/text.js";
import { sub } from "./directives/sub.js";
export function applyDefaultFallback() {
    defineFallback(data => {
        if (data.type === DirectiveType.TEXT &&
            (typeof data.staticValue === 'string' ||
                typeof data.staticValue === 'number')) {
            data.directive = text(data.staticValue + '');
        }
        if (data.type === DirectiveType.ATTRIBUTE_VALUE &&
            (typeof data.staticValue === 'string' ||
                typeof data.staticValue === 'number')) {
            data.directive = attr(data.attribute, data.staticValue + '');
        }
        if (data.type === DirectiveType.TEXT &&
            typeof data.staticValue === 'object' &&
            data.staticValue.dynamicData) {
            data.directive = sub(data.staticValue);
        }
        return data;
    });
}
//# sourceMappingURL=default_fallback.js.map