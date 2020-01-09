import { HTMLResult } from './html';
import { render } from './render';
import { schedule, PriorityLevel } from './scheduler';
import { setUpContext } from './composables/element';
import { runSideEffects } from './composables/sideeffects';
import { State } from './reactivity';

export interface ComponentDefinition {
  render: () => HTMLResult;
  watch?: State<{}>[];
}
export type Setup = () => ComponentDefinition;
export const component = (name: string, setup: Setup) => {
  customElements.define(
    name,
    class extends HTMLElement {
      private renderQueued: boolean = false;
      private nextRenderQueued: boolean = false;
      private render: () => HTMLResult;
      private watch: State<{}>[] = [];
      private watchOff: (() => void)[];
      private init = true;
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        setUpContext(this, () => {
          const result = setup();
          this.render = result.render;
          this.watch = result.watch;
        });
      }

      private wasConnected: boolean = false;
      public connectedCallback() {
        if (this.isConnected && !this.wasConnected) {
          this.wasConnected = true;
          this.performRender();
          if (this.watch) {
            this.watchOff = this.watch.map(s =>
              s.on(() => {
                this.performRender();
              })
            );
          }
        }
      }

      public disconnectedCallback() {
        if (this.wasConnected) {
          this.wasConnected = false;
          if (this.watchOff) {
            this.watchOff.forEach(s => s());
            this.watchOff = undefined;
          }
        }
      }

      private performRender() {
        if (!this.renderQueued) {
          this.renderQueued = true;
          schedule(
            () => {
              this.init = false;
              render(this.shadowRoot as any, this.render());
            },
            this.init ? PriorityLevel.IMMEDIATE : undefined
          )
            .then(async () => await runSideEffects(this))
            .then(() => {
              this.renderQueued = false;
              if (this.nextRenderQueued) {
                this.nextRenderQueued = false;
                this.performRender();
              }
            });
        } else {
          this.nextRenderQueued = true;
        }
      }
    }
  );
};
