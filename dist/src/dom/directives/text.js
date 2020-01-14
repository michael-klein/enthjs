import { createDirective, DOMUpdateType } from "../directive.js";
import { DirectiveType } from "../html.js";
export const text = createDirective(function* (node, value) {
    if (this.type === DirectiveType.TEXT) {
        for (;;) {
            const result = yield [
                {
                    node,
                    value,
                    type: DOMUpdateType.TEXT,
                },
            ];
            value = result[0];
        }
    }
});
//# sourceMappingURL=text.js.map