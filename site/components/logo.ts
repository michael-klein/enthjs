import { component, html, $prop, sub } from '../../src';
import { getCss } from '../utils';

component('nth-logo', () => {
  const css = getCss();
  const $showAlpha = $prop('showAlpha', false);
  const $showFullName = $prop('showFullName', false);
  return {
    render: () => html`
      <div
        ${css`
          color: #a2a9a9;
          font-size: inherit;
          background: #1a505b;
          padding: 5px;
          box-shadow: inset 0 0 3px #0000006b;
          border-radius: 4px;
          position: relative;
          white-space: nowrap;
          line-height: 1.1em;
          display: inline-block;
          > span {
            color: #ea5353;
          }
        `}
      >
        ${sub(
          $showAlpha.value
            ? html`
                <div
                  ${css`
                    position: absolute;
                    right: -2.5em;
                    top: -0.7em;
                    font-size: 0.5em;
                    letter-spacing: 0.05em;
                    color: white;
                    border: 1px solid #e45b5b;
                    background: #ea5353;
                    padding: 2px;
                    border-radius: 2px;
                    line-height: 1em;
                  `}
                >
                  alpha
                </div>
              `
            : html``
        )}
        ${sub(
          $showFullName.value
            ? html`
                e<span>nth</span>-js
              `
            : html`
                <span>nth</span>
              `
        )}
      </div>
    `,
  };
});
