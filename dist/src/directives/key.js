import { createDirective } from "../directive.js";
export const key = createDirective(function* (node, key) {
    for (;;) {
        node.setAttribute('data-key', key);
        key = (yield)[0];
    }
});
//# sourceMappingURL=key.js.map