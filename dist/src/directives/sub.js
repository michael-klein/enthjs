import { createDirective, DOMUpdateType } from "../directive.js";
import { render } from "../render.js";
export const sub = createDirective(function* (node, htmlResult) {
    if (node.nodeType === 3) {
        const start = document.createComment('');
        let result = [
            {
                type: DOMUpdateType.REPLACE_NODE,
                node,
                newNode: start,
            },
        ];
        let prevTemplate;
        let prevFrag;
        let prevChildren = [];
        for (;;) {
            if (prevTemplate === htmlResult.template) {
                render(prevFrag, htmlResult);
            }
            else {
                const frag = document.createDocumentFragment();
                render(frag, htmlResult);
                prevChildren.forEach(child => {
                    result.push({
                        type: DOMUpdateType.REMOVE,
                        node: child,
                    });
                });
                prevChildren = [];
                frag.childNodes.forEach(child => {
                    prevChildren.push(child);
                    result.push({
                        type: DOMUpdateType.INSERT_BEFORE,
                        node: start,
                        newNode: child,
                    });
                });
                prevTemplate = htmlResult.template;
                prevFrag = frag;
            }
            htmlResult = (yield result)[0];
            result = [];
        }
    }
});
//# sourceMappingURL=sub.js.map