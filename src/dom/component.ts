import { HTMLResult } from './html';
import { State, $state, proxify } from '../reactivity/reactivity';
import { render } from './render';
import { schedule, PriorityLevel } from '../scheduler/scheduler';

export type ComponentGenerator = Generator<() => HTMLResult>;
export type ComponentGeneratorFactory<StateType extends {}> = (
  state: State<StateType>
) => ComponentGenerator;

export type ConnectedListener = () => void | (() => void);

const COMPONENT_CONTEXT = Symbol.for('component_context');
interface SideEffect {
  cb: ConnectedListener;
  cleanUp?: () => void;
  deps: () => any[];
  prevDeps?: any[];
  canRun?: boolean;
}
interface ComponentContext {
  connectedListeners: ConnectedListener[];
  sideEffects: SideEffect[];
}
function getContext(): ComponentContext {
  if (window[COMPONENT_CONTEXT]) {
    return window[COMPONENT_CONTEXT];
  }
  return undefined;
}
export function sideEffect(cb: ConnectedListener, deps?: () => any[]): void {
  const context = getContext();
  if (context) {
    context.sideEffects.push({ cb, deps });
  }
}
export function connected(cb: ConnectedListener): void {
  const context = getContext();
  if (context) {
    context.connectedListeners.push(cb);
  }
}
declare global {
  interface Window {
    [COMPONENT_CONTEXT]: ComponentContext;
  }
}

const observerMap: WeakMap<HTMLElement, MutationObserver> = new WeakMap();

const addObserver = (
  element: HTMLElement,
  onChange: (name: string, value: string) => void
): void => {
  if (!observerMap.has(element)) {
    const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          onChange(
            mutation.attributeName,
            element.getAttribute(mutation.attributeName)
          );
        }
      }
    });
    observerMap.set(element, observer);
  }
};

const startObserving = (element: HTMLElement) => {
  if (observerMap.has(element)) {
    observerMap.get(element).observe(element, { attributes: true });
  }
};

const stopObserving = (element: HTMLElement) => {
  if (observerMap.has(element)) {
    observerMap.get(element).disconnect();
  }
};

function createPropertyProxy(element: any, queueRender: () => void) {
  const accessedProps: string[] = [];
  const $properties = proxify({}, () => {}, {
    set: (obj, prop: any, value) => {
      if (obj[prop] !== value && accessedProps.includes(prop)) {
        queueRender();
      }
      return value;
    },
    get: (obj, prop: any) => {
      if (!obj[prop]) {
        obj[prop] = element[prop] || undefined;
      }
      if (!accessedProps.includes(prop)) {
        accessedProps.push(prop);
        Object.defineProperty(element, prop, {
          get: () => obj[prop],
          set: (value: any) => {
            if (obj[prop] !== value) {
              obj[prop] = value;
              queueRender();
            }
          },
        });
      }
    },
  });
  return $properties;
}

function createAttributeProxy(element: HTMLElement, queueRender: () => void) {
  const accessedAttributes: string[] = [];
  const $attributes = proxify({}, () => {}, {
    set: (obj, prop, value) => {
      if (obj[prop] !== value) {
        schedule(() => {
          element.setAttribute(prop as string, value);
        });
        queueRender();
      }
      return value;
    },
    get: (obj, prop: any) => {
      if (!obj[prop]) {
        obj[prop] = element.getAttribute(prop) || undefined;
      }
      if (!accessedAttributes.includes(prop)) {
        accessedAttributes.push(prop);
      }
      return obj[prop];
    },
  });
  addObserver(element, (name, value) => {
    if (accessedAttributes.includes(name)) {
      $attributes[name] = value;
    }
  });
  return $attributes;
}

export function component<
  StateValueType extends {} = { [key: string]: any },
  StateType extends StateValueType & {
    attributes: { [key: string]: string };
    properties: { [key: string]: any };
  } = StateValueType & {
    attributes: { [key: string]: string };
    properties: { [key: string]: any };
  },
  S extends State<StateType> = State<StateType>
