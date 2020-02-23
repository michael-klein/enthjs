import { $state } from "./reactivity.js";
import {
  patch,
  text,
  elementOpen,
  elementClose,
  attributes,
  symbols,
  currentElement
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

function performRenderStep(htmlResult) {
  if (htmlResult) {
    htmlResult = normalizeHtmlResult(htmlResult);
    if (!htmlResult.type) {
      console.log(currentElement(), htmlResult);
    }
    const { type, children, props } = htmlResult;
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
    children.forEach(child => {
      if (!(child instanceof Object)) {
        if (child || Number(child) === child) text(child);
      } else if (typeof child === "function") {
        child();
      } else {
        performRenderStep(child);
      }
    });
    if (type) {
      elementClose(type);
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
