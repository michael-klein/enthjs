import {
  html,
  component,
  sideEffect,
  getElement,
  $attr,
  $prop,
} from '../../src';
import lottie from 'lottie-web';

component('nth-lottie', () => {
  const $animationData = $prop('animationData', '');
  const element = getElement();
  sideEffect(() => {
    if ($animationData.value) {
      lottie.loadAnimation({
        container: element.shadowRoot.querySelector('.lottie-wrapper'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: $animationData.value,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });
    }
  });
  return {
    render: () => {
      return html`
        <div class="lottie-wrapper"></div>
      `;
    },
  };
});
