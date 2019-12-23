import { createDirective, DOMUpdateType } from "../directive.js";
export const text = createDirective(function* (node, value) {
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
});
//# sourceMappingURL=text.js.map