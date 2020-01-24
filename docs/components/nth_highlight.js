import { component, html } from '../../dist/src/index.js';
import { css } from '../css.js';

const worker = new Worker('./docs/components/highlight_worker.js');
component('nth-highlight', function * (state) {
  worker.onmessage = event => {
    state.highlighted = event.data;
  };
  worker.postMessage("console.log('hi');");
  const className = css`
    background: #1f81a6;
    margin-left: -20px;
    margin-right: -20px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
    .hljs {
      display: block;
      overflow-x: auto;
      padding-top: 0.5em;
      padding-bottom: 0.5em;
    }

    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-section,
    .hljs-link {
      color: #8be9fd;
    }

    .hljs-function .hljs-keyword {
      color: #ff79c6;
    }

    .hljs,
    .hljs-subst {
      color: #f8f8f2;
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
      color: #f1fa8c;
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
      font-weight: bold;
    }

    .hljs-emphasis {
      font-style: italic;
    }
  `;
  for (;;) {
    const { highlighted = '' } = state;
    yield () => {
      return html`
        <div class="${className}">
          <div class="hljs">${html.call(html, [highlighted])}</div>
        </div>
      `;
    };
  }
});
