import { createDirective, DOMUpdateType } from "../directive.js";
import { render } from "../render.js";
export const sub = createDirective(function* (node, cb) {
    if (node.nodeType === 3) {
        let span;
        for (;;) {
            cb = (yield new Promise(resolve => {
                const newSpan = document.createElement('span');
                render(newSpan, cb());
                resolve([
                    {
                        type: DOMUpdateType.REPLACE_NODE,
                        node: node.parentElement ? node : span,
                        newNode: newSpan,
                    },
                ]);
                span = newSpan;
            }))[0];
        }
    }
});
//# sourceMappingURL=sub copy.js.map