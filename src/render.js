import { $state } from "./reactivity.js";
import {
  patch,
  currentPointer,
  text,
  elementOpen,
  elementClose,
  attributes,
  symbols
} from "../web_modules/incremental-dom.js";
import { schedule } from "./scheduler.js";
import { normalizeHtmlResult } from "./html.js";

const defaultAttributeHandler = attributes[symbols.default];
attributes[symbols.default] = (element, name, value) => {
  if (name[0] === ".") {
    if (value) element[name.substr(1)] = value;
  } else {
    defaultAttributeHandler(element, name, value);
  }
};

function performRenderStep(htmlResult, inComponent = false) {
  htmlResult = normalizeHtmlResult(htmlResult);
  if (typeof htmlResult === "function") {
    htmlResult();
  } else if (typeof htmlResult !== "object") {
    if (htmlResult || Number(htmlResult) === htmlResult) text(htmlResult);
  } else {
    const { type, children, props } = htmlResult;
    if (typeof type === "function") {
      type();
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
