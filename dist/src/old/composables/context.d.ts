import { State } from '../reactivity';
export interface ContextAPI<Context extends {}> {
    provide: (value: Context) => State<Context>;
    get: () => State<Context>;
}
export declare function createContext<Context extends {}>(name: string, defaulValue: Context): ContextAPI<Context>;
