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
} from '../dist/src/index.js';

// this is (currently) how you define a component
component('test-component', () => {
  // this method is the "setup" of the component
  // it will only run once!

  // $state creates a reactive object
  // any changes to the object (even nested) will trigger a re-render
  const $s = $state({ inputValue: '', swap: true });
  const $test = $attr('test');
  const $toast = $prop('toast', '');

  sideEffect(
    () => {
      $test.value = $s.inputValue;
      $toast.value = $s.inputValue;
      return () => {};
    },
    () => [$s.inputValue]
  ); // only runs when values in array change

  console.log(getElement());

  const renderSub = () => {
    if ($s.swap) {
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
    watch: [$s, $test, $toast],
    render: () => {
      return html`
        <div>
          <div>input value: ${text($s.inputValue)}</div>
          <div>test attribute value: ${text($test.value)}</div>
          <div>toast prop value: ${text($toast.value)}</div>
          <input
            id="in"
            type="text"
            ${input(value => {
              $s.inputValue = value; // simply re-assign inputValue to re-render
            })}
          />
          <br />
          ${sub(renderSub)}
          <button
            ${on('click', () => {
              $s.swap = !$s.swap;
            })}
          >
            swap
          </button>
        </div>
      `;
    },
  };
});
