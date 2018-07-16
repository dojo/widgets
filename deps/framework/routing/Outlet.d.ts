import { WidgetBaseInterface } from '../widget-core/interfaces';
import { Component, OutletOptions, OutletComponents, Outlet } from './interfaces';
import { Router } from './Router';
export declare function isComponent<W extends WidgetBaseInterface>(value: any): value is Component<W>;
export declare function getProperties(router: Router, properties: any): {
    router: Router;
};
export declare function Outlet<W extends WidgetBaseInterface, F extends WidgetBaseInterface, E extends WidgetBaseInterface>(outletComponents: Component<W> | OutletComponents<W, F, E>, outlet: string, options?: OutletOptions): Outlet<W, F, E>;
export default Outlet;
