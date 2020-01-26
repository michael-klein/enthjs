import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';

const worker = new Worker('./docs/components/highlight_worker.js');
component('nth-highlight', function * (state) {
  worker.onmessage = event => {
    state.highlighted = event.data;
  };
  const className = highlightCSS();
  let prevCode = '';
  for (;;) {
    const { highlighted = '', properties } = state;
    const { code } = properties;
    if (code && code !== prevCode) {
      worker.postMessage(code);
      prevCode = code;
    }
    yield () => {
      return html`
        <pre class="${className}">
          <code class="hljs">${html.call(html, [highlighted])}</code>
        </div>
      `;
    };
  }
});
function highlightCSS () {
  return css`
    background: #194d61;
    text-shadow: 0px 0px 0px #0b2731;
    margin-left: -20px;
    margin-right: -20px;
    padding: 0;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
    .hljs {
      display: block;
      overflow-x: auto;
      line-height: 1.4em;
      font-size: 0.9em;
      margin-top: -0.5em;
      margin-bottom: -2em;
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

    .hljs,
    .hljs-subst {
      color: #d1f1fb;
    }

    .hljs-string,
    .hljs-title,
    .hljs-name,
    .hljs-type,
    .hljs-attribute,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-addition,
    .hljs-variable,
    .hljs-template-tag,
    .hljs-template-variable {
      color: #fa8c8c;
    }

    .hljs-comment,
    .hljs-quote,
    .hljs-deletion,
    .hljs-meta {
      color: #6272a4;
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
