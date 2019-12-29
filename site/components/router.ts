import {
  component,
  html,
  createContext,
  $state,
  sideEffect,
  $attr,
  sub,
} from '../../src';

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

  return {
    watch: [$context, $path],
    render: () =>
      html`
        ${sub(
          $context.currentPath === $path.value
            ? html`
                <slot></slot>
              `
            : html``
        )}
      `,
  };
});
