import { Base } from './Base';
export interface IntersectionGetOptions {
    root?: string;
    rootMargin?: string;
    threshold?: number[];
}
export interface IntersectionResult {
    intersectionRatio: number;
    isIntersecting: boolean;
}
export declare class Intersection extends Base {
    private readonly _details;
    /**
     * Return an `InteractionResult` for the requested key and options.
     *
     * @param key The key to return the intersection meta for
     * @param options The options for the request
     */
    get(key: string | number, options?: IntersectionGetOptions): IntersectionResult;
    /**
     * Returns true if the node for the key has intersection details
     *
     * @param key The key to return the intersection meta for
     * @param options The options for the request
     */
    has(key: string | number, options?: IntersectionGetOptions): boolean;
    private _createDetails(options, rootNode?);
    private _getDetails(options?);
    private _onIntersect;
}
export default Intersection;
