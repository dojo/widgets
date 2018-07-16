import QueuingEvented from '../core/QueuingEvented';
import { RouteConfig, OutletContext, Params, RouterInterface, RouterOptions } from './interfaces';
import { EventObject } from '../core/interfaces';
export interface NavEvent extends EventObject<string> {
    outlet: string;
    context: OutletContext;
}
export declare class Router extends QueuingEvented<{
    nav: NavEvent;
}> implements RouterInterface {
    private _routes;
    private _outletMap;
    private _matchedOutlets;
    private _currentParams;
    private _currentQueryParams;
    private _defaultOutlet;
    private _history;
    constructor(config: RouteConfig[], options?: RouterOptions);
    /**
     * Sets the path against the registered history manager
     *
     * @param path The path to set on the history manager
     */
    setPath(path: string): void;
    /**
     * Generate a link for a given outlet identifier and optional params.
     *
     * @param outlet The outlet to generate a link for
     * @param params Optional Params for the generated link
     */
    link(outlet: string, params?: Params): string | undefined;
    /**
     * Returns the outlet context for the outlet identifier if one has been matched
     *
     * @param outletIdentifier The outlet identifer
     */
    getOutlet(outletIdentifier: string): OutletContext | undefined;
    /**
     * Returns all the params for the current matched outlets
     */
    readonly currentParams: Params;
    /**
     * Strips the leading slash on a path if one exists
     *
     * @param path The path to strip a leading slash
     */
    private _stripLeadingSlash(path);
    /**
     * Registers the routing configuration
     *
     * @param config The configuration
     * @param routes The routes
     * @param parentRoute The parent route
     */
    private _register(config, routes?, parentRoute?);
    /**
     * Returns an object of query params
     *
     * @param queryParamString The string of query params, e.g `paramOne=one&paramTwo=two`
     */
    private _getQueryParams(queryParamString?);
    /**
     * Called on change of the route by the the registered history manager. Matches the path against
     * the registered outlets.
     *
     * @param requestedPath The path of the requested route
     */
    private _onChange;
}
export default Router;
