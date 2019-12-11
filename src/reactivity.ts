const IS_PROXY = Symbol('$P');
function proxify(obj: any, onChange: () => void): any {
  const proxy = new Proxy(obj, {
    get: (obj, prop) => {
      if (
        obj[prop] &&
        typeof obj[prop] === 'object' &&
        obj[prop].__$p !== IS_PROXY
      ) {
        obj[prop] = proxify(obj[prop], onChange);
      }
      return obj[prop];
    },
    set: (obj, prop, value) => {
      if (obj[prop] !== value && prop !== '__$p') {
        obj[prop] = value;
        onChange();
      }
      return true;
    },
  });
  proxy.__$p = IS_PROXY;
  return proxy;
}
let onStateChanged: () => void;
export const setUpState = <CB extends () => any>(
  cb: CB,
  onChange: () => void
): ReturnType<CB> => {
  onStateChanged = onChange;
  let result = cb();
  onStateChanged = undefined;
  return result;
};
export const $state = <S extends {} = {}>(initialState: Partial<S> = {}): S => {
  let onChange = onStateChanged;
  return proxify(initialState, () => onChange && onChange());
};