>(name: string, factory: ComponentGeneratorFactory<StateType>): void {
  customElements.define(
    name,
    class extends HTMLElement {
      private disconnectedListeners: (() => void)[] = [];
      private generator: ComponentGenerator;
      private context: ComponentContext = {
        connectedListeners: [],
        sideEffects: [],
      };
      private $s: S;
      private stopRenderLoop: () => void;
      private connected: boolean = false;
      private renderPromise: Promise<void>;

      constructor() {
        super();
        window[COMPONENT_CONTEXT] = this.context;
        this.attachShadow({ mode: 'open' });
        this.$s = $state<S>({
          attributes: createAttributeProxy(this, () => this.queueRender()),
          properties: createPropertyProxy(this, () => this.queueRender()),
        } as Partial<S>);
        this.generator = factory(this.$s);
      }

      private canRunSideEffect(sideEffect: SideEffect): boolean {
        sideEffect.canRun =
          sideEffect.canRun || !sideEffect.deps || !sideEffect.prevDeps;
        if (!sideEffect.canRun) {
          const deps = sideEffect.deps();
          if (sideEffect.prevDeps) {
            if (
              deps.findIndex((dep, key) => sideEffect.prevDeps[key] !== dep) >
              -1
            ) {
              sideEffect.canRun = true;
            }
          } else {
            sideEffect.canRun = true;
          }
          sideEffect.prevDeps = deps;
        } else {
          if (sideEffect.deps) {
            sideEffect.prevDeps = sideEffect.deps();
          }
        }
        return sideEffect.canRun;
      }

      private async runSideEffects(): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const sideEffect of this.context.sideEffects) {
          if (this.canRunSideEffect(sideEffect)) {
            sideEffect.canRun = undefined;
            promises.push(
              new Promise(async resolve => {
                await schedule(() => {
                  sideEffect.cleanUp = sideEffect.cb() as () => void;
                }, PriorityLevel.LOW);
                resolve();
              })
            );
          }
        }
        await Promise.all(promises);
      }

      private async runCleanUps(force: boolean = false): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const sideEffect of this.context.sideEffects) {
          if (this.canRunSideEffect(sideEffect) || force) {
            if (sideEffect.cleanUp) {
              promises.push(
                new Promise(async resolve => {
                  await schedule(() => {
                    sideEffect.cleanUp();
                    sideEffect.cleanUp = undefined;
                  }, PriorityLevel.LOW);
                  resolve();
                })
              );
            }
          }
        }
        await Promise.all(promises);
      }

      private nextQueued = false;
      private async queueRender(): Promise<void> {
        if (!this.renderPromise) {
          const value = this.generator.next().value;
          window[COMPONENT_CONTEXT] = undefined;
          if (value) {
            this.renderPromise = new Promise(async resolve => {
              await this.runCleanUps();
              await render(this.shadowRoot, value());
              await this.runSideEffects();
              this.renderPromise = undefined;
              if (this.nextQueued) {
                this.nextQueued = false;
                this.queueRender();
              }
              resolve();
            });
          }
        } else {
          this.nextQueued = true;
        }
      }

      public connectedCallback(): void {
        if (!this.connected) {
          this.queueRender();
          this.stopRenderLoop = this.$s.on(() => {
            this.queueRender();
          });
          startObserving(this);
        }
        this.disconnectedListeners = this.context.connectedListeners
          .map(cb => cb())
          .filter(l => l) as (() => void)[];
      }

      public async disconnectedCallback(): Promise<void> {
        if (this.connected) {
          stopObserving(this);
          if (this.stopRenderLoop) {
            this.stopRenderLoop();
          }
          this.connected = false;
          this.disconnectedListeners.forEach(cb => cb());
          this.disconnectedListeners = [];
          await this.renderPromise;
          this.runCleanUps(true);
          this.context.sideEffects.forEach(sideEffect => {
            sideEffect.prevDeps = undefined;
          });
        }
      }
    }
  );
}
