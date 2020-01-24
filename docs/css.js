import * as goober from './web_modules/goober.js';
import { getHost } from '../dist/src/index.js';

function addGlobal (css) {
  css`
    *,
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
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-family: 'Playfair Display', serif;
    }
    h1:before,
    h2:before,
    h3:before,
    h4:before,
    h5:before,
    h6:before {
      content: '#';
      color: #2f99c1;
      display: inline-block;
      font-family: 'Fira Sans', sans-serif;
      margin-left: calc(-0.5em - 5px);
      margin-right: 5px;
    }
    * {
      font-family: 'Fira Sans', sans-serif;
    }
    .serif {
      font-family: 'Playfair Display', serif;
    }
    .sans {
      font-family: 'Fira Sans', sans-serif;
    }
    a,
    a:link,
    a:active,
    a:hover {
      color: #084c69;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `;
}

addGlobal(goober.glob);

const cssMap = new WeakMap();
export const css = (...args) => {
  const shadowRoot = getHost().shadowRoot;
  if (!cssMap.has(shadowRoot)) {
    cssMap.set(shadowRoot, goober.css.bind({ target: shadowRoot }));
    const global = document.getElementById('_goober').cloneNode(true);
    global.id = '';
    shadowRoot.appendChild(global);
  }
  return cssMap.get(shadowRoot).apply(cssMap.get(shadowRoot), args);
};
