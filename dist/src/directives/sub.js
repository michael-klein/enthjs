import { createDirective } from "../directive.js";
import { PriorityLevel, schedule } from "../scheduler.js";
import { clear, render } from "../render.js";
export const sub = createDirective(function* (node, cb) {
    let span;
    if (node.nodeType === 3) {
        span = document.createElement('span');
        node.parentElement.insertBefore(span, node);
        node.parentElement.removeChild(node);
        for (;;) {
            schedule(() => {
                clear(span);
                render(span, cb());
            }, PriorityLevel.USER_BLOCKING);
            cb = (yield)[0];
        }
    }
});
//# sourceMappingURL=sub.js.map