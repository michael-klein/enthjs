import { getElement } from './context';
import { schedule, PriorityLevel } from './scheduler';

export type SideEffect = () => void;
const sideEffectsMap: WeakMap<HTMLElement, SideEffect[]> = new WeakMap();

export const sideEffect = (effect: () => void) => {
  const element = getElement();
  sideEffectsMap.set(
    element,
    (sideEffectsMap.get(element) || []).concat(effect)
  );
};

export const runSideEffects = (element: HTMLElement): Promise<void[]> => {
  const sideEffects = sideEffectsMap.get(element) || [];
  if (sideEffects.length > 0) {
    return Promise.all(
      sideEffects.map(effect =>
        schedule(() => effect(), PriorityLevel.USER_BLOCKING)
      )
    );
  } else {
    return Promise.resolve([]);
  }
};
