import { createDirective, DOMUpdateType } from "../directive.js";
import { DirectiveType } from "../html.js";
import { render } from "../render.js";
export const sub = createDirective(async function* (node, htmlResult) {
    if (this.type === DirectiveType.TEXT) {
        const start = document.createComment('');
        let result = [
            {
                type: DOMUpdateType.REPLACE_NODE,
                node,
                newNode: start,
            },
        ];
        let prevParts;
        let prevFrag;
        let prevChildren = [];
        for (;;) {
            if (prevParts === htmlResult.staticParts) {
                await render(prevFrag, htmlResult);
            }
            else {
                const frag = document.createDocumentFragment();
                await render(frag, htmlResult);
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
                prevParts = htmlResult.staticParts;
                prevFrag = frag;
            }
            htmlResult = (yield result)[0];
            result = [];
        }
    }
});
//# sourceMappingURL=sub.js.map