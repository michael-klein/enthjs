import {
  html,
  $state,
  sideEffect,
  component,
  sub,
  attr,
  prop,
  getElement,
} from '../../src/';
import { getCss } from '../utils.ts';
import carbon from '../images/carbon.svg';
import { computerAnimation } from './animations/computer_animation';
import { getIsInView } from '../utils';

component('nth-intro', () => {
  const css = getCss();

  const $animationStates = $state({
    showImage: false,
    showExample: false,
    showTopText: false,
    showAsterisk: false,
    showBottomText: false,
  });

  const $opacity = $state({
    value: 1,
  });

  sideEffect(
    () => {
      setTimeout(() => {
        $animationStates.showTopText = true;
        $animationStates.showImage = true;
      }, 300);
      setTimeout(() => {
        $animationStates.showExample = true;
      }, 800);

      setTimeout(() => {
        $animationStates.showBottomText = true;
        $animationStates.showAsterisk = true;
      }, 2000);

      window.addEventListener('scroll', e => {
        $opacity.value = Math.max(
          0,
          1 -
            Math.min(
              100,
              Math.round((window.scrollY / (window.innerHeight * 0.6)) * 100) /
                100
            )
        );
      });
    },
    () => []
  );

  function renderTopText() {
    return html`
      <p
        ${css`
          line-height: 1.4em;
          transform: translateY(
            ${$animationStates.showTopText ? '0' : '400px'}
          );
          transition: all 0.5s ease-out;
        `}
      >
        Not just the
        <span
          ${css`
            display: inline-block;
            line-height: 1em;
          `}
        >
          <nth-logo></nth-logo
        ></span>
        JavaScript framework you found today!<span
          ${css`
            position: relative;
            right: ${$animationStates.showAsterisk ? '0' : '-50px'};
            display: inline-block;
            opacity: ${$animationStates.showAsterisk ? '1' : '0'};
            transition: all 0.5s ease-out;
          `}
          >*</span
        >
      </p>
    `;
  }

  function renderAsteriskText() {
    return html`
      <p
        ${css`
          font-size: 0.3em;
          color: #0f353d;
          text-shadow: 0px 1px 2px rgba(47, 178, 206, 0.42);
          padding-right: 40px;
          transform: translateY(
            ${$animationStates.showBottomText ? '0' : '400px'}
          );
          transition: all 0.5s ease-out;

          @media only screen and (max-width: 600px) {
            font-size: 0.5em;
            padding-right: 0px;
          }
        `}
      >
        * Okay maybe it is but if you keep scrolling there might be something
        here for you?
      </p>
    `;
  }

  function renderTextBox() {
    return html`
      <div
        ${css`
          flex: 1;
          color: white;
          font-size: 2.5em;
          font-family: 'Rubik', sans-serif;
          display: flex;
          align-items: center;
          overflow: hidden;
          @media only screen and (max-width: 600px) {
            font-size: 2.3em;
          }
        `}
      >
        <div
          ${css`
            max-width: 90%;
            @media only screen and (max-width: 600px) {
              max-width: 100%;
            }
          `}
        >
          ${sub(renderTopText())} ${sub(renderAsteriskText())}
        </div>
      </div>
    `;
  }

  function renderImage() {
    return html`
      <div
        ${css`
          flex: 1;
          overflow: hidden;
          position: relative;
          padding-bottom: 50px;
          display: flex;
          align-items: flex-end;
          align-self: center;
          transition: all 0.5s ease-out;
          opacity: ${$animationStates.showImage ? '1' : '0'};
        `}
      >
        <div
          ${css`
            width: 100%;
            position: relative;
            @media only screen and (max-width: 600px) {
              margin-top: 30px;
            }
          `}
        >
          <img
            ${css`
              width: 100%;
            `}
            src=".${carbon}"
          />
        </div>
        <div
          ${css`
            position: absolute;
            right: 10px;
            bottom: 30px;
            background: #1a505b;
            padding: 10px;
            border: 1px solid #098ba75e;
            border-radius: 5px;
            transition: all 0.5s ease-out;
            opacity: ${$animationStates.showExample ? '1' : '0'};
          `}
        >
          <nth-hello-world
            style="color:white; font-family:'Rubik', sans-serif; letter-spacing: .05em;"
          ></nth-hello-world>
        </div>
      </div>
    `;
  }

  return {
    watch: [$animationStates, $opacity],
    render: () => {
      return html`
        <div
          ${css`
            width: 100%;
            max-width: 100%;
            overflow: hidden;
          `}
        >
          <div
            ${css`
              padding-top: 25px;
              padding-bottom: 50px;
              margin-left: -20px;
              padding-left: 20px;
              margin-right: -20px;
              padding-right: 20px;
            `}
            ${attr(
              'style',
              `background: #098ba7; border-radius: 0 0 25% 75% / ${$opacity.value *
                85}px;`
            )}
          >
            <nth-container>
              <div
                ${css`
                  display: flex;
                  @media only screen and (max-width: 600px) {
                    display: block;
                    opacity: 1 !important;
                  }
                `}
                ${attr('style', `opacity:${$opacity.value}`)}
              >
                ${sub(renderTextBox())} ${sub(renderImage())}
              </div>
            </nth-container>
          </div>
          <nth-container>
            <nth-intro-section-info></nth-intro-section-info>
          </nth-container>
        </div>
      `;
    },
  };
});

