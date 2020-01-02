export declare type State<S extends {} = {}> = S & {
    on: (listener: () => void) => () => void;
};
export declare const $state: <S extends {} = {}>(initialState?: Partial<S>) => State<S>;
