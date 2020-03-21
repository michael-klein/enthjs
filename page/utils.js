import { layoutEffect, getElement } from "../src/index.js";
import * as goober from "./web_modules/goober.js";

export function applyGlobalStyles(css) {
  css`
    @import url("https://fonts.googleapis.com/css?family=Bungee+Shade|Fira+Sans:100,200,300,400,500,600,700,800,900&display=swap");
    html {
      box-sizing: border-box;
      font-size: 16px;
      font-family: "Fira Sans", sans-serif;
    }
    body {
      background: #171717;
      color: #b7ffe0;
      text-shadow: 0px 2px 3rem #b7ffe04a;
    }

    .darker {
      color: #84b5a0;
      text-shadow: 0px 2px 3rem #84b5a04a;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    body,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    ol,
    ul {
      margin: 0;
      padding: 0;
      font-weight: normal;
    }

    ol,
    ul {
      list-style: none;
    }

    img {
      max-width: 100%;
      height: auto;
    }
    .bungee {
      font-family: "Bungee Shade", cursive;
    }
    .container {
      margin: 0px auto;
      width: 100%;
      max-width: 1000px;
      padding-left: 20px;
      padding-right: 20px;
    }
  `;
}

export function getCss() {
  const element = getElement();
  const styleContainer = document.createElement("div");
  styleContainer.setAttribute("data-skip", true);
  element.shadowRoot.appendChild(styleContainer);
  const css = goober.css.bind({ target: styleContainer });
  const glob = goober.css.bind({ target: styleContainer, g: 1 });
  applyGlobalStyles(glob);
  return css;
}
