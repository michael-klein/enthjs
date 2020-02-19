import { IS_COMPONENT } from "./symbols.js";
import { schedule, PriorityLevel } from "./scheduler.js";

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

    let off;
    function startListening() {
      off = state.on(scheduleRender);
    }
    let initialized = false;
    const context = {
      sideEffects: []
    };
    return {
      get props() {
        return state.props;
      },
      render: props => {
        if (off) {
          off();
        }
        state.props = props;
        if (!initialized) {
          setupContext = context;
          initialized = true;
        }
        let result = generator.next().value || [];
        setupContext = void 0;
        result.push(() => {
          context.sideEffects.forEach(e =>
            schedule(() => {
              const prevDeps = e.prevDeps;
              const deps = e.getDeps();
              let shouldRun = prevDeps === INIT || !deps || deps.length === 0;
              if (!shouldRun) {
                if (
                  !deps ||
                  !prevDeps ||
                  deps.length !== prevDeps.length ||
                  deps.findIndex((d, i) => d !== prevDeps[i]) > -1
                ) {
                  shouldRun = true;
                }
              }
              e.prevDeps = deps;
              if (shouldRun) {
                if (e.cleanUp) {
                  e.cleanUp();
                }
                e.cleanUp = e.cb();
              }
            })
          );
          scheduled = false;
          if (scheduleNext) {
            scheduleNext = false;
            scheduleRender();
          }
          startListening();
        });
        return result;
      }
    };
  }
  Component.is = IS_COMPONENT;
  return Component;
}
