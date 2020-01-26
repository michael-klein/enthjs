import { createDirective, DOMUpdateType } from "../directive.js";
import { DirectiveType } from "../html.js";
export const attr = createDirective(function* (node, name, value) {
    if (node instanceof HTMLElement &&
        (this.type === DirectiveType.ATTRIBUTE ||
            this.type === DirectiveType.ATTRIBUTE_VALUE)) {
        for (;;) {
            const result = [
                {
                    type: DOMUpdateType.SET_ATTRIBUTE,
                    node,
                    value,
                    name,
                },
            ];
            const newArgs = yield result;
            name = newArgs[0];
            value = newArgs[1];
        }
    }
});
//# sourceMappingURL=attr.js.map