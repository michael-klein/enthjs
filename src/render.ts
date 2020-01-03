import {
  HTMLResult,
  DirectiveType,
  getTextMarker,
  getAttributeMarker,
} from './html';
import { DirectiveGenerator, DOMUpdate, DOMUpdateType } from './directive';
import { schedule, PriorityLevel } from './scheduler';

const renderedNodesMap: WeakMap<HTMLElement, Node[]> = new WeakMap();
export const clear = (container: HTMLElement) => {
  if (renderedNodesMap.has(container)) {
    renderedNodesMap
      .get(container)
      .forEach(node => container.removeChild(node));
    renderedNodesMap.delete(container);
  }
};
const generatorMap: WeakMap<HTMLElement, DirectiveGenerator[]> = new WeakMap();
export const render = (
  container: HTMLElement,
  htmlResult: HTMLResult
): void => {
  let fragment: DocumentFragment;
  let init = false;
  if (!renderedNodesMap.has(container)) {
    init = true;
    const generators: DirectiveGenerator[] = [];
    generatorMap.set(container, generators);
    fragment = htmlResult.template.content.cloneNode(true) as DocumentFragment;
    htmlResult.directives.forEach((directiveData, id) => {
      switch (directiveData.t) {
        case DirectiveType.TEXT:
          const placeholder = fragment.querySelector(getTextMarker(id));
          const textNode = placeholder.firstChild;
          generators[id] = directiveData.d.factory(
            textNode,
            ...directiveData.d.args
          );
          placeholder.parentNode.replaceChild(textNode, placeholder);
          break;
        case DirectiveType.ATTRIBUTE:
        case DirectiveType.ATTRIBUTE_VALUE:
          const marker = getAttributeMarker(id);
          const node = fragment.querySelector(`[${marker}]`);
          generators[id] = directiveData.d.factory(
            node,
            ...directiveData.d.args
          );
          node.removeAttribute(marker);
      }
    });
    renderedNodesMap.set(container, Array.from(fragment.childNodes));
  }

  const generators: DirectiveGenerator[] = generatorMap.get(container);
  htmlResult.directives.forEach(async (directiveData, id) => {
    const result = generators[id].next(directiveData.d.args);
    if (result.value) {
      const domUpdate: DOMUpdate[] = await result.value;
      schedule(
        () => {
          domUpdate.forEach(d => {
            switch (d.type) {
              case DOMUpdateType.TEXT:
                d.node.textContent = d.value;
                break;
              case DOMUpdateType.ADD_NODE:
                d.node.appendChild(d.newNode);
                break;
              case DOMUpdateType.REPLACE_NODE:
                d.node.parentNode.replaceChild(d.newNode, d.node);
                break;
              case DOMUpdateType.INSERT_BEFORE:
                d.node.parentNode.insertBefore(d.newNode, d.node);
                break;
              case DOMUpdateType.REMOVE:
                d.node.parentNode.removeChild(d.node);
                break;
              case DOMUpdateType.ADD_CLASS:
                (d.node as HTMLElement).classList.add(d.value);
                break;
              case DOMUpdateType.REMOVE_CLASS:
                (d.node as HTMLElement).classList.remove(d.value);
                break;
              case DOMUpdateType.SET_ATTRIBUTE:
                (d.node as HTMLElement).setAttribute(d.name, d.value);
                break;
            }
          });
        },
        init ? PriorityLevel.IMMEDIATE : undefined
      );
    }
  });
  if (fragment) {
    container.appendChild(fragment);
  }
};
