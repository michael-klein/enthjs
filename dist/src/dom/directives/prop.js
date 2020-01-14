import { createDirective } from "../directive.js";
export const prop = createDirective(function* (node, name, value) {
    if (node instanceof HTMLElement) {
        for (;;) {
            node[name] = value;
            const newArgs = yield;
            name = newArgs[0];
            value = newArgs[1];
        }
    }
});
//# sourceMappingURL=prop.js.map