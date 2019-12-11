import 'react-app-polyfill/ie11';
import { html, $attr, text, input, $state, sideEffect, component } from '../.';

// this is (currently) how you define a component
component("test-component", () => {
  // this method is the "setup" of the component
  // it will only run once!

  // $state creates a reactive object
  // any changes to the object (even nested) will trigger a re-render
  const state = $state({ inputValue: "" });
  const $test = $attr('test', 'initialValue');

  sideEffect(() => {
    console.log("I will run after ever render!");
    $test.value = state.inputValue;
  })

  return {
    render: () => html`<div>
      <div >input value: ${text(state.inputValue)}</div>
      <input id="in" type="text" ${input(value => {
      state.inputValue = value // simply re-assign inputValue to re-render
    })} />
    </div>`
  }
})

