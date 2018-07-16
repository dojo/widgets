import { WidgetBase } from './WidgetBase';
import { GetProperties } from './decorators/inject';
import { Constructor, RegistryLabel } from './interfaces';
export declare type Container<T extends WidgetBase> = Constructor<WidgetBase<Partial<T['properties']>>>;
export declare function Container<W extends WidgetBase>(component: Constructor<W> | RegistryLabel, name: RegistryLabel, {getProperties}: {
    getProperties: GetProperties;
}): Container<W>;
export default Container;
