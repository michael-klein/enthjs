import { HTMLResult } from './html';
import { State, $state } from '../reactivity/reactivity';
import { render } from './render';

export type ComponentGenerator = Generator<() => HTMLResult>;
export type ComponentGeneratorFactory<StateType extends {}> = (
  state: State<StateType>
) => ComponentGenerator;

export type ConnectedListener = () => void | (() => void);

const COMPONENT_CONTEXT = Symbol.for('component_context');

interface ComponentContext {
  connectedListeners: ConnectedListener[];
}
function getContext(): ComponentContext {
  if (window[COMPONENT_CONTEXT]) {
    return window[COMPONENT_CONTEXT];
  }
  return undefined;
}
export function connected(cb: ConnectedListener): void {
  const context = getContext();
  console.log(context);
  if (context) {
    context.connectedListeners.push(cb);
  }
}
declare global {
  interface Window {
    [COMPONENT_CONTEXT]: ComponentContext;
  }
}
export function component<
  StateType extends {},
  S extends State<StateType> = State<StateType>
>(name: string, factory: ComponentGeneratorFactory<StateType>): void {
  customElements.define(
    name,
    class extends HTMLElement {
      private disconnectedListeners: (() => void)[] = [];
      private context: ComponentContext = {
        connectedListeners: [],
      };

      constructor() {
        super();
        window[COMPONENT_CONTEXT] = this.context;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const $s: S = $state<S>({});
        const generator: ComponentGenerator = factory($s);

        let renderPromise: Promise<void>;
        let nextQueued = false;

        function performRender(): void {
          if (!renderPromise) {
            const value = generator.next().value;
            window[COMPONENT_CONTEXT] = undefined;
            if (value) {
              renderPromise = render(shadowRoot, value());
              renderPromise.then(() => {
                renderPromise = undefined;
                if (nextQueued) {
                  nextQueued = false;
                  performRender();
                }
              });
            }
          } else {
            nextQueued = true;
          }
        }
        performRender();
        $s.on(() => {
          performRender();
        });
      }

      public connectedCallback(): void {
        console.log(this.context);
        this.disconnectedListeners = this.context.connectedListeners
          .map(cb => cb())
          .filter(l => l) as (() => void)[];
      }

      public disconnectedCallback(): void {
        this.disconnectedListeners.forEach(cb => cb());
        this.disconnectedListeners = [];
      }
    }
  );
}
