import { createDirective } from "../directive.js";
export const text = createDirective(function* (node, value) {
    for (;;) {
        node.textContent = value;
        value = (yield)[0];
    }
});
//# sourceMappingURL=text.js.map