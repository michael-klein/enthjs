import { defineFallback } from "./render.js";
import { DirectiveType, IS_HTML_RESULT } from "./html.js";
import { attr } from "./directives/attr.js";
import { text } from "./directives/text.js";
import { sub } from "./directives/sub.js";
import { on } from "./directives/on.js";
import { prop } from "./directives/prop.js";
import { list, key } from "./directives/list.js";
export function applyDefaultFallback() {
    defineFallback(data => {
        if (data.type === DirectiveType.TEXT) {
            if (typeof data.staticValue === 'string' ||
                typeof data.staticValue === 'number') {
                data.directive = text(data.staticValue + '');
            }
            else if (data.staticValue instanceof Array &&
                data.staticValue.findIndex(item => !(typeof item === 'object' && item[IS_HTML_RESULT])) === -1) {
                data.directive = list(data.staticValue);
            }
        }
        if (data.type === DirectiveType.ATTRIBUTE_VALUE) {
            if (data.attribute.startsWith('on')) {
                data.directive = on(data.attribute, data.staticValue);
            }
            else if (data.attribute.startsWith('.')) {
                data.directive = prop(data.attribute, data.staticValue);
            }
            else if (data.attribute === 'key') {
                data.directive = key(data.staticValue);
            }
            else {
                data.directive = attr(data.attribute, data.staticValue + '');
            }
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