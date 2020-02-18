import { IS_COMPONENT } from "./symbols.js";

export function isComponent(fun) {
  return fun.is === IS_COMPONENT;
}

export function component(gen) {
  function Component() {
    return gen();
  }
  Component.is = IS_COMPONENT;
  return Component;
}
