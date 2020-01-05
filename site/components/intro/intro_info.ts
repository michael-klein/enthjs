import {
  html,
  $state,
  sideEffect,
  component,
  sub,
  attr,
  prop,
  getElement,
  list,
  key,
  text,
} from '../../../src';
import { getCss } from '../../utils.ts';
import { computerAnimation } from '../animations/computer_animation';
import { getIsInView } from '../../utils';

component('nth-intro-section-info', () => {
  const css = getCss();
  const $isInView = getIsInView();

  function renderAnimation() {
    return html`
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
          opacity: ${$isInView.value ? '1' : '0'};
          transition: opacity 1s;
        `}
      >
        <div
          ${css`
            width: 130%;
            margin-left: -15%;
          `}
        >
          <nth-lottie ${prop('animationData', computerAnimation)}> </nth-lottie>
        </div>
      </div>
    `;
  }

  function renderInfoTable(items: { title: string; text: string[] }[]) {
    return html`
      <ul
        ${css`
          margin: 0;
          padding: 0;
          > li {
            margin-top: 10px;
          }
          opacity: ${$isInView.value ? '1' : '0'};
          transition: opacity 1s;
          transition-delay: 1s;
        `}
      >
        ${list(
          items.map(
            item => html`
              <li ${key(item.text + item.title)}>
                <b>${text(item.title)}</b>
                ${list(
                  item.text.map(
                    t =>
                      html`
                        ${text(t)}<br />
                      `
                  )
                )}
              </li>
            `
          )
        )}
      </ul>
    `;
  }

  function renderInfo() {
    return html`
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
            opacity: ${$isInView.value ? '1' : '0'};
            transition: opacity 1s;
            transition-delay: 0.5s;
          `}
        >
          <nth-logo ${prop('showFullName', true)}></nth-logo>
          is a JavaScript framework with a focus on:
        </h1>
        ${sub(
          renderInfoTable([
            {
              title: 'using modern platform features such as:',
              text: [
                'web components',
                'proxies for change tracking',
                'generators',
                "es module: You don't have to use a bundler, if you don't need to.",
              ],
            },
            {
              title: 'treeshakability:',
              text: [
                'you decide how much or how little of the framework you want to load/bundle.',
              ],
            },
            {
              title: 'composability:',
              text: [
                'the architecture is functional and thus highly composable.',
              ],
            },
          ])
        )}
        <p
          ${css`
            font-size: 0.9em;
            font-style: italic;
            margin-top: 1em;
            opacity: ${$isInView.value ? '1' : '0'};
            transition: opacity 1s;
            transition-delay: 1.5s;
          `}
        >
          Obviously, this means that you will need to compile down for older
          browser versions and/or provide polyfills if you have to to support
          them.
        </p>
      </div>
    `;
  }

  return {
    watch: [$isInView],
    render: () => html`
      <nth-container>
        <div
          ${css`
            display: flex;
            margin-top: 100px;
            @media only screen and (max-width: 600px) {
              display: block;
            }
          `}
        >
          ${sub(renderAnimation())} ${sub(renderInfo())}
        </div></nth-container
      >
    `,
  };
});
