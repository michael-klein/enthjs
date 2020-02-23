import { IS_COMPONENT } from "./symbols.js";
import { schedule, PriorityLevel } from "./scheduler.js";
import { currentElement } from "../web_modules/incremental-dom.js";
import { normalizeHtmlResult } from "./html.js";
import { render } from "./render.js";
import { $state, proxify } from "./reactivity.js";

export function isComponent(fun) {
  return fun.is === IS_COMPONENT;
}
let setupContext;
function checkContext(name) {
  if (!setupContext) {
    throw new Error(`You can only call ${name} during setup!`);
  }
}
const INIT = Symbol("init");
export function sideEffect(cb, getDeps = () => void 0) {
  checkContext("sideEffect");
  setupContext.sideEffects.push({
    cb,
    getDeps,
    prevDeps: INIT
  });
}
export function insertMaker(pointer) {
  const marker = document.createComment("");
  if (!pointer) {
    currentElement().appendChild(marker);
  } else {
    pointer.parentElement.insertBefore(marker, pointer);
  }
  return marker;
}

function scheduleSideEffect(effectData, init = false) {
  schedule(
    () => {
      const prevDeps = effectData.prevDeps;
      const deps = effectData.getDeps();
      let shouldRun = prevDeps === INIT || !deps;
      if (!shouldRun && deps && deps.length > 0) {
        if (
          !deps ||
          !prevDeps ||
          deps.length !== prevDeps.length ||
          deps.findIndex((d, i) => d !== prevDeps[i]) > -1
        ) {
          shouldRun = true;
        }
      }
      effectData.prevDeps = deps;
      if (shouldRun) {
        if (effectData.cleanUp) {
          effectData.cleanUp();
        }
        effectData.cleanUp = effectData.cb();
      }
    },
    init ? PriorityLevel.IMMEDIATE : PriorityLevel.NORMAL
  );
}

const observerMap = new WeakMap();

const addObserver = (element, onChange) => {
  if (!observerMap.has(element)) {
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes") {
          onChange(
            mutation.attributeName,
            element.getAttribute(mutation.attributeName)
          );
        }
      }
    });
    observerMap.set(element, observer);
  }
};

const startObserving = element => {
  if (observerMap.has(element)) {
    observerMap.get(element).observe(element, { attributes: true });
  }
};

const stopObserving = element => {
  if (observerMap.has(element)) {
    observerMap.get(element).disconnect();
  }
};

function createPropertyProxy(element, queueRender) {
  const accessedProps = [];
  const $properties = proxify({}, () => {}, {
    set: (obj, prop, value) => {
      if (obj[prop] !== value && accessedProps.includes(prop)) {
        queueRender();
      }
      return value;
    },
    get: (obj, prop) => {
      if (!obj[prop]) {
        obj[prop] = element[prop] || undefined;
      }
      if (!accessedProps.includes(prop)) {
        accessedProps.push(prop);
        Object.defineProperty(element, prop, {
          get: () => obj[prop],
          set: value => {
            if (obj[prop] !== value) {
              obj[prop] = value;
              queueRender();
            }
          }
        });
      }
    }
  });
  return $properties;
}

function createAttributeProxy(element, queueRender) {
  const accessedAttributes = [];
  const $attributes = proxify({}, () => {}, {
    set: (obj, prop, value) => {
      if (obj[prop] !== value) {
        schedule(() => {
          element.setAttribute(prop, value);
        });
        queueRender();
      }
      return value;
    },
    get: (obj, prop) => {
      if (!obj[prop]) {
        obj[prop] = element.getAttribute(prop) || undefined;
      }
      if (!accessedAttributes.includes(prop)) {
        accessedAttributes.push(prop);
      }
      return obj[prop];
    }
  });
  addObserver(element, (name, value) => {
    if (accessedAttributes.includes(name)) {
      $attributes[name] = value;
    }
  });
  return $attributes;
}

const contextMap = new WeakMap();
export function component(name, gen) {
  customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // we keep anything on the context object that we don't want to expose on the element
        const context = {
          sideEffects: []
        };
        // the context is stored on a weak map for future use
        contextMap.set(this, context);

        // queueRender will use the scheduler to queue up renders
        let scheduled = false;
        let scheduleNext = false;
        context.init = true;
        context.queueRender = () => {
          if (!scheduled) {
            scheduled = true;
            schedule(
              () => {
                context.render();
                scheduled = false;
                if (scheduleNext) {
                  scheduleNext = false;
                  context.queueRender();
                }
              },
              context.init ? PriorityLevel.IMMEDIATE : PriorityLevel.NORMAL
            );
          } else {
            scheduleNext = true;
          }
        };

        // will render the component at handle side effects
        context.render = () => {
          if (context.init) {
            context.generator = gen(context.state);
            setupContext = context;
          }
          let result = normalizeHtmlResult(
            context.generator.next().value || []
          );
          setupContext = void 0;
          // add running of sideEffects at the end of the rendering
          result.children.push(() => {
            context.sideEffects.forEach(effectData =>
              scheduleSideEffect(effectData, context.init)
            );
            scheduled = false;
            if (context.init) {
              startObserving(this);
            }
            context.init = false;
            if (scheduleNext) {
              scheduleNext = false;
              context.queueRender();
            }
          });
          render(this.shadowRoot, result);
        };
      }

      connectedCallback() {
        const context = contextMap.get(this);
        if (!context.connected) {
          if (context.init) {
            // create the state object and wire up attributes and props
            context.state = $state({
              attributes: createAttributeProxy(this, () =>
                context.queueRender()
              ),
              props: createPropertyProxy(this, () => context.queueRender())
            });
          }
          context.connected = true;
          context.off = context.state.on(() => {
            context.queueRender();
          });
          context.queueRender();
        }
      }

      disconnectedCallback() {
        const context = contextMap.get(this);
        if (context.connected) {
          context.connected = false;
          context.off();
          stopObserving(this);
        }
      }
    }
  );
}
