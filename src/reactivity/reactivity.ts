const isProxyMap: WeakSet<object> = new WeakSet();
export function proxify (
  obj: any,
  onChange: () => void,
  hooks: {
    set?: (obj: any, prop: string | number | symbol, value: any) => any;
    get?: (obj: any, prop: string | number | symbol) => void;
  } = {}
): any {
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
  const proxy = new Proxy(obj as any, {
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
      if (typeof value === 'object' && !isProxyMap.has(value)) {
        value = proxify(value, onChangeWrapped);
      }
      if (
        (obj[prop] !== value || !initialized) &&
        prop !== '__$p' &&
        prop !== 'on'
      ) {
        obj[prop] = value;
        onChangeWrapped();
      }
      obj[prop] = value;
      return true;
    },
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
  let canEmit = true;
  const proxy = proxify(initialState, () => {
    if (canEmit) {
      listeners.forEach(l => l(proxy));
    }
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
    const performMerge = (value: Partial<S>) => {
      Object.keys(value).forEach(key => {
        if (!['on', 'merge'].includes(key)) {
          proxy[key] = (value as any)[key];
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
