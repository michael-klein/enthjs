import { getOnlySetupError } from './misc';

const global: { __$c: HTMLElement } = window as any;

export const setUpContext = (context: HTMLElement, cb: () => void): void => {
  global.__$c = context;
  cb();
  global.__$c = undefined;
};

export const getElement = (): HTMLElement => {
  if (global.__$c) {
    return global.__$c;
  } else {
    throw getOnlySetupError('getElement');
  }
};
