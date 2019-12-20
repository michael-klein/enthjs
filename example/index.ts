import {
  html,
  $attr,
  text,
  on,
  input,
  $state,
  $prop,
  getElement,
  sideEffect,
  component,
  sub,
} from '../dist';

// this is (currently) how you define a component
component('test-component', () => {
  // this method is the "setup" of the component
  // it will only run once!

  // $state creates a reactive object
  // any changes to the object (even nested) will trigger a re-render
  const state = $state({ inputValue: '', swap: true });
  const $test = $attr('test');
  const $toast = $prop('toast', '');

  sideEffect(
    () => {
      $test.value = state.inputValue;
      $toast.value = state.inputValue;
      return () => {};
    },
    () => [state.inputValue]
  ); // only runs when values in array change

  console.log(getElement());

  const renderSub = () => {
    if (state.swap) {
      return html`
        <div>this text</div>
      `;
    } else {
      return html`
        <div>can be changed</div>
        <div>just like this</div>
      `;
    }
  };
  return {
    render: () => {
      return html`
        <div>
          <div>input value: ${text(state.inputValue)}</div>
          <div>test attribute value: ${text($test.value)}</div>
          <div>toast prop value: ${text($toast.value)}</div>
          <input
            id="in"
            type="text"
            ${input(value => {
              state.inputValue = value; // simply re-assign inputValue to re-render
            })}
          />
          <br />
          ${sub(renderSub)}
          <button
            ${on('click', () => {
              state.swap = !state.swap;
            })}
          >
            swap
          </button>
        </div>
      `;
    },
  };
});
