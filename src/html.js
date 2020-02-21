import htm from "../web_modules/htm.js";
import {
  elementOpen,
  text,
  elementClose
} from "../web_modules/incremental-dom.js";
export function normalizeHtmlResult(htmlResult) {
  if (Array.isArray(htmlResult)) {
    htmlResult = {
      children: htmlResult
    };
  }
  return htmlResult;
}
function h(type, props, ...children) {
  return { type, props, children };
}

export const html = htm.bind(h);
