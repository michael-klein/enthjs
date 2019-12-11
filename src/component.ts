import { HTMLResult } from './html';
import { setUpState } from './reactivity';
import { render } from './render';
import { schedule, PriorityLevel } from './scheduler';
import { setUpContext } from './context';
import { runSideEffects } from './sideeffects';
export interface ComponentDefinition {
  render: () => HTMLResult;
}
export type Setup = () => ComponentDefinition;
export const component = (name: string, setup: Setup) => {
  customElements.define(
    name,
    class extends HTMLElement {
      private renderQueued: boolean = false;
      private nextRenderQueued: boolean = false;
      private render: () => HTMLResult;
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        setUpContext(this, () =>
          setUpState(
            () => (this.render = setup().render),
            () => {
              this.performRender();
            }
          )
        );
        this.performRender();
      }

      private performRender() {
        if (!this.renderQueued) {
          this.renderQueued = true;
          schedule(() => {
            render(this.shadowRoot as any, this.render());
          }, PriorityLevel.USER_BLOCKING)
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
