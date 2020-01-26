import { getHost } from "./component.js";
export function createEvent(name, customEventInit = {
    bubbles: true,
    composed: true,
}) {
    const host = getHost();
    return (value) => host.dispatchEvent(new CustomEvent(name, {
        ...customEventInit,
        detail: value,
    }));
}
//# sourceMappingURL=create_event.js.map