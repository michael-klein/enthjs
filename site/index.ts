import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'proxy-polyfill/src/proxy';
import { glob } from 'goober';
import { reset } from './utils';

glob`
  @import url('https://fonts.googleapis.com/css?family=Muli:500|Rubik&display=swap');
  html,
  body {
    margin: 0;
    padding: 0;
  }
  /* Set core body defaults */
  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
    height: 3000px;
    text-shadow: 0px 1px 2px rgba(0,0,0,0.3);
    overflow-x: hidden;
  }
  ${reset}
`;

import './components/nav_bar.ts';
import './components/container.ts';
import './components/intro.ts';
import './components/hello_world';
import './components/router';
import './components/lottie';
import './components/logo';

document.addEventListener('DOMContentLoaded', function() {
  requestAnimationFrame(() => {
    document.body.style.opacity = '';
  });
});
