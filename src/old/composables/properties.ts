import { getElement } from './element';
import { $state } from '../reactivity';

export const $prop = <T>(name: string, initialValue?: T): { value: T } => {
  const element = getElement() as any;
  const state = $state({ value: element[name] || initialValue });
  Object.defineProperty(element, name, {
    get: () => state.value,
    set: (value: any) => {
      state.value = value;
    },
  });
  return state;
};
