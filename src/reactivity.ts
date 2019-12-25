const IS_PROXY = Symbol('$P');
function proxify(obj: any, onChange: () => void): any {
  const proxy = new Proxy(obj, {
    set: (obj, prop, value) => {
      if (obj[prop] !== value && prop !== '__$p' && prop !== 'on') {
        if (typeof obj[prop] === 'object') {
          obj[prop] = proxify(obj[prop], onChange);
        }
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
