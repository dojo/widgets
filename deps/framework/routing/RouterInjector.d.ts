import { Registry } from '../widget-core/Registry';
import { RegistryLabel } from '../widget-core/interfaces';
import { Router } from './Router';
import { RouteConfig, RouterOptions } from './interfaces';
/**
 * Router Injector Options
 *
 */
export interface RouterInjectorOptions extends RouterOptions {
    key?: RegistryLabel;
}
/**
 * Creates a router instance for a specific History manager (default is `HashHistory`) and registers
 * the route configuration.
 *
 * @param config The route config to register for the router
 * @param registry An optional registry that defaults to the global registry
 * @param options The router injector options
 */
export declare function registerRouterInjector(config: RouteConfig[], registry: Registry, options?: RouterInjectorOptions): Router;
