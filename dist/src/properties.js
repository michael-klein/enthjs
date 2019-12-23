import { getElement } from "./context.js";
import { $state } from "./reactivity.js";
export const $prop = (name, initialValue) => {
    const element = getElement();
    const state = $state({ value: initialValue });
    Object.defineProperty(element, name, {
        get: () => state.value,
        set: (value) => {
            state.value = value;
        },
    });
    return state;
};
//# sourceMappingURL=properties.js.map