import { setUpState } from "./reactivity.js";
import { render } from "./render.js";
import { schedule, PriorityLevel } from "./scheduler.js";
import { setUpContext } from "./context.js";
import { runSideEffects } from "./sideeffects.js";
export const component = (name, setup) => {
    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            this.renderQueued = false;
            this.nextRenderQueued = false;
            this.attachShadow({ mode: 'open' });
            setUpContext(this, () => setUpState(() => (this.render = setup().render), () => {
                this.performRender();
            }));
            this.performRender();
        }
        performRender() {
            if (!this.renderQueued) {
                this.renderQueued = true;
                schedule(() => {
                    render(this.shadowRoot, this.render());
                }, PriorityLevel.USER_BLOCKING)
                    .then(async () => await runSideEffects(this))
                    .then(() => {
                    this.renderQueued = false;
                    if (this.nextRenderQueued) {
                        this.nextRenderQueued = false;
                        this.performRender();
                    }
                });
            }
            else {
                this.nextRenderQueued = true;
            }
        }
    });
};
//# sourceMappingURL=component.js.map