import { HTMLResult } from './html';
import { State, $state } from '../reactivity/reactivity';
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
export function component<
  StateType extends {},
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
        this.$s = $state<S>({});
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

      public connectedCallback(): void {
        if (!this.connected) {
          this.connected = true;
          let nextQueued = false;
          const performRender = () => {
            if (!this.renderPromise) {
              const value = this.generator.next().value;
              window[COMPONENT_CONTEXT] = undefined;
              if (value) {
                this.renderPromise = new Promise(async resolve => {
                  await this.runCleanUps();
                  await render(this.shadowRoot, value());
                  await this.runSideEffects();
                  this.renderPromise = undefined;
                  if (nextQueued) {
                    nextQueued = false;
                    performRender();
                  }
                  resolve();
                });
              }
            } else {
              nextQueued = true;
            }
          };
          performRender();
          this.stopRenderLoop = this.$s.on(() => {
            performRender();
          });
        }
        this.disconnectedListeners = this.context.connectedListeners
          .map(cb => cb())
          .filter(l => l) as (() => void)[];
      }

      public async disconnectedCallback(): Promise<void> {
        if (this.connected) {
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
