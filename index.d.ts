import { Context } from "react";
export declare var AppContext: Context<{}>;
interface GlobalStateReturnType {
    emit?: (event: string, cb: (st: any) => typeof st) => void;
    on?: (event: string, cb: (st: any) => any) => void;
    actions?: any;
}
export declare function useGlobalState(): GlobalStateReturnType;
export declare function useAppReducer<T>(state: T, optionalActions?: {}): {
    state: T;
    emit: (event: string, cb: (st: T) => T) => void;
    on: (event: string, cb: (st: T) => any) => void;
    actions: any;
};
export {};
