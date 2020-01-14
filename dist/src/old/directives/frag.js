import { createDirective, DOMUpdateType } from "../directive.js";
export const frag = createDirective(function* (node, html) {
    if (node.nodeType === 3) {
        const start = document.createComment('');
        let result = [
            {
                type: DOMUpdateType.REPLACE_NODE,
                node,
                newNode: start,
            },
        ];
        const template = document.createElement('template');
        let prevChildren = [];
        for (;;) {
            template.innerHTML = html;
            const frag = template.content;
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
            html = (yield result)[0];
            result = [];
        }
    }
});
//# sourceMappingURL=frag.js.map