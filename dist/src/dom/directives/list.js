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
            const inserts = [];
            const removals = [...oldKeyOrder];
            const moves = [];
            const keyOrder = htmlResults.map(result => {
                const key = getKey(result);
                if (!keyToFragmentsMap.has(key)) {
                    const frag = document.createDocumentFragment();
                    render(frag, result);
                    if (frag.childNodes.length > 1) {
                        throw 'List items should only render a single node!';
                    }
                    keyToFragmentsMap.set(key, [frag, frag.childNodes[0]]);
                }
                else {
                    const frag = keyToFragmentsMap.get(key)[0];
                    render(frag, result);
                }
                if (!oldKeyOrder.includes(key)) {
                    inserts.push(key);
                }
                else {
                    moves.push(key);
                    removals.splice(removals.indexOf(key), 1);
                }
                return key;
            });
            for (const key of inserts) {
                let after = null;
                for (let i = keyOrder.indexOf(key) + 1; i < keyOrder.length; i++) {
                    after = oldKeyOrder[oldKeyOrder.indexOf(keyOrder[i])];
                    if (after) {
                        break;
                    }
                }
                if (after) {
                    results.push({
                        type: DOMUpdateType.INSERT_BEFORE,
                        node: keyToFragmentsMap.get(after)[1],
                        newNode: keyToFragmentsMap.get(key)[1],
                    });
                    oldKeyOrder.splice(oldKeyOrder.indexOf(after), 0, key);
                }
                else {
                    results.push({
                        type: DOMUpdateType.INSERT_BEFORE,
                        node: start,
                        newNode: keyToFragmentsMap.get(key)[1],
                    });
                    oldKeyOrder.push(key);
                }
            }
            for (const key of removals) {
                const node = keyToFragmentsMap.get(key)[1];
                results.push({
                    type: DOMUpdateType.REMOVE,
                    node,
                });
                oldKeyOrder.splice(oldKeyOrder.indexOf(key), 1);
            }
            for (const key of moves) {
                const newKeyIndex = keyOrder.indexOf(key);
                const oldKeyIndex = oldKeyOrder.indexOf(key);
                const node = keyToFragmentsMap.get(key)[1];
                if (newKeyIndex !== oldKeyIndex) {
                    if (newKeyIndex < keyOrder.length - 1) {
                        results.push({
                            type: DOMUpdateType.INSERT_BEFORE,
                            node: keyToFragmentsMap.get(keyOrder[newKeyIndex + 1])[1],
                            newNode: node,
                        });
                        oldKeyOrder.splice(oldKeyIndex, 1);
                        oldKeyOrder.splice(oldKeyOrder.indexOf(keyOrder[newKeyIndex + 1]), 0, key);
                    }
                    else {
                        results.push({
                            type: DOMUpdateType.INSERT_BEFORE,
                            node: start,
                            newNode: node,
                        });
                        oldKeyOrder.splice(oldKeyIndex, 1);
                        oldKeyOrder.push(key);
                    }
                }
            }
            htmlResults = (yield results)[0];
            results = [];
        }
    }
});
export const key = createDirective(function* (node, _keyName) {
    node.removeAttribute('key');
});
//# sourceMappingURL=list.js.map