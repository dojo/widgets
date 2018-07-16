import { EventObject } from '../core/interfaces';
import { Evented } from '../core/Evented';
import { Constructor, InjectorFactory, InjectorItem, RegistryLabel, WidgetBaseConstructor, WidgetBaseInterface } from './interfaces';
export declare type WidgetBaseConstructorFunction = () => Promise<WidgetBaseConstructor>;
export declare type ESMDefaultWidgetBaseFunction = () => Promise<ESMDefaultWidgetBase<WidgetBaseInterface>>;
export declare type RegistryItem = WidgetBaseConstructor | Promise<WidgetBaseConstructor> | WidgetBaseConstructorFunction | ESMDefaultWidgetBaseFunction;
/**
 * Widget base symbol type
 */
export declare const WIDGET_BASE_TYPE: symbol;
export interface RegistryEventObject extends EventObject<RegistryLabel> {
    action: string;
    item: WidgetBaseConstructor | InjectorFactory;
}
/**
 * Widget Registry Interface
 */
export interface RegistryInterface {
    /**
     * Define a WidgetRegistryItem against a label
     *
     * @param label The label of the widget to register
     * @param registryItem The registry item to define
     */
    define(label: RegistryLabel, registryItem: RegistryItem): void;
    /**
     * Return a RegistryItem for the given label, null if an entry doesn't exist
     *
     * @param widgetLabel The label of the widget to return
     * @returns The RegistryItem for the widgetLabel, `null` if no entry exists
     */
    get<T extends WidgetBaseInterface = WidgetBaseInterface>(label: RegistryLabel): Constructor<T> | null;
    /**
     * Returns a boolean if an entry for the label exists
     *
     * @param widgetLabel The label to search for
     * @returns boolean indicating if a widget registry item exists
     */
    has(label: RegistryLabel): boolean;
    /**
     * Define an Injector against a label
     *
     * @param label The label of the injector to register
     * @param registryItem The injector factory
     */
    defineInjector(label: RegistryLabel, injectorFactory: InjectorFactory): void;
    /**
     * Return an Injector registry item for the given label, null if an entry doesn't exist
     *
     * @param label The label of the injector to return
     * @returns The RegistryItem for the widgetLabel, `null` if no entry exists
     */
    getInjector<T>(label: RegistryLabel): InjectorItem<T> | null;
    /**
     * Returns a boolean if an injector for the label exists
     *
     * @param widgetLabel The label to search for
     * @returns boolean indicating if a injector registry item exists
     */
    hasInjector(label: RegistryLabel): boolean;
}
/**
 * Checks is the item is a subclass of WidgetBase (or a WidgetBase)
 *
 * @param item the item to check
 * @returns true/false indicating if the item is a WidgetBaseConstructor
 */
export declare function isWidgetBaseConstructor<T extends WidgetBaseInterface>(item: any): item is Constructor<T>;
export interface ESMDefaultWidgetBase<T> {
    default: Constructor<T>;
    __esModule?: boolean;
}
export declare function isWidgetConstructorDefaultExport<T>(item: any): item is ESMDefaultWidgetBase<T>;
/**
 * The Registry implementation
 */
export declare class Registry extends Evented<{}, RegistryLabel, RegistryEventObject> implements RegistryInterface {
    /**
     * internal map of labels and RegistryItem
     */
    private _widgetRegistry;
    private _injectorRegistry;
    /**
     * Emit loaded event for registry label
     */
    private emitLoadedEvent(widgetLabel, item);
    define(label: RegistryLabel, item: RegistryItem): void;
    defineInjector(label: RegistryLabel, injectorFactory: InjectorFactory): void;
    get<T extends WidgetBaseInterface = WidgetBaseInterface>(label: RegistryLabel): Constructor<T> | null;
    getInjector<T>(label: RegistryLabel): InjectorItem<T> | null;
    has(label: RegistryLabel): boolean;
    hasInjector(label: RegistryLabel): boolean;
}
export default Registry;
