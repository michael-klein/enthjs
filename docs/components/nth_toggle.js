import { component, html, createEvent } from '../../dist/src/index.js';
import { css } from '../css.js';

component('nth-toggle', function * (state) {
  const height = 20;
  const padding = 4;
  const width = height * 2 - padding * 2;
  const className = css`
    position: relative;
    display: inline-block;
    width: ${width}px;
    height: ${height}px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    .slider:before {
      position: absolute;
      content: '';
      height: ${height - padding * 2}px;
      width: ${height - padding * 2}px;
      left: ${padding}px;
      bottom: ${padding}px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    input:checked + .slider {
      background-color: #297491;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #297491;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(${100}%);
      -ms-transform: translateX(${100}%);
      transform: translateX(${100}%);
    }

    .slider.round {
      border-radius: ${height}px;
    }

    .slider.round:before {
      border-radius: 50%;
    }
  `;
  const fireToggled = createEvent('toggled');
  for (;;) {
    yield () => {
      return html`
        <label class="${className}">
          <input
            type="checkbox"
            ${state.properties.toggled ? 'checked' : ''}
            oninput="${e => fireToggled(e.target.checked)}"
          />
          <span class="slider round"></span>
        </label>
      `;
    };
  }
});
