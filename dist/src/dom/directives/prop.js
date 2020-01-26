import { createDirective } from "../directive.js";
export const prop = createDirective(function* (node, name, value) {
    if (node instanceof HTMLElement) {
        node.removeAttribute(name);
        for (;;) {
            if (name.startsWith('.')) {
                name = name.replace('.', '');
            }
            node[name] = value;
            const newArgs = yield;
            name = newArgs[0];
            value = newArgs[1];
        }
    }
});
//# sourceMappingURL=prop.js.map