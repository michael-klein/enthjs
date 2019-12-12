import {
  HTMLResult,
  DirectiveType,
  getTextMarker,
  getAttributeMarker,
} from './html';

const renderedNodesMap: WeakMap<HTMLElement, Node[]> = new WeakMap();
export const clear = (container: HTMLElement) => {
  if (renderedNodesMap.has(container)) {
    renderedNodesMap
      .get(container)
      .forEach(node => container.removeChild(node));
    renderedNodesMap.delete(container);
  }
};
export const render = (
  container: HTMLElement,
  htmlResult: HTMLResult
): void => {
  let fragment: DocumentFragment;
  if (!renderedNodesMap.has(container)) {
    fragment = htmlResult.template.content.cloneNode(true) as DocumentFragment;
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
    renderedNodesMap.set(container, Array.from(fragment.childNodes));
  }
  htmlResult.directives.forEach(directiveData => {
    const node = directiveData.d(directiveData.n);
    if (node) {
      directiveData.n = node;
    }
  });
  if (fragment) {
    container.appendChild(fragment);
  }
};
