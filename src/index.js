export { $state, proxify } from "./reactivity.js";
import { $state } from "./reactivity.js";
import {
  patch,
  skipNode,
  currentPointer,
  notifications,
  text,
  elementOpen,
  elementClose
} from "../web_modules/incremental-dom.js";
import { IS_COMPONENT } from "./symbols.js";
import { schedule } from "./scheduler.js";
import { insertMaker } from "./component.js";
import { normalizeHtmlResult } from "./html.js";
export { component } from "./component.js";
export { html } from "./html.js";

const componentMap = new Map();
const componentRenderMap = new WeakMap();

notifications.nodesDeleted = function(nodes) {
  nodes.forEach(function(node) {
    if (componentMap.has(node)) {
      componentMap.get(node).onUnMount();
      componentMap.delete(node);
    }
  });
};

function handleComponent(f, props) {
  let pointer = currentPointer();
  let component;
  if (!pointer || (pointer.nodeType !== 8 && !componentMap.has(pointer))) {
    const marker = insertMaker(pointer);
    pointer = marker;

    const state = $state({
      props
    });
    component = f(state, () => {
      if (pointer.parentElement) {
        render(pointer.parentElement, componentRenderMap.get(component), true);
      }
    });
    componentMap.set(pointer, component);
  } else {
    component = componentMap.get(pointer);
  }
  return component;
}

function performRenderStep(htmlResult, inComponent = false) {
  htmlResult = normalizeHtmlResult(htmlResult);
  if (typeof htmlResult === "function") {
    htmlResult();
  } else if (typeof htmlResult !== "object") {
    if (htmlResult || Number(htmlResult) === htmlResult) text(htmlResult);
  } else {
    const { type, children, props } = htmlResult;
    if (typeof type === "function") {
      if (type.is === IS_COMPONENT) {
        const component = handleComponent(type, props || {});
        componentRenderMap.set(component, htmlResult);
        skipNode();
        performRenderStep(component.render(props || {}), true);
      } else {
        type();
      }
    } else {
      if (type) {
        elementOpen(
          type,
          null,
          null,
          ...(props
            ? Object.keys(props).flatMap(propName => {
                return [propName, props[propName]];
              })
            : [])
        );
      }
      const pointer = currentPointer();
      if (componentMap.has(pointer) && !inComponent) {
        componentMap.get(pointer).onUnMount();
        pointer.parentElement.removeChild(pointer);
        componentMap.delete(pointer);
      }
      children.forEach(performRenderStep);
      if (type) {
        elementClose(type);
      }
    }
  }
}

export function render(node, htmlResult, inComponent = false) {
  schedule(() => {
    return patch(node, function() {
      performRenderStep(htmlResult, inComponent);
    });
  });
}
