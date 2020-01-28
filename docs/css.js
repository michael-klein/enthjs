import * as goober from './web_modules/goober.js';
import { getHost } from '../dist/src/index.js';

function addGlobal (css) {
  css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    ul[class],
    ol[class] {
      padding: 0;
    }

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

    ul[class],
    ol[class] {
      list-style: none;
    }

    a:not([class]) {
      text-decoration-skip-ink: auto;
    }

    img {
      max-width: 100%;
      display: block;
    }
    article > * + * {
      margin-top: 1em;
    }

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
      margin-top: 1em;
      font-family: 'Playfair Display', serif;
      margin-bottom: 0.4em;
    }
    h1:first-child {
      margin-top: 0em;
    }
    h1:not(:first-child) {
      margin-top: 1.5em;
    }
    nth-anchor {
      display: block;
      margin-top: -20px;
      padding-top: 20px;
    }
    h1:before,
    h2:before,
    h3:before,
    h4:before,
    h5:before,
    h6:before {
      content: '#';
      color: #3188aa;
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
      color: #297491;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    code {
      font-family: 'Fira Code', monospace;
    }
    p + p {
      margin-top: 1em;
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
  return (
    args &&
    args.length > 0 &&
    cssMap.get(shadowRoot).apply(cssMap.get(shadowRoot), args)
  );
};
