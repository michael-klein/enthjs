import { render } from "./render.js";
import { schedule, PriorityLevel } from "./scheduler.js";
import { setUpContext } from "./composables/element.js";
import { runSideEffects } from "./composables/sideeffects.js";
export const component = (name, setup) => {
    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            this.renderQueued = false;
            this.nextRenderQueued = false;
            this.watch = [];
            this.init = true;
            this.wasConnected = false;
            this.attachShadow({ mode: 'open' });
            setUpContext(this, () => {
                const result = setup();
                this.render = result.render;
                this.watch = result.watch;
            });
        }
        connectedCallback() {
            if (this.isConnected && !this.wasConnected) {
                this.wasConnected = true;
                this.performRender();
                if (this.watch) {
                    this.watchOff = this.watch.map(s => s.on(() => {
                        this.performRender();
                    }));
                }
            }
        }
        disconnectedCallback() {
            if (this.wasConnected) {
                this.wasConnected = false;
                if (this.watchOff) {
                    this.watchOff.forEach(s => s());
                    this.watchOff = undefined;
                }
            }
        }
        performRender() {
            if (!this.renderQueued) {
                this.renderQueued = true;
                schedule(() => {
                    this.init = false;
                    render(this.shadowRoot, this.render());
                }, this.init ? PriorityLevel.IMMEDIATE : undefined)
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