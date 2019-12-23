export declare const setUpState: <CB extends () => any>(cb: CB, onChange: () => void) => ReturnType<CB>;
export declare const $state: <S extends {} = {}>(initialState?: Partial<S>) => S;
