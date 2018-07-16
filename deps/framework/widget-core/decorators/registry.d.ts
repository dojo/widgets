import { DecoratorHandler } from './handleDecorator';
import { RegistryItem } from '../Registry';
export interface RegistryConfig {
    [name: string]: RegistryItem;
}
/**
 * Decorator that can be used to register a widget with the calling widgets local registry
 */
export declare function registry(nameOrConfig: string, loader: RegistryItem): DecoratorHandler;
export declare function registry(nameOrConfig: RegistryConfig): DecoratorHandler;
export default registry;
