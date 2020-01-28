import { component, html, sideEffect, getHost } from '../../dist/src/index.js';

component('nth-anchor', function * (state) {
  const host = getHost();
  const id = state.attributes.id;
  sideEffect(
    () => {
      const handler = () => {
        if ('#' + id === window.location.hash) {
          host.scrollIntoView();
        }
      };
      window.addEventListener('hashchange', handler);
      return () => window.removeEventListener('hashchange', handler);
    },
    () => []
  );
  for (;;) {
    yield () => {
      return html`
        <slot></slot>
      `;
    };
  }
});
