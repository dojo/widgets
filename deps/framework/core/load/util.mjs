import { isArrayLike, isIterable } from '../../shim/iterator';
export function isPlugin(value) {
    return Boolean(value) && typeof value.load === 'function';
}
export function useDefault(modules) {
    if (isArrayLike(modules)) {
        let processedModules = [];
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            processedModules.push(module.__esModule && module.default ? module.default : module);
        }
        return processedModules;
    }
    else if (isIterable(modules)) {
        let processedModules = [];
        for (const module of modules) {
            processedModules.push(module.__esModule && module.default ? module.default : module);
        }
        return processedModules;
    }
    else {
        return modules.__esModule && modules.default ? modules.default : modules;
    }
}
//# sourceMappingURL=util.mjs.map