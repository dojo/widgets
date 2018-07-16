import { Constructor, WidgetProperties, SupportedClassName } from './../interfaces';
import { Registry } from './../Registry';
import { Injector } from './../Injector';
import { WidgetBase } from './../WidgetBase';
/**
 * A lookup object for available class names
 */
export declare type ClassNames = {
    [key: string]: string;
};
/**
 * A lookup object for available widget classes names
 */
export interface Theme {
    [key: string]: object;
}
/**
 * Properties required for the Themed mixin
 */
export interface ThemedProperties<T = ClassNames> extends WidgetProperties {
    injectedTheme?: any;
    theme?: Theme;
    extraClasses?: {
        [P in keyof T]?: string;
    };
}
export declare const INJECTED_THEME_KEY: symbol;
/**
 * Interface for the ThemedMixin
 */
export interface ThemedMixin<T = ClassNames> {
    theme(classes: SupportedClassName): SupportedClassName;
    theme(classes: SupportedClassName[]): SupportedClassName[];
    properties: ThemedProperties<T>;
}
/**
 * Decorator for base css classes
 */
export declare function theme(theme: {}): (target: any, propertyKey?: string | undefined, descriptor?: PropertyDescriptor | undefined) => void;
/**
 * Convenience function that is given a theme and an optional registry, the theme
 * injector is defined against the registry, returning the theme.
 *
 * @param theme the theme to set
 * @param themeRegistry registry to define the theme injector against. Defaults
 * to the global registry
 *
 * @returns the theme injector used to set the theme
 */
export declare function registerThemeInjector(theme: any, themeRegistry: Registry): Injector;
/**
 * Function that returns a class decorated with with Themed functionality
 */
export declare function ThemedMixin<E, T extends Constructor<WidgetBase<ThemedProperties<E>>>>(Base: T): Constructor<ThemedMixin<E>> & T;
export default ThemedMixin;
