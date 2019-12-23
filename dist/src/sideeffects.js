import { getElement } from "./context.js";
import { schedule, PriorityLevel } from "./scheduler.js";
const sideEffectsMap = new WeakMap();
export const sideEffect = (effect, dependencies) => {
    const element = getElement();
    sideEffectsMap.set(element, (sideEffectsMap.get(element) || []).concat({
        e: effect,
        d: dependencies,
    }));
};
const shouldEffectRun = (effectMapItem) => {
    const { d, p } = effectMapItem;
    let shouldRun = true;
    if (d) {
        const deps = d();
        if (p &&
            (deps === p ||
                (deps.length === p.length &&
                    deps.findIndex((dep, index) => p[index] !== dep))) === -1) {
            shouldRun = false;
        }
    }
    return shouldRun;
};
export const runSideEffects = (element) => {
    const sideEffects = sideEffectsMap.get(element) || [];
    if (sideEffects.length > 0) {
        return Promise.all(sideEffects
            .map(effectMapItem => {
            const { c } = effectMapItem;
            if (c && shouldEffectRun(effectMapItem)) {
                return schedule(() => {
                    c();
                    effectMapItem.c = undefined;
                }, PriorityLevel.USER_BLOCKING);
            }
            return undefined;
        })
            .filter(p => p)).then(() => Promise.all(sideEffects
            .map(effectMapItem => {
            const { e, d } = effectMapItem;
            let shouldRun = shouldEffectRun(effectMapItem);
            if (d) {
                effectMapItem.p = d();
            }
            if (shouldRun) {
                return schedule(() => {
                    const cleanUp = e();
                    if (cleanUp) {
                        effectMapItem.c = cleanUp;
                    }
                }, PriorityLevel.USER_BLOCKING);
            }
            return undefined;
        })
            .filter(p => p)));
    }
    else {
        return Promise.resolve([]);
    }
};
//# sourceMappingURL=sideeffects.js.map