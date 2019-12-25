import { createDirective, DOMUpdateType } from "../directive.js";
import { render } from "../render.js";
export const sub = createDirective(function* (node, htmlResult) {
    if (node.nodeType === 3) {
        let span;
        for (;;) {
            const newSpan = document.createElement('span');
            render(newSpan, htmlResult);
            const result = [
                {
                    type: DOMUpdateType.REPLACE_NODE,
                    node: node.parentElement ? node : span,
                    newNode: newSpan,
                },
            ];
            span = newSpan;
            htmlResult = (yield result)[0];
        }
    }
});
//# sourceMappingURL=sub.js.map