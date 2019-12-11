import { $state } from './reactivity';
import { getElement } from './context';
import { sideEffect } from './sideeffects';

const attributeCallbackMap: WeakMap<
  HTMLElement,
  { [key: string]: (() => void)[] }
> = new Map();
const observerMap: WeakMap<HTMLElement, MutationObserver> = new WeakMap();

const addObserver = (element: HTMLElement): void => {
  if (!observerMap.has(element)) {
    const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          const callbacks =
            (attributeCallbackMap.get(element) || {})[mutation.attributeName] ||
            [];
          callbacks.forEach(cb => cb());
        }
      }
    });
    observerMap.set(element, observer);
  }
};

const startObserving = (element: HTMLElement) => {
  if (observerMap.has(element)) {
    observerMap.get(element).observe(element, { attributes: true });
  }
};

const stopObserving = (element: HTMLElement) => {
  if (observerMap.has(element)) {
    observerMap.get(element).disconnect();
  }
};

const observeAttribute = (
  element: HTMLElement,
  name: string,
  cb: () => void
): void => {
  if (!attributeCallbackMap.has(element)) {
    attributeCallbackMap.set(element, {});
  }
  if (!attributeCallbackMap.get(element)[name]) {
    attributeCallbackMap.get(element)[name] = [];
  }
  attributeCallbackMap.get(element)[name].push(cb);
};

export const $attr = (
  name: string,
  initialValue: string = ''
): { value: string } => {
  const element = getElement();
  addObserver(element);
  observeAttribute(element, name, () => {
    const value = element.getAttribute(name);
    if (state.value !== value) {
      state.value = element.getAttribute(name);
    }
  });

  element.setAttribute(name, initialValue);

  const state = $state({ value: element.getAttribute(name) });

  sideEffect(() => {
    stopObserving(element);
    element.setAttribute(name, state.value);
    startObserving(element);
  });

  return state;
};
