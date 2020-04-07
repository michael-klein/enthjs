import { html, component } from "../../src/index.js";
import "./sidebar.js";
import { getCss } from "../utils.js";

component("enthjs-page", function* (state) {
  const css = getCss();

  const pageClass = css`
    display: flex;
    main {
      padding: 20px;
      padding-top: 180px;
    }
  `;
  state.text = "";
  for (;;) {
    const { text } = state;
    yield html`
      <div class="container ${pageClass}">
        <enthjs-sidebar></enthjs-sidebar>
        <main>
          <div>
            text: ${text}
          </div>
          <input
            value=${text}
            oninput=${(e) => (state.text = e.target.value)}
          />
        </main>
      </div>
    `;
  }
});
