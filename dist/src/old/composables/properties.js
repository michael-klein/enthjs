import { getElement } from "./element.js";
import { $state } from "../reactivity.js";
export const $prop = (name, initialValue) => {
    const element = getElement();
    const state = $state({ value: element[name] || initialValue });
    Object.defineProperty(element, name, {
        get: () => state.value,
        set: (value) => {
            state.value = value;
        },
    });
    return state;
};
//# sourceMappingURL=properties.js.map