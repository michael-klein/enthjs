import htm from "../web_modules/htm.js";
export { $state, proxify } from "./reactivity.js";
import { $state } from "./reactivity.js";
import {
  elementOpen,
  text,
  elementClose,
  patch,
  currentElement,
  skipNode,
  currentPointer,
  notifications
} from "../web_modules/incremental-dom.js";
import { IS_COMPONENT } from "./symbols.js";
import { schedule } from "./scheduler.js";
import { insertMaker } from "./component.js";
export { component } from "./component.js";

function h(type, props, ...children) {
  if (typeof type === "function") {
    type.props = props;
    return type;
  } else {
    return [
      () => {
        elementOpen(
          type,
          null,
          null,
          ...(props
            ? Object.keys(props).flatMap(propName => {
                if (propName === "propName") {
                  key = props[propName];
                }
                return [propName, props[propName]];
              })
            : [])
        );
      },
      children.map(child => {
        if (typeof child === "function" && child.is !== IS_COMPONENT) {
          return () => child();
        } else if (typeof child === "string" || typeof child === "number") {
          return () => text(child);
        } else {
          return child;
        }
      }),
      () => elementClose(type)
    ];
  }
}

export const html = htm.bind(h);
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

function getComponent(f) {
  let pointer = currentPointer();
  let component;
  if (!pointer || (pointer.nodeType !== 8 && !componentMap.has(pointer))) {
    const marker = insertMaker(pointer);
    pointer = marker;

    const state = $state({
      props: f.props || {}
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

function performRenderStep(renderfunctions, inComponent = false) {
  renderfunctions.forEach(f => {
    if (f) {
      if (Array.isArray(f)) {
        performRenderStep(f);
      } else if (f.is === IS_COMPONENT) {
        const component = getComponent(f);
        componentRenderMap.set(component, renderfunctions);
        skipNode();
        performRenderStep(component.render(f.props || {}), true);
      } else {
        const pointer = currentPointer();
        if (componentMap.has(pointer) && !inComponent) {
          componentMap.get(pointer).onUnMount();
          pointer.parentElement.removeChild(pointer);
          componentMap.delete(pointer);
        }
        f();
      }
    }
  });
}

export function render(node, renderFunctions, inComponent = false) {
  schedule(() => {
    return patch(node, function() {
      performRenderStep(renderFunctions, inComponent);
    });
  });
}
