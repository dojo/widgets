import QueuingEvented from '../core/QueuingEvented';
import { HashHistory } from './history/HashHistory';
const PARAM = Symbol('routing param');
export class Router extends QueuingEvented {
    constructor(config, options = {}) {
        super();
        this._routes = [];
        this._outletMap = Object.create(null);
        this._matchedOutlets = Object.create(null);
        this._currentParams = {};
        this._currentQueryParams = {};
        /**
         * Called on change of the route by the the registered history manager. Matches the path against
         * the registered outlets.
         *
         * @param requestedPath The path of the requested route
         */
        this._onChange = (requestedPath) => {
            this.emit({ type: 'navstart' });
            this._matchedOutlets = Object.create(null);
            this._currentParams = {};
            requestedPath = this._stripLeadingSlash(requestedPath);
            const [path, queryParamString] = requestedPath.split('?');
            this._currentQueryParams = this._getQueryParams(queryParamString);
            let matchedOutletContext;
            let matchedOutlet;
            let routes = [...this._routes];
            let paramIndex = 0;
            let segments = path.split('/');
            let routeMatched = false;
            let previousOutlet;
            while (routes.length > 0) {
                if (segments.length === 0) {
                    break;
                }
                const route = routes.shift();
                const { onEnter, onExit } = route;
                let type = 'index';
                const segmentsForRoute = [...segments];
                let routeMatch = true;
                let segmentIndex = 0;
                if (segments.length < route.segments.length) {
                    routeMatch = false;
                }
                else {
                    while (segments.length > 0) {
                        if (route.segments[segmentIndex] === undefined) {
                            type = 'partial';
                            break;
                        }
                        const segment = segments.shift();
                        if (route.segments[segmentIndex] === PARAM) {
                            this._currentParams[route.params[paramIndex++]] = segment;
                        }
                        else if (route.segments[segmentIndex] !== segment) {
                            routeMatch = false;
                            break;
                        }
                        segmentIndex++;
                    }
                }
                if (routeMatch === true) {
                    previousOutlet = route.outlet;
                    routeMatched = true;
                    this._matchedOutlets[route.outlet] = {
                        queryParams: this._currentQueryParams,
                        params: Object.assign({}, this._currentParams),
                        type,
                        onEnter,
                        onExit
                    };
                    matchedOutletContext = this._matchedOutlets[route.outlet];
                    matchedOutlet = route.outlet;
                    if (route.children.length) {
                        paramIndex = 0;
                    }
                    routes = [...route.children];
                }
                else {
                    if (previousOutlet !== undefined && routes.length === 0) {
                        this._matchedOutlets[previousOutlet].type = 'error';
                    }
                    segments = [...segmentsForRoute];
                }
            }
            if (routeMatched === false) {
                this._matchedOutlets.errorOutlet = {
                    queryParams: this._currentQueryParams,
                    params: Object.assign({}, this._currentParams),
                    type: 'error'
                };
            }
            if (matchedOutlet && matchedOutletContext) {
                this.emit({ type: 'nav', outlet: matchedOutlet, context: matchedOutletContext });
            }
        };
        const { HistoryManager = HashHistory, base, window } = options;
        this._register(config);
        this._history = new HistoryManager({ onChange: this._onChange, base, window });
        if (this._matchedOutlets.errorOutlet && this._defaultOutlet) {
            const path = this.link(this._defaultOutlet);
            if (path) {
                this.setPath(path);
            }
        }
    }
    /**
     * Sets the path against the registered history manager
     *
     * @param path The path to set on the history manager
     */
    setPath(path) {
        this._history.set(path);
    }
    /**
     * Generate a link for a given outlet identifier and optional params.
     *
     * @param outlet The outlet to generate a link for
     * @param params Optional Params for the generated link
     */
    link(outlet, params = {}) {
        const { _outletMap, _currentParams, _currentQueryParams } = this;
        let route = _outletMap[outlet];
        if (route === undefined) {
            return;
        }
        let linkPath = route.fullPath;
        if (route.fullQueryParams.length > 0) {
            let queryString = route.fullQueryParams.reduce((queryParamString, param, index) => {
                if (index > 0) {
                    return `${queryParamString}&${param}={${param}}`;
                }
                return `?${param}={${param}}`;
            }, '');
            linkPath = `${linkPath}${queryString}`;
        }
        params = Object.assign({}, route.defaultParams, _currentQueryParams, _currentParams, params);
        if (Object.keys(params).length === 0 && route.fullParams.length > 0) {
            return undefined;
        }
        const fullParams = [...route.fullParams, ...route.fullQueryParams];
        for (let i = 0; i < fullParams.length; i++) {
            const param = fullParams[i];
            if (params[param]) {
                linkPath = linkPath.replace(`{${param}}`, params[param]);
            }
            else {
                return undefined;
            }
        }
        return linkPath;
    }
    /**
     * Returns the outlet context for the outlet identifier if one has been matched
     *
     * @param outletIdentifier The outlet identifer
     */
    getOutlet(outletIdentifier) {
        return this._matchedOutlets[outletIdentifier];
    }
    /**
     * Returns all the params for the current matched outlets
     */
    get currentParams() {
        return this._currentParams;
    }
    /**
     * Strips the leading slash on a path if one exists
     *
     * @param path The path to strip a leading slash
     */
    _stripLeadingSlash(path) {
        if (path[0] === '/') {
            return path.slice(1);
        }
        return path;
    }
    /**
     * Registers the routing configuration
     *
     * @param config The configuration
     * @param routes The routes
     * @param parentRoute The parent route
     */
    _register(config, routes, parentRoute) {
        routes = routes ? routes : this._routes;
        for (let i = 0; i < config.length; i++) {
            let { onEnter, onExit, path, outlet, children, defaultRoute = false, defaultParams = {} } = config[i];
            let [parsedPath, queryParamString] = path.split('?');
            let queryParams = [];
            parsedPath = this._stripLeadingSlash(parsedPath);
            const segments = parsedPath.split('/');
            const route = {
                params: [],
                outlet,
                path: parsedPath,
                segments,
                defaultParams: parentRoute ? Object.assign({}, parentRoute.defaultParams, defaultParams) : defaultParams,
                children: [],
                fullPath: parentRoute ? `${parentRoute.fullPath}/${parsedPath}` : parsedPath,
                fullParams: [],
                fullQueryParams: [],
                onEnter,
                onExit
            };
            if (defaultRoute) {
                this._defaultOutlet = outlet;
            }
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                if (typeof segment === 'string' && segment[0] === '{') {
                    route.params.push(segment.replace('{', '').replace('}', ''));
                    segments[i] = PARAM;
                }
            }
            if (queryParamString) {
                queryParams = queryParamString.split('$').map((queryParam) => {
                    return queryParam.replace('{', '').replace('}', '');
                });
            }
            route.fullQueryParams = parentRoute ? [...parentRoute.fullQueryParams, ...queryParams] : queryParams;
            route.fullParams = parentRoute ? [...parentRoute.fullParams, ...route.params] : route.params;
            if (children && children.length > 0) {
                this._register(children, route.children, route);
            }
            this._outletMap[outlet] = route;
            routes.push(route);
        }
    }
    /**
     * Returns an object of query params
     *
     * @param queryParamString The string of query params, e.g `paramOne=one&paramTwo=two`
     */
    _getQueryParams(queryParamString) {
        const queryParams = {};
        if (queryParamString) {
            const queryParameters = queryParamString.split('&');
            for (let i = 0; i < queryParameters.length; i++) {
                const [key, value] = queryParameters[i].split('=');
                queryParams[key] = value;
            }
        }
        return queryParams;
    }
}
export default Router;
//# sourceMappingURL=Router.mjs.map