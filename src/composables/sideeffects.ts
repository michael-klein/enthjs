import { getElement } from './element';
import { schedule, PriorityLevel } from '../scheduler';

export type CleanUp = () => void;
export type SideEffect = () => void | CleanUp;
interface SideEffectsMapItem {
  e: SideEffect;
  d?: () => any[];
  p?: any[];
  c?: CleanUp;
}
const sideEffectsMap: WeakMap<
  HTMLElement,
  SideEffectsMapItem[]
> = new WeakMap();

export const sideEffect = (effect: () => void, dependencies?: () => any[]) => {
  const element = getElement();
  sideEffectsMap.set(
    element,
    (sideEffectsMap.get(element) || []).concat({
      e: effect,
      d: dependencies,
    })
  );
};
const shouldEffectRun = (effectMapItem: SideEffectsMapItem): boolean => {
  const { d, p } = effectMapItem;
  let shouldRun: boolean = true;
  if (d) {
    const deps = d();
    if (
      p &&
      (deps === p ||
        (deps.length === p.length &&
          deps.findIndex((dep, index) => p[index] !== dep))) === -1
    ) {
      shouldRun = false;
    }
  }
  return shouldRun;
};
export const runSideEffects = (element: HTMLElement): Promise<void[]> => {
  const sideEffects = sideEffectsMap.get(element) || [];
  if (sideEffects.length > 0) {
    return Promise.all(
      sideEffects
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
        .filter(p => p)
    ).then(() =>
      Promise.all(
        sideEffects
          .map(effectMapItem => {
            const { e, d } = effectMapItem;
            let shouldRun: boolean = shouldEffectRun(effectMapItem);
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
          .filter(p => p)
      )
    );
  } else {
    return Promise.resolve([]);
  }
};
