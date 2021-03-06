import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';
import { toggleState } from './nth_toggle.js';

export function toggled (parts, ...slots) {
  return { parts, slots };
}

component('nth-highlight', function * (state) {
  state.merge(toggleState);
  let prevCode = '';
  state.loading = false;
  const className = highlightCSS();
  for (;;) {
    let { highlighted = '', properties, toggled } = state;
    let { code } = properties;
    if (typeof code === 'object') {
      code = code.parts
        .map(
          (part, index) =>
            part + (code.slots[index] ? code.slots[index][toggled ? 0 : 1] : '')
        )
        .join('');
    }
    if (code && code !== prevCode) {
      let result = localStorage.getItem(code);
      if (!result) {
        const worker = new Worker('./docs/components/highlight_worker.js');
        worker.onmessage = event => {
          localStorage.setItem(code, event.data);
          state.highlighted = event.data;
          state.loading = false;
          worker.terminate();
        };
        worker.postMessage(code);
        state.loading = true;
      } else {
        state.highlighted = result;
        highlighted = result;
      }
      prevCode = code;
    }
    yield () => {
      return html`
        <pre
          class="${className}"
          style="${state.loading ? 'opacity: 0.6 ' : 'opacity: 1'}"
        >
          <code class="hljs">${html.call(html, [highlighted])}</code>
        </pre>
      `;
    };
  }
});
function highlightCSS () {
  return css`
    background: #194d61;
    text-shadow: 0px 0px 0px #0b2731;
    padding: 0;
    margin-bottom: 10px;
    margin-top: 10px;
    max-width: 100%;
    position: relative;
    &:before,
    &:after {
      content: '';
      display: block;
      top: 0px;
      bottom: 0px;
      width: 20px;
      left: -20px;
      background: #194d61;
      position: absolute;
    }
    &:after {
      left: initial;
      right: -20px;
    }
    .hljs {
      display: block;
      overflow-x: auto;
      line-height: 1.4em;
      font-size: 0.9em;
      margin-top: -0.5em;
      margin-bottom: -2.2em;
      width: 100%;
      color: #d1f1fb;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-section,
    .hljs-link {
      color: #6bc3e3;
    }

    .hljs-function .hljs-keyword {
      color: #ffc043;
    }

    .hljs-subst {
      color: #2cc1ca;
    }

    .hljs-string,
    .hljs-title,
    .hljs-type,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-addition,
    .hljs-attribute,
    .hljs-variable,
    .hljs-template-tag,
    .hljs-template-variable {
      color: #fa8c8c;
    }

    .hljs-name {
      color: yellowgreen;
    }

    .hljs-attr {
      color: bisque;
    }
    .hljs-comment,
    .hljs-quote,
    .hljs-deletion,
    .hljs-meta {
      color: #6294a4;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-title,
    .hljs-section,
    .hljs-doctag,
    .hljs-type,
    .hljs-name,
    .hljs-strong {
      font-weight: normal;
    }

    .hljs-emphasis {
      font-style: italic;
    }
  `;
}
