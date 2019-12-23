const IS_PROXY = Symbol('$P');
function proxify(obj: any, onChange: () => void): any {
  const proxy = new Proxy(obj, {
    get: (obj, prop) => {
      if (
        obj[prop] &&
        typeof obj[prop] === 'object' &&
        obj[prop].__$p !== IS_PROXY &&
        prop !== 'on'
      ) {
        obj[prop] = proxify(obj[prop], onChange);
      }
      return obj[prop];
    },
    set: (obj, prop, value) => {
      if (obj[prop] !== value && prop !== '__$p' && prop !== 'on') {
        obj[prop] = value;
        onChange();
      } else if (prop === 'on') {
        obj[prop] = value;
      }
      return true;
    },
  });
  proxy.__$p = IS_PROXY;
  return proxy;
}
export type State<S extends {} = {}> = S & {
  on: (listener: () => void) => () => void;
};

export const $state = <S extends {} = {}>(
  initialState: Partial<S> = {}
): State<S> => {
  const proxy = proxify(initialState, () => {
    listeners.forEach(l => l());
  });
  let listeners: (() => void)[] = [];
  proxy.on = (listener: () => void): (() => void) => {
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
