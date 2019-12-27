import * as goober from 'goober';
import { getElement, clss } from '../dist/src';

export const getCss = () => {
  const css = goober.css.bind({ target: getElement().shadowRoot });
  return (...args) => clss(css.apply(css, args));
};