const isProxyMap: WeakSet<object> = new WeakSet();
function proxify(obj: any, onChange: () => void): any {
  let initialized = false;
  let onChangeWrapped = () => {
    if (initialized) {
      onChange();
    }
  };
  const proxy = new Proxy(obj as any, {
    get: (obj, prop) => {
      if (
        obj[prop] &&
        typeof obj[prop] === 'object' &&
        !isProxyMap.has(obj[prop]) &&
        prop !== 'on' &&
        initialized
      ) {
        obj[prop] = proxify(obj[prop], onChange);
      }
      return obj[prop];
    },
    set: (obj, prop, value) => {
      if (
        (obj[prop] !== value || !initialized) &&
        prop !== '__$p' &&
        prop !== 'on'
      ) {
        if (typeof value === 'object' && !isProxyMap.has(obj[prop])) {
          value = proxify(value, onChangeWrapped);
        }
        obj[prop] = value;
        onChangeWrapped();
      } else if (prop === 'on') {
        obj[prop] = value;
      }
      return true;
    },
  });
  Object.keys(obj).forEach(key => {
    proxy[key] = obj[key];
  });
  isProxyMap.add(proxy);
  initialized = true;
  return proxy;
}
export type State<S extends {} = {}> = S & {
  on: (listener: (value: S) => void) => () => void;
  merge: (otherState: State<Partial<S>>) => void;
};

export const $state = <S extends {} = {}>(
  initialState: Partial<S> = {}
): State<S> => {
  let listeners: ((value: S) => void)[] = [];
  const proxy = proxify(initialState, () => {
    listeners.forEach(l => l(proxy));
  });
  proxy.on = (listener: (value: S) => void): (() => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > 1) {
        listeners.splice(index, 1);
      }
    };
  };
  proxy.merge = (otherState: State<Partial<S>>) => {
    otherState.on((value: Partial<S>) => {
      Object.keys(value).forEach(key => {
        proxy[key] = (value as any)[key];
      });
    });
  };
  return proxy;
};
