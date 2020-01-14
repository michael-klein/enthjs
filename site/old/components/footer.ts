import { component, html, $prop, sub } from '../../../src/export';
import { getCss } from '../utils';

component('nth-footer', () => {
  const css = getCss();
  return {
    render: () => html`
      <footer
        ${css`
          background: #083d48;
          color: white;
          font-size: 1em;
          font-family: 'Rubik', sans-serif;
          padding-top: 50px;
          padding-bottom: 100px;
          text-align: right;
        `}
      >
        <nth-container>© 2020 Michael Klein</nth-container>
      </footer>
    `,
  };
});
