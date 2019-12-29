import { State, $state } from '../reactivity';
import { getElement } from './element';

const contextMap: WeakMap<Node, { [key: string]: State<any> }> = new WeakMap();

export interface ContextAPI<Context extends {}> {
  provide: (value: Context) => State<Context>;
  get: () => State<Context>;
}
export function createContext<Context extends {}>(
  name: string,
  defaulValue: Context
): ContextAPI<Context> {
  const $defaultContext = $state<Context>(defaulValue);
  return {
    provide: (value: Context) => {
      contextMap.set(getElement(), {
        ...(contextMap.get(getElement()) || {}),
        [name]: $state<Context>(value),
      });
      return contextMap.get(getElement())[name];
    },
    get: () => {
      const element = getElement();
      let parent: Node = element;
      while (
        (parent = parent.parentNode || (parent as any).host) &&
        parent !== document.body
      ) {
        const $context = contextMap.has(parent) && contextMap.get(parent)[name];
        if ($context) {
          return $context;
        }
      }
      return $defaultContext;
    },
  };
}
