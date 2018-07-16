import { Base } from './Base';
export interface ContentRect {
    readonly bottom: number;
    readonly height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
}
export interface PredicateFunction {
    (contentRect: ContentRect): boolean;
}
export interface PredicateFunctions {
    [id: string]: PredicateFunction;
}
export declare type PredicateResponses<T = PredicateFunctions> = {
    [id in keyof T]: boolean;
};
export declare class Resize extends Base {
    private _details;
    get<T extends PredicateFunctions>(key: string | number, predicates?: PredicateFunctions): PredicateResponses<T>;
}
export default Resize;
