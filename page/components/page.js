import { html, component } from "../../src/index.js";
import "./sidebar.js";
import { getCss } from "../utils.js";

component("enthjs-page", function*(state) {
  const css = getCss();

  const pageClass = css``;
  for (;;) {
    yield html`
      <div class="container ${pageClass}">
        <enthjs-sidebar></enthjs-sidebar>
      </div>
    `;
  }
});
