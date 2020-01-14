import { createDirective } from "../directive.js";
import { PriorityLevel, schedule } from "../scheduler.js";
export const input = createDirective(function* (node, cb) {
    const cbRef = {
        cb,
    };
    node.addEventListener('input', e => {
        const value = e.target.value;
        schedule(() => cbRef.cb(value), PriorityLevel.NORMAL);
    });
    for (;;) {
        cbRef.cb = (yield)[0];
    }
});
//# sourceMappingURL=input.js.map