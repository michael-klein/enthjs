import { getHost } from "./component.js";
export function createEvent(name, value = undefined, customEventInit = {
    bubbles: true,
    composed: true,
}) {
    getHost().dispatchEvent(new CustomEvent(name, {
        ...customEventInit,
        detail: value,
    }));
}
//# sourceMappingURL=emit.js.map