import {
  html,
  component,
  getElement,
  sideEffect,
  $attr,
  attr,
  clss,
  frag,
  $prop,
} from '../../src';
import * as Prism from 'prismjs';
import SimpleBar from 'simplebar';

function filterInitialEmptyLines(parts: string[]): string[] {
  let found = false;
  return parts.filter(p => {
    if (!found) {
      if (p.trim().length === 0) {
        return false;
      }
    }
    found = true;
    return true;
  });
}
function decodeEntities(encodedString) {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>',
  };
  return encodedString
    .replace(translate_re, function(match, entity) {
      return translate[entity];
    })
    .replace(/&#(\d+);/gi, function(match, numStr) {
      var num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
}
component('nth-highlight', () => {
  const $language = $attr('language', 'javascript');
  const element = getElement();
  const $code = $prop('code', '');
  const $style = $attr('style', '');
  sideEffect(
    () => {
      element.shadowRoot.appendChild(
        document.querySelector('#prismstyle').cloneNode(true)
      );
      element.shadowRoot.appendChild(
        document.querySelector('#prismtheme').cloneNode(true)
      );
      element.shadowRoot.appendChild(
        document.querySelector('#simplebar').cloneNode(true)
      );
      new SimpleBar(element.shadowRoot.querySelector('pre'));
    },
    () => []
  );
  const text = decodeEntities($code.value);
  let shortestSpaces = '';
  let parts = text.split(/\n/g);
  parts = filterInitialEmptyLines(parts);
  parts = filterInitialEmptyLines(parts.reverse()).reverse();
  const modifiedText = parts
    .map(p => {
      let spaces = p.toLowerCase().split(/\S+/g)[0];
      if (
        spaces[0] === ' ' &&
        (!shortestSpaces || spaces.length < shortestSpaces.length)
      ) {
        shortestSpaces = spaces;
      }
      return p;
    })
    .map(p => p.replace(shortestSpaces, ''))
    .join('\n');
  return {
    watch: [$style],
    render: () => {
      return html`
        <code ${clss(`language-${$language.value}`)}>
          <pre ${attr('style', $style.value)}>
${frag(
              Prism.highlight(
                modifiedText,
                Prism.languages.javascript,
                $language.value
              )
            )}</pre
          >
        </code>
      `;
    },
  };
});
