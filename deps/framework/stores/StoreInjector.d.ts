import { WidgetBase } from '../widget-core/WidgetBase';
import { RegistryLabel, Constructor } from '../widget-core/interfaces';
import { Store } from './Store';
import { Registry } from '../../src/widget-core/Registry';
export interface GetProperties<S extends Store, W extends WidgetBase<any, any> = WidgetBase<any, any>> {
    (payload: S, properties: W['properties']): W['properties'];
}
export declare type StoreContainerPath<S, P0 extends keyof S = keyof S, P1 extends keyof S[P0] = keyof S[P0], P2 extends keyof S[P0][P1] = keyof S[P0][P1], P3 extends keyof S[P0][P1][P2] = keyof S[P0][P1][P2], P4 extends keyof S[P0][P1][P2][P3] = keyof S[P0][P1][P2][P3]> = [P0] | [P0, P1] | [P0, P1, P2] | [P0, P1, P2, P3] | [P0, P1, P2, P3, P4];
export interface StoreInjectConfig<S = any> {
    name: RegistryLabel;
    getProperties: GetProperties<Store<S>, any>;
    paths?: StoreContainerPath<S>[];
}
export declare type StoreContainer<T extends WidgetBase<any, any>> = Constructor<WidgetBase<Partial<T['properties']>, T['children'][0]>>;
/**
 * Decorator that registers a store injector with a container based on paths when provided
 *
 * @param config Configuration of the store injector
 */
export declare function storeInject<S>(config: StoreInjectConfig<S>): (target: any, propertyKey?: string | undefined, descriptor?: PropertyDescriptor | undefined) => void;
export declare function StoreContainer<S = any, W extends WidgetBase<any, any> = WidgetBase<any, any>>(component: Constructor<W> | RegistryLabel, name: RegistryLabel, {paths, getProperties}: {
    paths?: StoreContainerPath<S>[];
    getProperties: GetProperties<Store<S>, W>;
}): StoreContainer<W>;
/**
 * Creates a typed `StoreContainer` for State generic.
 */
export declare function createStoreContainer<S>(): <W extends WidgetBase<any, any>>(component: string | symbol | Constructor<W>, name: string | symbol, {paths, getProperties}: {
    paths?: StoreContainerPath<S, keyof S, keyof S[keyof S], keyof S[keyof S][keyof S[keyof S]], keyof S[keyof S][keyof S[keyof S]][keyof S[keyof S][keyof S[keyof S]]], keyof S[keyof S][keyof S[keyof S]][keyof S[keyof S][keyof S[keyof S]]][keyof S[keyof S][keyof S[keyof S]][keyof S[keyof S][keyof S[keyof S]]]]>[] | undefined;
    getProperties: GetProperties<Store<S>, W>;
}) => Constructor<WidgetBase<Partial<W["properties"]>, W["children"][0]>>;
export interface StoreInjectorOptions {
    key?: RegistryLabel;
    registry?: Registry;
}
export declare function registerStoreInjector<T>(store: Store<T>, options?: StoreInjectorOptions): Registry;
