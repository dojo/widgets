import * as tslib_1 from "tslib";
import { Router } from './Router';
/**
 * Creates a router instance for a specific History manager (default is `HashHistory`) and registers
 * the route configuration.
 *
 * @param config The route config to register for the router
 * @param registry An optional registry that defaults to the global registry
 * @param options The router injector options
 */
export function registerRouterInjector(config, registry, options = {}) {
    const { key = 'router' } = options, routerOptions = tslib_1.__rest(options, ["key"]);
    if (registry.hasInjector(key)) {
        throw new Error('Router has already been defined');
    }
    const router = new Router(config, routerOptions);
    registry.defineInjector(key, (invalidator) => {
        router.on('navstart', () => invalidator());
        return () => router;
    });
    return router;
}
//# sourceMappingURL=RouterInjector.mjs.map