const IS_PROXY = Symbol('$P');
function proxify(obj, onChange) {
    const proxy = new Proxy(obj, {
        set: (obj, prop, value) => {
            if (obj[prop] !== value && prop !== '__$p' && prop !== 'on') {
                if (typeof obj[prop] === 'object') {
                    obj[prop] = proxify(obj[prop], onChange);
                }
                obj[prop] = value;
                onChange();
            }
            else if (prop === 'on') {
                obj[prop] = value;
            }
            return true;
        },
    });
    proxy.__$p = IS_PROXY;
    return proxy;
}
export const $state = (initialState = {}) => {
    const proxy = proxify(initialState, () => {
        listeners.forEach(l => l());
    });
    let listeners = [];
    proxy.on = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > 1) {
                listeners.splice(index, 1);
            }
        };
    };
    return proxy;
};
//# sourceMappingURL=reactivity.js.map