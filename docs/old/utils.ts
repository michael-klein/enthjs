import * as goober from 'goober';
import { getElement, clss, $state, sideEffect } from '../../src/enthjs';
import { State } from '../../src/old/reactivity';

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
      setTimeout(() => {
        handleScroll();
      }, 100);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    },
    () => []
  );
  return $isInView;
}
export const reset = `*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default padding */
ul[class],
ol[class] {
  padding: 0;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
ul[class],
ol[class],
li,
figure,
figcaption,
blockquote,
dl,
dd {
  margin: 0;
}


/* Remove list styles on ul, ol elements with a class attribute */
ul[class],
ol[class] {
  list-style: none;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img {
  max-width: 100%;
  display: block;
}

/* Natural flow and rhythm in articles by default */
article > * + * {
  margin-top: 1em;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations and transitions for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`;

const glob = document.createElement('style');
glob.id = 'glob';
glob.textContent = reset;
export const getCss = () => {
  const shadowRoot = getElement().shadowRoot;
  if (!shadowRoot.getElementById('glob')) {
    shadowRoot.appendChild(glob.cloneNode(true));
  }
  const css = goober.css.bind({ target: shadowRoot });
  return (...args) => {
    return clss(css.apply(css, args));
  };
};
