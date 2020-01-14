import { $state, proxify } from "../reactivity/reactivity.js";
import { render } from "./render.js";
import { schedule, PriorityLevel } from "../scheduler/scheduler.js";
const COMPONENT_CONTEXT = Symbol.for('component_context');
function getContext() {
    if (window[COMPONENT_CONTEXT]) {
        return window[COMPONENT_CONTEXT];
    }
    return undefined;
}
export function sideEffect(cb, deps) {
    const context = getContext();
    if (context) {
        context.sideEffects.push({ cb, deps });
    }
}
export function connected(cb) {
    const context = getContext();
    if (context) {
        context.connectedListeners.push(cb);
    }
}
const observerMap = new WeakMap();
const addObserver = (element, onChange) => {
    if (!observerMap.has(element)) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    onChange(mutation.attributeName, element.getAttribute(mutation.attributeName));
                }
            }
        });
        observerMap.set(element, observer);
    }
};
const startObserving = (element) => {
    if (observerMap.has(element)) {
        observerMap.get(element).observe(element, { attributes: true });
    }
};
const stopObserving = (element) => {
    if (observerMap.has(element)) {
        observerMap.get(element).disconnect();
    }
};
function createPropertyProxy(element, queueRender) {
    const accessedProps = [];
    const $properties = proxify({}, () => { }, {
        set: (obj, prop, value) => {
            if (obj[prop] !== value && accessedProps.includes(prop)) {
                queueRender();
            }
            return value;
        },
        get: (obj, prop) => {
            if (!obj[prop]) {
                obj[prop] = element[prop] || undefined;
            }
            if (!accessedProps.includes(prop)) {
                accessedProps.push(prop);
                Object.defineProperty(element, prop, {
                    get: () => obj[prop],
                    set: (value) => {
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
function createAttributeProxy(element, queueRender) {
    const accessedAttributes = [];
    const $attributes = proxify({}, () => { }, {
        set: (obj, prop, value) => {
            if (obj[prop] !== value) {
                schedule(() => {
                    element.setAttribute(prop, value);
                });
                queueRender();
            }
            return value;
        },
        get: (obj, prop) => {
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
export function component(name, factory) {
    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            this.disconnectedListeners = [];
            this.context = {
                connectedListeners: [],
                sideEffects: [],
            };
            this.connected = false;
            this.nextQueued = false;
            window[COMPONENT_CONTEXT] = this.context;
            this.attachShadow({ mode: 'open' });
            this.$s = $state({
                attributes: createAttributeProxy(this, () => this.queueRender()),
                properties: createPropertyProxy(this, () => this.queueRender()),
            });
            this.generator = factory(this.$s);
        }
        canRunSideEffect(sideEffect) {
            sideEffect.canRun =
                sideEffect.canRun || !sideEffect.deps || !sideEffect.prevDeps;
            if (!sideEffect.canRun) {
                const deps = sideEffect.deps();
                if (sideEffect.prevDeps) {
                    if (deps.findIndex((dep, key) => sideEffect.prevDeps[key] !== dep) >
                        -1) {
                        sideEffect.canRun = true;
                    }
                }
                else {
                    sideEffect.canRun = true;
                }
                sideEffect.prevDeps = deps;
            }
            else {
                if (sideEffect.deps) {
                    sideEffect.prevDeps = sideEffect.deps();
                }
            }
            return sideEffect.canRun;
        }
        async runSideEffects() {
            const promises = [];
            for (const sideEffect of this.context.sideEffects) {
                if (this.canRunSideEffect(sideEffect)) {
                    sideEffect.canRun = undefined;
                    promises.push(new Promise(async (resolve) => {
                        await schedule(() => {
                            sideEffect.cleanUp = sideEffect.cb();
                        }, PriorityLevel.LOW);
                        resolve();
                    }));
                }
            }
            await Promise.all(promises);
        }
        async runCleanUps(force = false) {
            const promises = [];
            for (const sideEffect of this.context.sideEffects) {
                if (this.canRunSideEffect(sideEffect) || force) {
                    if (sideEffect.cleanUp) {
                        promises.push(new Promise(async (resolve) => {
                            await schedule(() => {
                                sideEffect.cleanUp();
                                sideEffect.cleanUp = undefined;
                            }, PriorityLevel.LOW);
                            resolve();
                        }));
                    }
                }
            }
            await Promise.all(promises);
        }
        async queueRender() {
            if (!this.renderPromise) {
                const value = this.generator.next().value;
                window[COMPONENT_CONTEXT] = undefined;
                if (value) {
                    this.renderPromise = new Promise(async (resolve) => {
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
            }
            else {
                this.nextQueued = true;
            }
        }
        connectedCallback() {
            if (!this.connected) {
                this.queueRender();
                this.stopRenderLoop = this.$s.on(() => {
                    this.queueRender();
                });
                startObserving(this);
            }
            this.disconnectedListeners = this.context.connectedListeners
                .map(cb => cb())
                .filter(l => l);
        }
        async disconnectedCallback() {
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
    });
}
//# sourceMappingURL=component.js.map