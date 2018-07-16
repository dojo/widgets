import { isPlugin, useDefault } from './util';
/**
 * A webpack-specific function that replaces `@dojo/core/load` in its builds. In order for a module to be loaded,
 * it must first be included in a webpack chunk, whether that chunk is included in the main build, or lazy-loaded.
 * Note that this module is not intended for direct use, but rather is intended for use by a webpack plugin
 * that sets the module ID map used to translate resolved module paths to webpack module IDs.
 *
 * @param contextRequire
 * An optional function that returns the base path to use when resolving relative module IDs.
 *
 * @param ...mids
 * One or more IDs for modules to load.
 *
 * @return
 * A promise to the loaded module values.
 */
export default function load(contextRequire: () => string, ...mids: string[]): Promise<any[]>;
export default function load(...mids: string[]): Promise<any[]>;
export { isPlugin, useDefault };