component('nth-intro-section-info', () => {
  const css = getCss();
  const $isInView = getIsInView();
  return {
    watch: [$isInView],
    render: () => html`
      <div
        ${css`
          display: flex;
          margin-top: 100px;
          opacity: ${$isInView.value ? '1' : '0'};
          transition: all 1s;
          @media only screen and (max-width: 600px) {
            display: block;
          }
        `}
      >
        <div
          ${css`
            background: #1a505b;
            padding-top: 4%;
            padding-bottom: 4%;
            border-radius: 50%;
            max-width: 45%;
            height: 100%;
            @media only screen and (max-width: 600px) {
              display: none;
            }
            flex: 1;
            box-shadow: inset 0 0 9px #0000006b;
            overflow: hidden;
          `}
        >
          <div
            ${css`
              width: 130%;
              margin-left: -15%;
            `}
          >
            <nth-lottie ${prop('animationData', computerAnimation)}>
            </nth-lottie>
          </div>
        </div>
        <div
          ${css`
            font-family: Rubik, sans-serif;
            color: #098ba7;
            text-shadow: none;
            flex: 1;
            font-weight: normal;
            padding-left: 40px;
            @media only screen and (max-width: 600px) {
              padding-left: 0px;
              > ul {
                padding-left: 20px;
              }
            }
          `}
        >
          <h1
            ${css`
              font-weight: normal;
            `}
          >
            <nth-logo ${prop('showFullName', true)}></nth-logo>
            is a JavaScript framework with a focus on:
          </h1>
          <ul
            ${css`
              margin: 0;
              padding: 0;
              > li {
                margin-top: 10px;
              }
            `}
          >
            <li>
              <b>using modern platform features such as:</b>
              <ul
                ${css`
                  margin: 0;
                `}
              >
                <li>web components</li>
                <li>proxies for change tracking</li>
                <li>generators</li>
                <li>
                  es module: You don't have to use a bundler, if you don't need
                  to.
                </li>
              </ul>
            </li>
            <li>
              <b>'treeshakability'</b>: you decide how much or how little of the
              framework you want to load/bundle.
            </li>

            <li>
              <b>'composability'</b>: the architecture is functional and thus
              highly composable.
            </li>
            <p
              ${css`
                font-size: 0.9em;
                font-style: italic;
              `}
            >
              Obviously, this means that you will need to compile down for older
              browser versions and/or provide polyfills if you have to to
              support them.
            </p>
          </ul>
        </div>
      </div>
    `,
  };
});
