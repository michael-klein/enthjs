import {
  patch,
  text,
  elementOpen,
  elementClose,
  attributes,
  symbols,
  currentPointer,
  skipNode
} from "../web_modules/incremental-dom.js";
import { schedule, PriorityLevel } from "./scheduler.js";
import { normalizeHtmlResult } from "./html.js";

const transitionNodes = new WeakMap();
const defaultAttributeHandler = attributes[symbols.default];
export const TransitionState = {
  START: "transition-start",
  FADE_IN: "transition-fade-in",
  VISIBLE: "transition-visibile",
  FADE_OUT: "transition-fade-out",
  END: "transition-end"
};

function setTransitionState(node, state) {
  const transitionData = transitionNodes.get(node);
  node.classList.remove(transitionData.state);
  transitionData.state = state;
  if (state !== TransitionState.VISIBLE) {
    node.classList.add(transitionData.state);
  }
}

attributes[symbols.default] = (element, name, value) => {
  if (name[0] === ".") {
    if (value) element[name.substr(1)] = value;
  } else if (name[0] === "@") {
    if (!transitionNodes.has(element)) {
      const transitionData = { ...value };
      transitionNodes.set(element, transitionData);
      setTransitionState(element, TransitionState.START);
      if (transitionData.in) {
        schedule(() => {
          setTransitionState(element, TransitionState.FADE_IN);
          transitionData.id = setTimeout(() => {
            setTransitionState(element, TransitionState.VISIBLE);
          }, transitionData.in);
        }, PriorityLevel.USER_BLOCKING);
      }
    }
  } else {
    defaultAttributeHandler(element, name, value);
  }
};

function checkIfMoved(htmlResult, parent) {
  const { props, type } = htmlResult;
  if (parent && (props.key || props.id)) {
    if (
      parent.children.find(
        child =>
          ((child.props.key && child.props.key === props.key) ||
            (child.props.id && child.props.id === props.id)) &&
          child.type === type
      )
    ) {
      return true;
    }
  }
  return false;
}

function performRenderStep(htmlResult, parent = undefined) {
  if (htmlResult) {
    htmlResult = normalizeHtmlResult(htmlResult);
    let { type, children, props } = htmlResult;
    let pointer = currentPointer();

    while (transitionNodes.has(pointer)) {
      const transitionNode = pointer;
      const transitionData = transitionNodes.get(transitionNode);
      if (
        type !== transitionNode.tagName.toLowerCase() &&
        !checkIfMoved(htmlResult, parent)
      ) {
        skipNode();
        if (transitionData.state === TransitionState.FADE_IN) {
          clearTimeout(transitionData.id);
        }
        if (
          transitionData.state !== TransitionState.FADE_OUT &&
          transitionData.state !== TransitionState.END &&
          transitionData.out
        ) {
          setTransitionState(transitionNode, TransitionState.FADE_OUT);
          schedule(() => {
            transitionData.id = setTimeout(() => {
              setTransitionState(transitionNode, TransitionState.END);
              schedule(() => {
                if (transitionNode.parentNode) {
                  transitionNode.parentNode.removeChild(transitionNode);
                  transitionNodes.delete(transitionNode);
                }
              });
            }, transitionData.out);
          });
        } else {
          if (!transitionData.out) {
            transitionNode.parentNode.removeChild(transitionNode);
            transitionNodes.delete(transitionNode);
          }
        }
      } else {
        if (
          transitionData.state === TransitionState.FADE_OUT ||
          transitionData.state === TransitionState.END
        ) {
          clearTimeout(transitionData.id);
          setTransitionState(transitionNode, TransitionState.VISIBLE);
        }
        break;
      }
      pointer = currentPointer();
    }
    if (type) {
      elementOpen(
        type,
        null,
        null,
        ...(props
          ? Object.keys(props).reduce((memo, propName) => {
              memo.push(propName, props[propName]);
              return memo;
            }, [])
          : [])
      );
    }
    children.forEach(child => {
      if (!(child instanceof Object)) {
        if (child || Number(child) === child) text(child);
      } else if (typeof child === "function") {
        child();
      } else {
        performRenderStep(child, htmlResult);
      }
    });
    if (type) {
      elementClose(type);
    }
  }
}

const wasCleaned = new WeakSet();
export function removeEmptyTextNodes(node) {
  if (!wasCleaned.has(node)) {
    wasCleaned.add(node);
    for (var n = 0; n < node.childNodes.length; n++) {
      var child = node.childNodes[n];
      if (child.nodeType === 3 && !/\S/.test(child.nodeValue)) {
        node.removeChild(child);
        n--;
      } else if (child.nodeType === 1) {
        removeEmptyTextNodes(child);
      }
    }
  }
}

export function render(node, htmlResult) {
  removeEmptyTextNodes(node);
  schedule(() => {
    patch(node, function() {
      performRenderStep(htmlResult);
    });
  });
}
