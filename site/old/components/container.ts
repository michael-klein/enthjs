import { html, component } from '../../../src/enthjs';
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
