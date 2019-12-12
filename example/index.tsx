import 'react-app-polyfill/ie11';
import { html, $attr, text, input, $state, $prop, getElement, sideEffect, component } from '../.';

// this is (currently) how you define a component
component("test-component", () => {
  // this method is the "setup" of the component
  // it will only run once!

  // $state creates a reactive object
  // any changes to the object (even nested) will trigger a re-render
  const state = $state({ inputValue: "" });
  const $test = $attr('test');
  const $toast = $prop('toast', '');

  sideEffect(() => {
    console.log("Sideeffect!");
    $test.value = state.inputValue;
    $toast.value = state.inputValue;
    return () => {
      console.log("CleanUp!")
    }
  },
    () => [state.inputValue]); // only runs when values in array change

  console.log(getElement())

  return {
    render: () => html`<div>
      <div >input value: ${text(state.inputValue)}</div>
      <div >test value: ${text($test.value)}</div>
      <div >toast value: ${text($toast.value)}</div>

      <input id="in" type="text" ${input(value => {
      state.inputValue = value // simply re-assign inputValue to re-render
    })} />
    </div>`
  }
})

