import { createDirective, DOMUpdateType } from "../directive.js";
import { getAttributeMarker, isDirective } from "../html.js";
import { render } from "../render.js";
export function getKey(htmlResult, template) {
    let id = 0;
    for (const dynamicData of htmlResult.dynamicData) {
        if (isDirective(dynamicData)) {
            if (dynamicData.directive.directive === key) {
                const listNode = template.content.querySelector(`[${getAttributeMarker(id)}]`);
                if (listNode && !listNode.parentElement)
                    return dynamicData.directive.args[0];
            }
        }
        id++;
    }
    return htmlResult.staticParts.join();
}
export const list = createDirective(function* (node, htmlResults) {
    if (node.nodeType === 3) {
        const { template } = this;
        const root = document.createDocumentFragment();
        const start = document.createComment('');
        root.appendChild(start);
        const keyToFragmentsMap = new Map();
        let results = [
            {
                type: DOMUpdateType.REPLACE_NODE,
                node,
                newNode: root,
            },
        ];
        let oldKeyOrder = [];
        for (;;) {
            const keyOrder = htmlResults.map(result => {
                const key = getKey(result, template);
                if (!keyToFragmentsMap.has(key)) {
                    const frag = document.createDocumentFragment();
                    render(frag, result);
                    keyToFragmentsMap.set(key, [frag, ...Array.from(frag.childNodes)]);
                }
                else {
                    const frag = keyToFragmentsMap.get(key)[0];
                    render(frag, result);
                }
                return key;
            });
            if (oldKeyOrder.join('') !== keyOrder.join('')) {
                results = results.concat(keyOrder.flatMap(newKey => {
                    const oldIndex = oldKeyOrder.indexOf(newKey);
                    if (oldIndex > -1) {
                        oldKeyOrder.splice(oldIndex, 1);
                    }
                    const [, ...children] = keyToFragmentsMap.get(newKey);
                    return children.map(child => {
                        return {
                            type: DOMUpdateType.INSERT_BEFORE,
                            node: start,
                            newNode: child,
                        };
                    });
                }));
                results = results.concat(oldKeyOrder.flatMap(oldKey => {
                    const [, ...children] = keyToFragmentsMap.get(oldKey);
                    keyToFragmentsMap.delete(oldKey);
                    return children.map(child => {
                        return {
                            type: DOMUpdateType.REMOVE,
                            node: child,
                        };
                    });
                }));
            }
            oldKeyOrder = keyOrder;
            htmlResults = (yield results)[0];
            results = [];
        }
    }
});
export const key = createDirective(function* (_node, _keyName) { });
//# sourceMappingURL=list.js.map