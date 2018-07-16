import { RegistryLabel } from './../interfaces';
/**
 * Defines the contract requires for the get properties function
 * used to map the injected properties.
 */
export interface GetProperties<T = any> {
    (payload: any, properties: T): T;
}
/**
 * Defines the inject configuration required for use of the `inject` decorator
 */
export interface InjectConfig {
    /**
     * The label of the registry injector
     */
    name: RegistryLabel;
    /**
     * Function that returns propertues to inject using the passed properties
     * and the injected payload.
     */
    getProperties: GetProperties;
}
/**
 * Decorator retrieves an injector from an available registry using the name and
 * calls the `getProperties` function with the payload from the injector
 * and current properties with the the injected properties returned.
 *
 * @param InjectConfig the inject configuration
 */
export declare function inject({name, getProperties}: InjectConfig): (target: any, propertyKey?: string | undefined, descriptor?: PropertyDescriptor | undefined) => void;
export default inject;
