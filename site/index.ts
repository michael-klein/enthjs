import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'proxy-polyfill/src/proxy';
import { glob } from 'goober';

glob`
  @import url('https://fonts.googleapis.com/css?family=Muli:500|Rubik&display=swap');
  html,
  body {
    margin: 0;
    padding: 0;
  }
`;

import './components/nav_bar.ts';
import './components/container.ts';
import './components/intro.ts';
