import Promise from '../shim/Promise';
import { isPlugin, useDefault } from './load/util';
export function isAmdRequire(object) {
    return typeof object.toUrl === 'function';
}
export function isNodeRequire(object) {
    return typeof object.resolve === 'function';
}
const load = (function () {
    const resolver = isAmdRequire(require)
        ? require.toUrl
        : isNodeRequire(require) ? require.resolve : (resourceId) => resourceId;
    function pluginLoad(moduleIds, load, loader) {
        const pluginResourceIds = [];
        moduleIds = moduleIds.map((id, i) => {
            const parts = id.split('!');
            pluginResourceIds[i] = parts[1];
            return parts[0];
        });
        return loader(moduleIds).then((modules) => {
            pluginResourceIds.forEach((resourceId, i) => {
                if (typeof resourceId === 'string') {
                    const module = modules[i];
                    const defaultExport = module['default'] || module;
                    if (isPlugin(defaultExport)) {
                        resourceId =
                            typeof defaultExport.normalize === 'function'
                                ? defaultExport.normalize(resourceId, resolver)
                                : resolver(resourceId);
                        modules[i] = defaultExport.load(resourceId, load);
                    }
                }
            });
            return Promise.all(modules);
        });
    }
    if (typeof module === 'object' && typeof module.exports === 'object') {
        return function load(contextualRequire, ...moduleIds) {
            if (typeof contextualRequire === 'string') {
                moduleIds.unshift(contextualRequire);
                contextualRequire = require;
            }
            return pluginLoad(moduleIds, load, (moduleIds) => {
                try {
                    return Promise.resolve(moduleIds.map(function (moduleId) {
                        return contextualRequire(moduleId.split('!')[0]);
                    }));
                }
                catch (error) {
                    return Promise.reject(error);
                }
            });
        };
    }
    else if (typeof define === 'function' && define.amd) {
        return function load(contextualRequire, ...moduleIds) {
            if (typeof contextualRequire === 'string') {
                moduleIds.unshift(contextualRequire);
                contextualRequire = require;
            }
            return pluginLoad(moduleIds, load, (moduleIds) => {
                return new Promise(function (resolve, reject) {
                    let errorHandle;
                    if (typeof contextualRequire.on === 'function') {
                        errorHandle = contextualRequire.on('error', (error) => {
                            errorHandle.remove();
                            reject(error);
                        });
                    }
                    contextualRequire(moduleIds, function (...modules) {
                        errorHandle && errorHandle.remove();
                        resolve(modules);
                    });
                });
            });
        };
    }
    else {
        return function () {
            return Promise.reject(new Error('Unknown loader'));
        };
    }
})();
export default load;
export { isPlugin, useDefault };
//# sourceMappingURL=load.mjs.map