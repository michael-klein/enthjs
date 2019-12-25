const IS_PROXY = Symbol('$P');
function proxify(obj: any, onChange: () => void): any {
  let initialized = false;
  let onChangeWrapped = () => {
    if (initialized) {
      onChange();
    }
  };
  const proxy = new Proxy(obj as any, {
    set: (obj, prop, value) => {
      if (
        (obj[prop] !== value || !initialized) &&
        prop !== '__$p' &&
        prop !== 'on'
      ) {
        if (typeof value === 'object') {
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
  proxy.__$p = IS_PROXY;
  initialized = true;
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
