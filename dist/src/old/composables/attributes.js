import { $state } from "../reactivity.js";
import { getElement } from "./element.js";
import { sideEffect } from "./sideeffects.js";
const attributeCallbackMap = new Map();
const observerMap = new WeakMap();
const addObserver = (element) => {
    if (!observerMap.has(element)) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    const callbacks = (attributeCallbackMap.get(element) || {})[mutation.attributeName] ||
                        [];
                    callbacks.forEach(cb => cb());
                }
            }
        });
        observerMap.set(element, observer);
    }
};
const startObserving = (element) => {
    if (observerMap.has(element)) {
        observerMap.get(element).observe(element, { attributes: true });
    }
};
const stopObserving = (element) => {
    if (observerMap.has(element)) {
        observerMap.get(element).disconnect();
    }
};
const observeAttribute = (element, name, cb) => {
    if (!attributeCallbackMap.has(element)) {
        attributeCallbackMap.set(element, {});
    }
    if (!attributeCallbackMap.get(element)[name]) {
        attributeCallbackMap.get(element)[name] = [];
    }
    attributeCallbackMap.get(element)[name].push(cb);
};
export const $attr = (name, initialValue = '') => {
    const element = getElement();
    addObserver(element);
    observeAttribute(element, name, () => {
        const value = element.getAttribute(name);
        if (state.value !== value) {
            state.value = element.getAttribute(name);
        }
    });
    if (element.hasAttribute(name)) {
        initialValue = element.getAttribute(name);
    }
    element.setAttribute(name, initialValue);
    const state = $state({ value: element.getAttribute(name) });
    sideEffect(() => {
        stopObserving(element);
        element.setAttribute(name, state.value);
        startObserving(element);
    }, () => [state.value]);
    return state;
};
//# sourceMappingURL=attributes.js.map