import Promise from '../../shim/Promise';
import { isPlugin, useDefault } from './util';
/**
 * @private
 * Resolves an absolute path from an absolute base path and relative module ID.
 *
 * @param base
 * The absolute base path.
 *
 * @param mid
 * The relative module ID
 *
 * @return
 * The resolved absolute module path.
 */
function resolveRelative(base, mid) {
    const isRelative = mid.match(/^\.+\//);
    let result = base;
    if (isRelative) {
        if (mid.match(/^\.\//)) {
            mid = mid.replace(/\.\//, '');
        }
        const up = mid.match(/\.\.\//g);
        if (up) {
            const chunks = base.split('/');
            if (up.length > chunks.length) {
                throw new Error('Path cannot go beyond root directory.');
            }
            chunks.splice(chunks.length - up.length);
            result = chunks.join('/');
            mid = mid.replace(/\.\.\//g, '');
        }
        mid = result + '/' + mid;
    }
    return mid;
}
/**
 * @private
 * Returns the parent directory for the specified module ID.
 *
 * @param context
 * A function that returns the context module ID.
 *
 * @return
 * The parent directory of the path returned by the context function.
 */
function getBasePath(context) {
    return context()
        .split('/')
        .slice(0, -1)
        .join('/');
}
export default function load(...args) {
    const req = __webpack_require__;
    const context = typeof args[0] === 'function'
        ? args[0]
        : function () {
            return '';
        };
    const modules = __modules__ || {};
    const base = getBasePath(context);
    const results = args
        .filter((mid) => typeof mid === 'string')
        .map((mid) => resolveRelative(base, mid))
        .map((mid) => {
        let [moduleId, pluginResourceId] = mid.split('!');
        const moduleMeta = modules[mid] || modules[moduleId];
        if (!moduleMeta) {
            return Promise.reject(new Error(`Missing module: ${mid}`));
        }
        if (moduleMeta.lazy) {
            return new Promise((resolve) => req(moduleMeta.id)(resolve));
        }
        const module = req(moduleMeta.id);
        const defaultExport = module['default'] || module;
        if (isPlugin(defaultExport)) {
            pluginResourceId =
                typeof defaultExport.normalize === 'function'
                    ? defaultExport.normalize(pluginResourceId, (mid) => resolveRelative(base, mid))
                    : resolveRelative(base, pluginResourceId);
            return Promise.resolve(defaultExport.load(pluginResourceId, load));
        }
        return Promise.resolve(module);
    });
    return Promise.all(results);
}
export { isPlugin, useDefault };
//# sourceMappingURL=webpack.mjs.map