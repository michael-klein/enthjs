import { html, component, $state, attr, input, text, $attr } from '../../src/';

component('nth-hello-world', () => {
  const $input = $state({ value: 'Hello World!' });
  const $style = $attr('style', 'color: white;');
  return {
    watch: [$input, $style],
    render: () => {
      return html`
        <div ${attr('style', $style.value)}>
          <div>${text($input.value)}</div>
          <div>
            <input
              type="text"
              ${attr('value', $input.value)}
              ${input(value => ($input.value = value))}
            />
          </div>
        </div>
      `;
    },
  };
});
