import { Evented } from '../core/Evented';
import { EventObject } from '../core/interfaces';
import { Constructor, InjectorFactory, InjectorItem, RegistryLabel, WidgetBaseInterface } from './interfaces';
import { Registry, RegistryItem } from './Registry';
export declare type RegistryHandlerEventMap = {
    invalidate: EventObject<'invalidate'>;
};
export declare class RegistryHandler extends Evented<RegistryHandlerEventMap> {
    private _registry;
    private _registryWidgetLabelMap;
    private _registryInjectorLabelMap;
    protected baseRegistry?: Registry;
    constructor();
    base: Registry;
    define(label: RegistryLabel, widget: RegistryItem): void;
    defineInjector(label: RegistryLabel, injector: InjectorFactory): void;
    has(label: RegistryLabel): boolean;
    hasInjector(label: RegistryLabel): boolean;
    get<T extends WidgetBaseInterface = WidgetBaseInterface>(label: RegistryLabel, globalPrecedence?: boolean): Constructor<T> | null;
    getInjector<T>(label: RegistryLabel, globalPrecedence?: boolean): InjectorItem<T> | null;
    private _get(label, globalPrecedence, getFunctionName, labelMap);
}
export default RegistryHandler;
