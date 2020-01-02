import { html, component } from '../../src';
import { getCss } from '../utils.ts';

component('nth-getting-started', () => {
  const css = getCss();

  return {
    render: () => {
      return html`
        <div
          ${css`
            background: white;
            padding-top: 100px;
            padding-bottom: 200px;
          `}
        >
          <nth-container>
            coming soon
          </nth-container>
        </div>
      `;
    },
  };
});
