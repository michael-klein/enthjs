import {
  component,
  html,
  createContext,
  $state,
  $attr,
  sub,
  clss,
  attr,
  $prop,
  sideEffect,
  getElement,
  frag,
} from '../../../src/enthjs';
import { getCss } from '../utils';

export interface Route {
  template: HTMLElement;
  path: string;
}
const routerContext = createContext<{
  currentPath: string;
}>('router', { currentPath: '' });

component('nth-router', () => {
  const $context = routerContext.provide({ currentPath: '' });
  const $hash = $state({ value: window.location.hash });
  window.addEventListener(
    'hashchange',
    () => {
      $hash.value = window.location.hash;
    },
    false
  );
  const handleHash = () => {
    $context.currentPath = $hash.value.slice(1) || '/';
  };
  $hash.on(handleHash);
  handleHash();
  return {
    render: () =>
      html`
        <slot></slot>
      `,
  };
});

component('nth-route', () => {
  const $context = routerContext.get();
  const $path = $attr('path');
  const $title = $attr('title');
  const template = getElement().querySelector('template');
  sideEffect(
    () => {
      if ($context.currentPath === $path.value) document.title = $title.value;
    },
    () => [$context.currentPath]
  );
  return {
    watch: [$context, $path, $title],
    render: () =>
      html`
        ${frag($context.currentPath === $path.value ? template.innerHTML : '')}
      `,
  };
});

component('nth-link', () => {
  const $path = $attr('path');
  const css = getCss();
  const $css = $prop('css', (c: typeof css) => css``);
  const $classes = $state({ value: $css.value(css) });
  const $context = routerContext.get();
  sideEffect(
    () => {
      $classes.value = $css.value(css);
    },
    () => [$css, $context]
  );
  return {
    watch: [$context, $path, $classes, $css],
    render: () =>
      html`
        <a
          ${attr('href', '#' + $path.value)}
          ${$classes.value}
          ${clss($context.currentPath === $path.value ? 'active' : '')}
          ><slot></slot
        ></a>
      `,
  };
});
