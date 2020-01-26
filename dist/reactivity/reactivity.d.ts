export declare function proxify(obj: any, onChange: () => void, hooks?: {
    set?: (obj: any, prop: string | number | symbol, value: any) => any;
    get?: (obj: any, prop: string | number | symbol) => void;
}): any;
export declare type State<S extends {} = {}> = S & {
    on: (listener: (value: S) => void) => () => void;
    merge: (otherState: State<Partial<S>>) => void;
};
export declare const $state: <S extends {} = {}>(initialState?: Partial<S>) => State<S>;
