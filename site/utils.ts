import * as goober from 'goober';
import { getElement, clss, $state, sideEffect } from '../src/';
import { State } from '../src/reactivity';

export const getCss = () => {
  const css = goober.css.bind({ target: getElement().shadowRoot });
  return (...args) => {
    return clss(css.apply(css, args));
  };
};
export function getIsInView(): State<{
  value: boolean;
}> {
  const $isInView = $state({ value: false });
  const element = getElement();
  sideEffect(
    () => {
      const handleScroll = e => {
        if (
          !$isInView.value &&
          window.scrollY > element.offsetTop - window.innerHeight / 1.5
        ) {
          $isInView.value = true;
          window.removeEventListener('scroll', handleScroll);
        }
      };
      window.addEventListener('scroll', handleScroll);
      requestAnimationFrame(() => {
        handleScroll();
      });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    },
    () => []
  );
  return $isInView;
}
