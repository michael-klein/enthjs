import {
  HTMLResult,
  DirectiveType,
  getTextMarker,
  getAttributeMarker,
} from './html';

const childNodesMap: WeakMap<HTMLElement, NodeList> = new WeakMap();
export const render = (
  container: HTMLElement,
  htmlResult: HTMLResult
): void => {
  if (!childNodesMap.has(container)) {
    const fragment: DocumentFragment = htmlResult.template.content.cloneNode(
      true
    ) as DocumentFragment;
    htmlResult.directives.forEach((directiveData, id) => {
      switch (directiveData.t) {
        case DirectiveType.TEXT:
          const placeholder = fragment.querySelector(getTextMarker(id));
          const textNode = placeholder.firstChild;
          directiveData.n = textNode;
          placeholder.parentElement.replaceChild(textNode, placeholder);
          break;
        case DirectiveType.ATTRIBUTE:
        case DirectiveType.ATTRIBUTE_VALUE:
          const marker = getAttributeMarker(id);
          const node = fragment.querySelector(`[${marker}]`);
          node.removeAttribute(marker);
          directiveData.n = node;
      }
    });
    childNodesMap.set(container, fragment.childNodes);
    container.appendChild(fragment);
  }
  htmlResult.directives.forEach(directiveData => {
    directiveData.d(directiveData.n);
  });
};
