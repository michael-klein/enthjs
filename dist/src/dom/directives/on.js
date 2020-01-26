import { createDirective } from "../directive.js";
import { schedule, PriorityLevel } from "../../scheduler/scheduler.js";
export const on = createDirective(function* (node, name, cb) {
    node.removeAttribute(name);
    if (name.startsWith('on')) {
        name = name.replace('on', '');
    }
    const cbRef = {
        cb,
    };
    node.addEventListener(name, e => {
        schedule(() => cbRef.cb(e), PriorityLevel.IMMEDIATE);
    });
    for (;;) {
        cbRef.cb = (yield)[1];
    }
});
//# sourceMappingURL=on.js.map