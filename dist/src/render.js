import { DirectiveType, getTextMarker, getAttributeMarker, } from "./html.js";
const renderedNodesMap = new WeakMap();
export const clear = (container) => {
    if (renderedNodesMap.has(container)) {
        renderedNodesMap
            .get(container)
            .forEach(node => container.removeChild(node));
        renderedNodesMap.delete(container);
    }
};
const generatorMap = new WeakMap();
export const render = (container, htmlResult) => {
    let fragment;
    if (!renderedNodesMap.has(container)) {
        const generators = [];
        generatorMap.set(container, generators);
        fragment = htmlResult.template.content.cloneNode(true);
        htmlResult.directives.forEach((directiveData, id) => {
            switch (directiveData.t) {
                case DirectiveType.TEXT:
                    const placeholder = fragment.querySelector(getTextMarker(id));
                    const textNode = placeholder.firstChild;
                    generators[id] = directiveData.d.factory(textNode, ...directiveData.d.args);
                    placeholder.parentElement.replaceChild(textNode, placeholder);
                    break;
                case DirectiveType.ATTRIBUTE:
                case DirectiveType.ATTRIBUTE_VALUE:
                    const marker = getAttributeMarker(id);
                    const node = fragment.querySelector(`[${marker}]`);
                    generators[id] = directiveData.d.factory(node, ...directiveData.d.args);
                    node.removeAttribute(marker);
            }
        });
        renderedNodesMap.set(container, Array.from(fragment.childNodes));
    }
    const generators = generatorMap.get(container);
    htmlResult.directives.forEach((directiveData, id) => {
        generators[id].next(directiveData.d.args);
    });
    if (fragment) {
        container.appendChild(fragment);
    }
};
//# sourceMappingURL=render.js.map