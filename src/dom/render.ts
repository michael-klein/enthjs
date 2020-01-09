import {
  HTMLResult,
  DirectiveType,
  getTextMarker,
  getAttributeMarker,
  DynamicData,
} from './html';
import { DirectiveGenerator, DOMUpdate, DOMUpdateType } from './directive';
import { schedule, PriorityLevel } from '../scheduler/scheduler';
const renderedNodesMap: WeakMap<HTMLElement, Node[]> = new WeakMap();
export const clear = (container: HTMLElement) => {
  if (renderedNodesMap.has(container)) {
    renderedNodesMap
      .get(container)
      .forEach(node => container.removeChild(node));
    renderedNodesMap.delete(container);
  }
};

const insertAttributeMarker = (
  marker: string,
  si: number,
  appendedStatic: string
): string => {
  while (si++) {
    const char = appendedStatic.charAt(si);
    if (!char) {
      break;
    }
    if (char === ' ') {
      return (
        appendedStatic.slice(0, si) + ' ' + marker + appendedStatic.slice(si)
      );
    }
  }
  return appendedStatic;
};

function createTemplate(
  htmlResult: HTMLResult,
  fallback: (data: DynamicData) => DynamicData
): HTMLTemplateElement {
  let appendedStatic: string = '';
  const { dynamicData, staticParts } = htmlResult;
  for (let i = 0; i < dynamicData.length; i++) {
    let data = applyFallback(dynamicData[i], fallback);
    const staticPart = staticParts[i];
    appendedStatic += staticPart;
    if (data.staticValue) {
      appendedStatic += data.staticValue;
    } else {
      switch (data.type) {
        case DirectiveType.TEXT:
          appendedStatic += data.marker;
          break;
        case DirectiveType.ATTRIBUTE_VALUE:
        case DirectiveType.ATTRIBUTE:
          appendedStatic = insertAttributeMarker(
            data.marker,
            appendedStatic.length + 1 - data.dx,
            appendedStatic
          );
          break;
      }
    }
  }
  appendedStatic += staticParts[staticParts.length - 1];
  const template = document.createElement('template');
  template.innerHTML = appendedStatic.trim();
  return template;
}
export type DirectiveFallback = (data: DynamicData) => DynamicData;
export interface DirectiveFallbacks {
  [DirectiveType.ATTRIBUTE]: DirectiveFallback;
}
const generatorMap: WeakMap<HTMLElement, DirectiveGenerator[]> = new WeakMap();
function processTemplate(
  template: HTMLTemplateElement,
  container: HTMLElement,
  htmlResult: HTMLResult
): void {
  const generators: DirectiveGenerator[] = [];
  generatorMap.set(container, generators);
  const fragment = template.content;
  const { dynamicData } = htmlResult;
  dynamicData.forEach((data, id) => {
    if (data.directive) {
      switch (data.type) {
        case DirectiveType.TEXT:
          const textMarker = getTextMarker(id);
          const placeholder = fragment.querySelector(textMarker);
          let textNode;
          let isTextArea = false;
          if (placeholder) {
            textNode = placeholder.firstChild;
          } else {
            isTextArea = true;
            const textareas = fragment.querySelectorAll('textarea');
            for (let i = 0; i < textareas.length; i++) {
              const area = textareas[i];
              if (area.innerText.includes(textMarker)) {
                textNode = area.firstChild;
                break;
              }
            }
          }
          generators[id] = data.directive.factory.call(
            { type: data.type },
            textNode,
            ...data.directive.args
          );
          if (!isTextArea) {
            placeholder.parentNode.replaceChild(textNode, placeholder);
          }
          break;
        case DirectiveType.ATTRIBUTE:
        case DirectiveType.ATTRIBUTE_VALUE:
          const marker = getAttributeMarker(id);
          const node = fragment.querySelector(`[${marker}]`);
          generators[id] = data.directive.factory.call(
            { type: data.type },
            node,
            ...data.directive.args
          );
          node.removeAttribute(marker);
      }
    }
  });
  renderedNodesMap.set(container, Array.from(fragment.childNodes));
}

function applyFallback(
  data: DynamicData,
  fallback: (data: DynamicData) => DynamicData
): DynamicData {
  if (!data.directive) {
    Object.assign(data, fallback(data));
    if (data.directive) {
      data.staticValue = undefined;
    }
  }
  return data;
}

let currentFallback: (data: DynamicData) => DynamicData;
export const render = (
  container: HTMLElement,
  htmlResult: HTMLResult,
  fallback: (data: DynamicData) => DynamicData = currentFallback ||
    (data => data)
): Promise<void> => {
  currentFallback = fallback;
  let fragment: DocumentFragment;
  let init = false;
  if (!renderedNodesMap.has(container)) {
    init = true;
    const template = createTemplate(htmlResult, fallback);
    processTemplate(template, container, htmlResult);
    fragment = template.content;
  }
  const generators: DirectiveGenerator[] = generatorMap.get(container);

  const promise = Promise.all(
    htmlResult.dynamicData.map(async (data, id) => {
      applyFallback(data, fallback);
      if (data.directive) {
        if (
          data.prevValues.length !== data.directive.args.length ||
          data.prevValues.findIndex(
            (arg, index) =>
              data.directive.args[index] !== arg ||
              data.directive.args[index] instanceof Object
          ) > -1
        ) {
          const result = await generators[id].next(data.directive.args);
          data.prevValues.length = 0;
          data.prevValues.push(...data.directive.args);
          if (result.value) {
            const domUpdate: DOMUpdate[] = await result.value;
            return schedule(
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
        }
      }
    })
  ).then(() => {
    currentFallback = undefined;
  });
  if (fragment) {
    container.appendChild(fragment);
  }
  return promise;
};
