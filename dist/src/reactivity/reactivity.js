const isProxyMap = new WeakSet();
export function proxify(obj, onChange, hooks = {}) {
    let initialized = false;
    let onChangeWrapped = () => {
        if (initialized) {
            onChange();
        }
    };
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !isProxyMap.has(obj[key])) {
            obj[key] = proxify(obj[key], onChange);
        }
    });
    const proxy = new Proxy(obj, {
        get: (obj, prop) => {
            if (hooks.get) {
                hooks.get(obj, prop);
            }
            return obj[prop];
        },
        set: (obj, prop, value) => {
            if (hooks.set) {
                value = hooks.set(obj, prop, value);
            }
            if ((obj[prop] !== value || !initialized) &&
                prop !== '__$p' &&
                prop !== 'on') {
                if (typeof value === 'object' && !isProxyMap.has(obj[prop])) {
                    value = proxify(value, onChangeWrapped);
                }
                obj[prop] = value;
                onChangeWrapped();
            }
            else if (prop === 'on') {
                obj[prop] = value;
            }
            return true;
        },
    });
    isProxyMap.add(proxy);
    initialized = true;
    return proxy;
}
export const $state = (initialState = {}) => {
    let listeners = [];
    let canEmit = true;
    const proxy = proxify(initialState, () => {
        if (canEmit) {
            listeners.forEach(l => l(proxy));
        }
    });
    proxy.on = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > 1) {
                listeners.splice(index, 1);
            }
        };
    };
    proxy.merge = (otherState) => {
        const performMerge = (value) => {
            Object.keys(value).forEach(key => {
                if (!['on', 'merge'].includes(key)) {
                    proxy[key] = value[key];
                }
            });
        };
        otherState.on(value => {
            performMerge(value);
        });
        canEmit = false;
        performMerge(otherState);
        canEmit = true;
    };
    return proxy;
};
//# sourceMappingURL=reactivity.js.map