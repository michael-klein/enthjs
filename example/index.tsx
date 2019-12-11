import 'react-app-polyfill/ie11';
import { html, render, text, input, state, setUpState, component } from '../.';

// this is (currently) how you define a component
component("test-component", () => {
  // state creates a reactive object
  // any changes to the object (even nested) will trigger a re-render
  const s = state({ value: "" });
  return {
    render: () => html`<div>
      <div >input value: ${text(s.value)}</div>
      <input id="in" type="text" ${input(value => {
      s.value = value // simply re-assign value to re-render
    })}></input>
    </div>`
  }
})

