import htm from "../web_modules/htm.js";
export { $state, proxify } from "./reactivity.js";
import {
  elementOpen,
  text,
  elementClose,
  patch,
  currentElement,
  skip,
  skipNode,
  currentPointer,
  notifications
} from "../web_modules/incremental-dom.js";
import { IS_COMPONENT } from "./symbols.js";
import { schedule } from "./scheduler.js";
export { component } from "./component.js";

function h(type, props, ...children) {
  if (typeof type === "function") {
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
      ...children.map(child => {
        if (typeof child === "function") {
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

notifications.nodesDeleted = function(nodes) {
  nodes.forEach(function(node) {
    // node may be an Element or a Text
    console.log("removed", node);
  });
};

export const html = htm.bind(h);
const componentMap = new WeakMap();

function performRenderStep(renderfunctions) {
  renderfunctions.forEach(f => {
    if (f) {
      if (Array.isArray(f)) {
        performRenderStep(f);
      } else if (f.is === IS_COMPONENT) {
        let pointer = currentPointer();
        if (!pointer || pointer.nodeType !== 8) {
          const marker = document.createComment("");
          if (!pointer) {
            currentElement().appendChild(marker);
          } else {
            pointer.parentElement.insertBefore(marker, pointer);
          }
          pointer = marker;
          componentMap.set(pointer, f());
        }
        skipNode();
        performRenderStep(componentMap.get(pointer).next().value);
      } else f();
    }
  });
}

export function render(node, renderFunctions) {
  console.log(renderFunctions);
  schedule(() => {
    return patch(node, function() {
      performRenderStep(renderFunctions);
    });
  });
}
