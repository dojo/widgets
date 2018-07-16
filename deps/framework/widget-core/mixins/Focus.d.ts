import { Constructor } from './../interfaces';
import { WidgetBase } from './../WidgetBase';
export interface FocusProperties {
    focus?: (() => boolean);
}
export interface FocusMixin {
    focus: () => void;
    shouldFocus: () => boolean;
    properties: FocusProperties;
}
export declare function FocusMixin<T extends Constructor<WidgetBase<FocusProperties>>>(Base: T): T & Constructor<FocusMixin>;
export default FocusMixin;
