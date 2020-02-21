import { IS_COMPONENT } from "./symbols.js";
import { schedule, PriorityLevel } from "./scheduler.js";
import {
  skip,
  currentPointer,
  skipNode,
  currentElement
} from "../web_modules/incremental-dom.js";
import { normalizeHtmlResult } from "./html.js";

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
export function component(gen) {
  function Component(state, requestRender) {
    let scheduled = false;
    let scheduleNext = false;

    const generator = gen(state);

    function scheduleRender() {
      if (!scheduled) {
        scheduled = true;
        schedule(() => {
          requestRender();
        });
      } else {
        scheduleNext = true;
      }
    }

    function scheduleSideEffect(effectData) {
      schedule(() => {
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
      });
    }

    let canSchedule;
    let propsChanged;
    state.on(() => {
      if (canSchedule) scheduleRender();
      propsChanged = true;
    });
    let initialized = false;
    const context = {
      sideEffects: []
    };
    return {
      get props() {
        return state.props;
      },
      onUnMount: () => {
        context.sideEffects.forEach(e => e.cleanUp && e.cleanUp());
        canSchedule = false;
      },
      render: props => {
        canSchedule = false;
        propsChanged = false;
        if (!props) {
          state.props = props;
        } else {
          const oldKeys = state.props ? Object.keys(state.props) : [];
          Object.keys(props).forEach(key => {
            state.props[key] = props[key];
            const index = oldKeys.indexOf(key);
            if (index > -1) {
              oldKeys.splice(index, 1);
            }
          });
          oldKeys.forEach(key => {
            delete state.props[key];
          });
        }
        if (propsChanged || scheduled || !initialized) {
          const insertBackPointer = !initialized;
          if (!initialized) {
            setupContext = context;
            initialized = true;
          }
          let result = normalizeHtmlResult(generator.next().value || []);
          setupContext = void 0;
          result.children.push(() => {
            context.sideEffects.forEach(scheduleSideEffect);
            scheduled = false;
            if (scheduleNext) {
              scheduleNext = false;
              scheduleRender();
            }
            canSchedule = true;
            if (insertBackPointer) {
              insertMaker(currentPointer());
            }
            skipNode();
          });
          return result;
        } else {
          return [
            () => {
              let pointer = null;
              skipNode();
              while (pointer || pointer === null) {
                pointer = currentPointer();
                if (pointer && pointer.nodeType === 8) {
                  skipNode();
                } else {
                  break;
                }
              }
            }
          ];
        }
      }
    };
  }
  Component.is = IS_COMPONENT;
  return Component;
}
