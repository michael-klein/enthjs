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
  list,
  sub,
  key,
} from '../dist/src/index.js';

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
// this is (currently) how you define a component
component('test-component', () => {
  // this method is the "setup" of the component
  // it will only run once!

  // $state creates a reactive object
  // any changes to the object (even nested) will trigger a re-render
  const $s = $state({ inputValue: '', swap: true, keys: [1, 2, 3, 4] });
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

  function shuffleKeys() {
    const keys = [...$s.keys];
    $s.keys = shuffle(keys);
  }

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
          ${sub(
            $s.swap
              ? html`
                  <div>this text</div>
                `
              : html`
                  <div>can be changed</div>
                  <div>just like this</div>
                `
          )}
          <button
            ${on('click', () => {
              $s.swap = !$s.swap;
            })}
          >
            swap
          </button>
          <br /><br />
          ${list([
            ...$s.keys.map(
              k => html`
                <div ${key(k + '')}>${text(`key: ${k}`)}</div>
              `
            ),
            html`
              <div>keyless</div>
            `,
          ])}
          <button ${on('click', () => shuffleKeys())}>shuffle</button>
        </div>
      `;
    },
  };
});
