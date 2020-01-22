import {
  HTMLResult,
  DirectiveType,
  getTextMarker,
  getAttributeMarker,
  DynamicData,
} from './html';
import { DOMUpdateType, DirectiveGenerator } from './directive';
import { schedule, PriorityLevel } from '../scheduler/scheduler';

const renderedNodesMap: WeakMap<Node, Node[]> = new WeakMap();
export const clear = (container: HTMLElement) => {
  if (renderedNodesMap.has(container)) {
    renderedNodesMap
      .get(container)
      .forEach(node => container.removeChild(node));
    renderedNodesMap.delete(container);
  }
};
export type Fallback = (data: DynamicData) => DynamicData;
let currentFallback: Fallback = data => data;
export function defineFallback(fallback: Fallback): void {
  currentFallback = fallback;
}

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

function createTemplate(htmlResult: HTMLResult): HTMLTemplateElement {
  let appendedStatic: string = '';
  const { dynamicData, staticParts } = htmlResult;
  for (let i = 0; i < dynamicData.length; i++) {
    let data = applyFallback(dynamicData[i], currentFallback);
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
const generatorMap: WeakMap<Node, DirectiveGenerator[]> = new WeakMap();
function processTemplate(
  template: HTMLTemplateElement,
  container: Node,
  htmlResult: HTMLResult
): void {
  const generators: DirectiveGenerator[] = [];
  generatorMap.set(container, generators);
  const fragment = template.content;
  htmlResult.template = template.cloneNode(true) as HTMLTemplateElement;
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
            {
              type: data.type,
              container,
            },
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
            {
              type: data.type,
              container,
            },
            node,
            ...data.directive.args
          );
          node.removeAttribute(marker);
      }
    }
  });
  renderedNodesMap.set(container, Array.from(fragment.childNodes));
}

function applyFallback(data: DynamicData, fallback: Fallback): DynamicData {
  if (!data.directive) {
    Object.assign(data, fallback(data));
    if (data.directive) {
      data.staticValue = undefined;
    }
  }
  return data;
}

interface CachedData {
  staticParts?: TemplateStringsArray;
  states?: any[];
  prevValues?: any[][];
}
const containerDataCache: WeakMap<Node, CachedData> = new WeakMap();
export const render = (
  container: Node,
  htmlResult: HTMLResult
): Promise<void> => {
  let fragment: DocumentFragment;
  let init = false;
  const dataCache: CachedData = containerDataCache.get(container) || {};
  containerDataCache.set(container, dataCache);
  if (!renderedNodesMap.has(container)) {
    init = true;
    const template = createTemplate(htmlResult);
    processTemplate(template, container, htmlResult);
    fragment = template.content;
  }
  const generators: DirectiveGenerator[] = generatorMap.get(container);

  if (dataCache.staticParts !== htmlResult.staticParts) {
    dataCache.staticParts = htmlResult.staticParts;
    dataCache.states = [];
    dataCache.prevValues = [];
  }
  const promise = Promise.all(
    htmlResult.dynamicData.map(async (data, id) => {
      if (!dataCache.prevValues[id]) {
        dataCache.prevValues[id] = [];
      }
      data = applyFallback(data, currentFallback);
      if (data.directive) {
        if (
          dataCache.prevValues[id].length !== data.directive.args.length ||
          dataCache.prevValues[id].findIndex(
            (arg, index) =>
              data.directive.args[index] !== arg ||
              data.directive.args[index] instanceof Object
          ) > -1
        ) {
          if (dataCache.states[id] === undefined) {
            dataCache.states[id] = {};
          }
          const result = await generators[id].next(data.directive.args);
          const domUpdates = await result.value;
          dataCache.prevValues[id].length = 0;
          dataCache.prevValues[id].push(...data.directive.args);
          if (domUpdates && domUpdates.length > 0) {
            return schedule(
              () => {
                domUpdates.forEach(d => {
                  switch (d.type) {
                    case DOMUpdateType.TEXT:
                      d.node.textContent = d.value;
                      break;
                    case DOMUpdateType.ADD_NODE:
                      d.node.appendChild(d.newNode);
                      break;
                    case DOMUpdateType.PREPEND_NODE:
                      if (d.node.firstChild) {
                        d.node.insertBefore(d.newNode, d.node.firstChild);
                      } else {
                        d.node.appendChild(d.newNode);
                      }
                      break;
                    case DOMUpdateType.REPLACE_NODE:
                      d.node.parentNode.replaceChild(d.newNode, d.node);
                      break;
                    case DOMUpdateType.INSERT_BEFORE:
                      d.node.parentNode.insertBefore(d.newNode, d.node);
                      break;
                    case DOMUpdateType.INSERT_AFTER:
                      if (d.node.nextSibling) {
                        d.node.parentNode.insertBefore(
                          d.newNode,
                          d.node.nextSibling
                        );
                      } else {
                        d.node.parentNode.appendChild(d.newNode);
                      }
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
  ).then(() => {});
  if (fragment) {
    container.appendChild(fragment);
  }
  return promise;
};
