(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../core/QueuingEvented", "./history/HashHistory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var QueuingEvented_1 = require("../core/QueuingEvented");
    var HashHistory_1 = require("./history/HashHistory");
    var PARAM = Symbol('routing param');
    var Router = /** @class */ (function (_super) {
        tslib_1.__extends(Router, _super);
        function Router(config, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this._routes = [];
            _this._outletMap = Object.create(null);
            _this._matchedOutlets = Object.create(null);
            _this._currentParams = {};
            _this._currentQueryParams = {};
            /**
             * Called on change of the route by the the registered history manager. Matches the path against
             * the registered outlets.
             *
             * @param requestedPath The path of the requested route
             */
            _this._onChange = function (requestedPath) {
                _this.emit({ type: 'navstart' });
                _this._matchedOutlets = Object.create(null);
                _this._currentParams = {};
                requestedPath = _this._stripLeadingSlash(requestedPath);
                var _a = tslib_1.__read(requestedPath.split('?'), 2), path = _a[0], queryParamString = _a[1];
                _this._currentQueryParams = _this._getQueryParams(queryParamString);
                var matchedOutletContext;
                var matchedOutlet;
                var routes = tslib_1.__spread(_this._routes);
                var paramIndex = 0;
                var segments = path.split('/');
                var routeMatched = false;
                var previousOutlet;
                while (routes.length > 0) {
                    if (segments.length === 0) {
                        break;
                    }
                    var route = routes.shift();
                    var onEnter = route.onEnter, onExit = route.onExit;
                    var type = 'index';
                    var segmentsForRoute = tslib_1.__spread(segments);
                    var routeMatch = true;
                    var segmentIndex = 0;
                    if (segments.length < route.segments.length) {
                        routeMatch = false;
                    }
                    else {
                        while (segments.length > 0) {
                            if (route.segments[segmentIndex] === undefined) {
                                type = 'partial';
                                break;
                            }
                            var segment = segments.shift();
                            if (route.segments[segmentIndex] === PARAM) {
                                _this._currentParams[route.params[paramIndex++]] = segment;
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
                        _this._matchedOutlets[route.outlet] = {
                            queryParams: _this._currentQueryParams,
                            params: tslib_1.__assign({}, _this._currentParams),
                            type: type,
                            onEnter: onEnter,
                            onExit: onExit
                        };
                        matchedOutletContext = _this._matchedOutlets[route.outlet];
                        matchedOutlet = route.outlet;
                        if (route.children.length) {
                            paramIndex = 0;
                        }
                        routes = tslib_1.__spread(route.children);
                    }
                    else {
                        if (previousOutlet !== undefined && routes.length === 0) {
                            _this._matchedOutlets[previousOutlet].type = 'error';
                        }
                        segments = tslib_1.__spread(segmentsForRoute);
                    }
                }
                if (routeMatched === false) {
                    _this._matchedOutlets.errorOutlet = {
                        queryParams: _this._currentQueryParams,
                        params: tslib_1.__assign({}, _this._currentParams),
                        type: 'error'
                    };
                }
                if (matchedOutlet && matchedOutletContext) {
                    _this.emit({ type: 'nav', outlet: matchedOutlet, context: matchedOutletContext });
                }
            };
            var _a = options.HistoryManager, HistoryManager = _a === void 0 ? HashHistory_1.HashHistory : _a, base = options.base, window = options.window;
            _this._register(config);
            _this._history = new HistoryManager({ onChange: _this._onChange, base: base, window: window });
            if (_this._matchedOutlets.errorOutlet && _this._defaultOutlet) {
                var path = _this.link(_this._defaultOutlet);
                if (path) {
                    _this.setPath(path);
                }
            }
            return _this;
        }
        /**
         * Sets the path against the registered history manager
         *
         * @param path The path to set on the history manager
         */
        Router.prototype.setPath = function (path) {
            this._history.set(path);
        };
        /**
         * Generate a link for a given outlet identifier and optional params.
         *
         * @param outlet The outlet to generate a link for
         * @param params Optional Params for the generated link
         */
        Router.prototype.link = function (outlet, params) {
            if (params === void 0) { params = {}; }
            var _a = this, _outletMap = _a._outletMap, _currentParams = _a._currentParams, _currentQueryParams = _a._currentQueryParams;
            var route = _outletMap[outlet];
            if (route === undefined) {
                return;
            }
            var linkPath = route.fullPath;
            if (route.fullQueryParams.length > 0) {
                var queryString = route.fullQueryParams.reduce(function (queryParamString, param, index) {
                    if (index > 0) {
                        return queryParamString + "&" + param + "={" + param + "}";
                    }
                    return "?" + param + "={" + param + "}";
                }, '');
                linkPath = "" + linkPath + queryString;
            }
            params = tslib_1.__assign({}, route.defaultParams, _currentQueryParams, _currentParams, params);
            if (Object.keys(params).length === 0 && route.fullParams.length > 0) {
                return undefined;
            }
            var fullParams = tslib_1.__spread(route.fullParams, route.fullQueryParams);
            for (var i = 0; i < fullParams.length; i++) {
                var param = fullParams[i];
                if (params[param]) {
                    linkPath = linkPath.replace("{" + param + "}", params[param]);
                }
                else {
                    return undefined;
                }
            }
            return linkPath;
        };
        /**
         * Returns the outlet context for the outlet identifier if one has been matched
         *
         * @param outletIdentifier The outlet identifer
         */
        Router.prototype.getOutlet = function (outletIdentifier) {
            return this._matchedOutlets[outletIdentifier];
        };
        Object.defineProperty(Router.prototype, "currentParams", {
            /**
             * Returns all the params for the current matched outlets
             */
            get: function () {
                return this._currentParams;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Strips the leading slash on a path if one exists
         *
         * @param path The path to strip a leading slash
         */
        Router.prototype._stripLeadingSlash = function (path) {
            if (path[0] === '/') {
                return path.slice(1);
            }
            return path;
        };
        /**
         * Registers the routing configuration
         *
         * @param config The configuration
         * @param routes The routes
         * @param parentRoute The parent route
         */
        Router.prototype._register = function (config, routes, parentRoute) {
            routes = routes ? routes : this._routes;
            for (var i = 0; i < config.length; i++) {
                var _a = config[i], onEnter = _a.onEnter, onExit = _a.onExit, path = _a.path, outlet = _a.outlet, children = _a.children, _b = _a.defaultRoute, defaultRoute = _b === void 0 ? false : _b, _c = _a.defaultParams, defaultParams = _c === void 0 ? {} : _c;
                var _d = tslib_1.__read(path.split('?'), 2), parsedPath = _d[0], queryParamString = _d[1];
                var queryParams = [];
                parsedPath = this._stripLeadingSlash(parsedPath);
                var segments = parsedPath.split('/');
                var route = {
                    params: [],
                    outlet: outlet,
                    path: parsedPath,
                    segments: segments,
                    defaultParams: parentRoute ? tslib_1.__assign({}, parentRoute.defaultParams, defaultParams) : defaultParams,
                    children: [],
                    fullPath: parentRoute ? parentRoute.fullPath + "/" + parsedPath : parsedPath,
                    fullParams: [],
                    fullQueryParams: [],
                    onEnter: onEnter,
                    onExit: onExit
                };
                if (defaultRoute) {
                    this._defaultOutlet = outlet;
                }
                for (var i_1 = 0; i_1 < segments.length; i_1++) {
                    var segment = segments[i_1];
                    if (typeof segment === 'string' && segment[0] === '{') {
                        route.params.push(segment.replace('{', '').replace('}', ''));
                        segments[i_1] = PARAM;
                    }
                }
                if (queryParamString) {
                    queryParams = queryParamString.split('$').map(function (queryParam) {
                        return queryParam.replace('{', '').replace('}', '');
                    });
                }
                route.fullQueryParams = parentRoute ? tslib_1.__spread(parentRoute.fullQueryParams, queryParams) : queryParams;
                route.fullParams = parentRoute ? tslib_1.__spread(parentRoute.fullParams, route.params) : route.params;
                if (children && children.length > 0) {
                    this._register(children, route.children, route);
                }
                this._outletMap[outlet] = route;
                routes.push(route);
            }
        };
        /**
         * Returns an object of query params
         *
         * @param queryParamString The string of query params, e.g `paramOne=one&paramTwo=two`
         */
        Router.prototype._getQueryParams = function (queryParamString) {
            var queryParams = {};
            if (queryParamString) {
                var queryParameters = queryParamString.split('&');
                for (var i = 0; i < queryParameters.length; i++) {
                    var _a = tslib_1.__read(queryParameters[i].split('='), 2), key = _a[0], value = _a[1];
                    queryParams[key] = value;
                }
            }
            return queryParams;
        };
        return Router;
    }(QueuingEvented_1.default));
    exports.Router = Router;
    exports.default = Router;
});
//# sourceMappingURL=Router.js.map