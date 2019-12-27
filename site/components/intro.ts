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
  clss,
} from '../../src/';
import { getCss } from '../utils.ts';
import introImage from '../images/imac.svg';
component('nth-intro', () => {
  const css = getCss();
  const $animationStates = $state({
    showImage: false,
    showTopText: false,
    showAsterisk: false,
    showBottomText: false,
  });
  sideEffect(
    () => {
      $animationStates.showImage = true;
      setTimeout(() => {
        $animationStates.showTopText = true;
      }, 300);
      setTimeout(() => {
        $animationStates.showBottomText = true;
        $animationStates.showAsterisk = true;
      }, 2000);
    },
    () => []
  );
  return {
    watch: [$animationStates],
    render: () => {
      return html`
        <div ${css`
          background: linear-gradient(166deg, #000000 50%, #232528 100%);
          padding-top: 50px;
          padding-bottom: 50px;
        `}>
          <nth-container>
            <div ${css`
              display: flex;
            `}>
              <div ${css`
                flex: 1;
                color: white;
                font-size: 2.5em;
                font-family: 'Rubik', sans-serif;
                display: flex;
                align-items: center;
                overflow: hidden;
              `}> 
                <div ${css`
                  max-width: 90%;
                `}>
                <p ${css`
                  line-height: 1.4em;
                  transform: translateY(
                    ${$animationStates.showTopText ? '0' : '400px'}
                  );
                  transition: all 0.5s ease-out;
                `}>
                Not just the <span ${css`
                  color: #ea5353;
                `}>nth</span> JavaScript framework you found today!<span ${css`
        position: relative;
        right: ${$animationStates.showAsterisk ? '0' : '-50px'};
        display: inline-block;
        opacity: ${$animationStates.showAsterisk ? '1' : '0'};
        transition: all 0.5s ease-out;
      `}>*</span></p>
                <p ${css`
                  font-size: 0.3em;
                  color: #a2a9a9;
                  padding-right: 40px;
                  transform: translateY(
                    ${$animationStates.showBottomText ? '0' : '400px'}
                  );
                  transition: all 0.5s ease-out;
                `} >
                * Okay maybe it is but if you keep scrolling there might be something here for you?  
              </p>
              </div>
            </div>
              <div ${css`
                flex: 1;
                overflow: hidden;
              `}>
                <img src=".${introImage}" ${css`
        width: 140%;
        margin-left: -12%;
        opacity: ${$animationStates.showTopText ? '1' : '0'};
        transition: all 0.5s ease-out;
      `} />
              </div>
            </div>
          </nth-container>
        </nav>
      `;
    },
  };
});
