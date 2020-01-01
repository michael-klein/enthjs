import { $state } from "../reactivity.js";
import { getElement } from "./element.js";
const contextMap = new WeakMap();
export function createContext(name, defaulValue) {
    const $defaultContext = $state(defaulValue);
    return {
        provide: (value) => {
            contextMap.set(getElement(), {
                ...(contextMap.get(getElement()) || {}),
                [name]: $state(value),
            });
            return contextMap.get(getElement())[name];
        },
        get: () => {
            const element = getElement();
            let parent = element;
            while ((parent = parent.parentNode || parent.host) &&
                parent !== document.body) {
                const $context = contextMap.has(parent) && contextMap.get(parent)[name];
                if ($context) {
                    return $context;
                }
            }
            return $defaultContext;
        },
    };
}
//# sourceMappingURL=context.js.map