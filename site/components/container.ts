import {
  html,
  $attr,
  text,
  on,
  input,
  $state,
  $prop,
  getElement,
  sideEffect,
  component,
  list,
  sub,
  key,
  clss,
} from '../../dist/src/index.js';
import { getCss } from '../utils.ts';

component('nth-container', () => {
  const css = getCss();
  return {
    render: () => {
      return html`
        <div
          ${css`
            max-width: 1000px;
            margin: 0 auto;
            padding-left: 20px;
            padding-right: 20px;
          `}
        >
          <slot></slot>
        </div>
      `;
    },
  };
});
