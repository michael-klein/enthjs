import { createDirective, DOMUpdateType } from "../directive.js";
import { render } from "../render.js";
export function getKey(htmlResult) {
    for (const dynamicData of htmlResult.dynamicData) {
        if (dynamicData.attribute === 'key') {
            dynamicData.directive = key(dynamicData.staticValue);
            delete dynamicData.staticValue;
        }
        if (dynamicData.directive) {
            if (dynamicData.directive.directive === key) {
                return dynamicData.directive.args[0];
            }
        }
    }
    return htmlResult.staticParts.join();
}
export const list = createDirective(function* (node, htmlResults) {
    if (node.nodeType === 3) {
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
                const key = getKey(result);
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
export const key = createDirective(function* (node, _keyName) {
    node.removeAttribute('key');
});
//# sourceMappingURL=list.js.map