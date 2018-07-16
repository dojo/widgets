import { Handle } from '../core/interfaces';
import { CoreProperties, DNode, WidgetMetaBase, WidgetMetaConstructor, WidgetBaseInterface, WidgetProperties } from './interfaces';
import RegistryHandler from './RegistryHandler';
export declare type BoundFunctionData = {
    boundFunc: (...args: any[]) => any;
    scope: any;
};
export declare const noBind: symbol;
/**
 * Main widget base for all widgets to extend
 */
export declare class WidgetBase<P = WidgetProperties, C extends DNode = DNode> implements WidgetBaseInterface<P, C> {
    /**
     * static identifier
     */
    static _type: symbol;
    /**
     * children array
     */
    private _children;
    /**
     * Indicates if it is the initial set properties cycle
     */
    private _initialProperties;
    /**
     * internal widget properties
     */
    private _properties;
    /**
     * Array of property keys considered changed from the previous set properties
     */
    private _changedPropertyKeys;
    /**
     * map of decorators that are applied to this widget
     */
    private _decoratorCache;
    private _registry;
    /**
     * Map of functions properties for the bound function
     */
    private _bindFunctionPropertyMap;
    private _metaMap;
    private _boundRenderFunc;
    private _boundInvalidate;
    private _nodeHandler;
    private _handles;
    /**
     * @constructor
     */
    constructor();
    protected meta<T extends WidgetMetaBase>(MetaType: WidgetMetaConstructor<T>): T;
    protected onAttach(): void;
    protected onDetach(): void;
    readonly properties: Readonly<P> & Readonly<WidgetProperties>;
    readonly changedPropertyKeys: string[];
    __setCoreProperties__(coreProperties: CoreProperties): void;
    __setProperties__(originalProperties: this['properties']): void;
    readonly children: (C | null)[];
    __setChildren__(children: (C | null)[]): void;
    __render__(): DNode | DNode[];
    invalidate(): void;
    protected render(): DNode | DNode[];
    /**
     * Function to add decorators to WidgetBase
     *
     * @param decoratorKey The key of the decorator
     * @param value The value of the decorator
     */
    protected addDecorator(decoratorKey: string, value: any): void;
    /**
     * Function to build the list of decorators from the global decorator map.
     *
     * @param decoratorKey  The key of the decorator
     * @return An array of decorator values
     * @private
     */
    private _buildDecoratorList(decoratorKey);
    /**
     * Function to retrieve decorator values
     *
     * @param decoratorKey The key of the decorator
     * @returns An array of decorator values
     */
    protected getDecorator(decoratorKey: string): any[];
    /**
     * Binds unbound property functions to the specified `bind` property
     *
     * @param properties properties to check for functions
     */
    private _bindFunctionProperty(property, bind);
    readonly registry: RegistryHandler;
    private _runBeforeProperties(properties);
    /**
     * Run all registered before renders and return the updated render method
     */
    private _runBeforeRenders();
    /**
     * Run all registered after renders and return the decorated DNodes
     *
     * @param dNode The DNodes to run through the after renders
     */
    protected runAfterRenders(dNode: DNode | DNode[]): DNode | DNode[];
    private _runAfterConstructors();
    protected own(handle: Handle): void;
    protected destroy(): void;
}
export default WidgetBase;
