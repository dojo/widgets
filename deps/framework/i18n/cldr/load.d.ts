import 'cldrjs/dist/cldr/unresolved';
export interface CldrData {
    main?: LocaleData;
    supplemental?: any;
}
export declare type CldrGroup = 'main' | 'supplemental';
export interface LocaleData {
    [locale: string]: any;
}
/**
 * A list of all required CLDR packages for an individual locale.
 */
export declare const mainPackages: ReadonlyArray<string>;
/**
 * A list of all required CLDR supplement packages.
 */
export declare const supplementalPackages: ReadonlyArray<string>;
/**
 * Determine whether a particular CLDR package has been loaded.
 *
 * Example: to check that `supplemental.likelySubtags` has been loaded, `isLoaded` would be called as
 * `isLoaded('supplemental', 'likelySubtags')`.
 *
 * @param groupName
 * The group to check; either "main" or "supplemental".
 *
 * @param ...args
 * Any remaining keys in the path to the desired package.
 *
 * @return
 * `true` if the deepest value exists; `false` otherwise.
 */
export declare function isLoaded(groupName: CldrGroup, ...args: string[]): boolean;
/**
 * Load the specified CLDR data with the i18n ecosystem.
 *
 * @param data
 * A data object containing `main` and/or `supplemental` objects with CLDR data.
 */
export default function loadCldrData(data: CldrData): Promise<void>;
/**
 * Clear the load cache, either the entire cache for the specified group. After calling this method,
 * `isLoaded` will return false for keys within the specified group(s).
 *
 * @param group
 * An optional group name. If not provided, then both the "main" and "supplemental" caches will be cleared.
 */
export declare function reset(group?: CldrGroup): void;
