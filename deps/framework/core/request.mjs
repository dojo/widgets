import has from '../has/has';
import Task from './async/Task';
import ProviderRegistry from './request/ProviderRegistry';
import xhr from './request/providers/xhr';
export const providerRegistry = new ProviderRegistry();
const request = function request(url, options = {}) {
    try {
        return providerRegistry.match(url, options)(url, options);
    }
    catch (error) {
        return Task.reject(error);
    }
};
['DELETE', 'GET', 'HEAD', 'OPTIONS'].forEach((method) => {
    Object.defineProperty(request, method.toLowerCase(), {
        value(url, options = {}) {
            options = Object.create(options);
            options.method = method;
            return request(url, options);
        }
    });
});
['POST', 'PUT'].forEach((method) => {
    Object.defineProperty(request, method.toLowerCase(), {
        value(url, options = {}) {
            options = Object.create(options);
            options.method = method;
            return request(url, options);
        }
    });
});
Object.defineProperty(request, 'setDefaultProvider', {
    value(provider) {
        providerRegistry.setDefaultProvider(provider);
    }
});
providerRegistry.setDefaultProvider(xhr);
if (has('host-node')) {
    // tslint:disable-next-line
    import('./request/providers/node').then((node) => {
        providerRegistry.setDefaultProvider(node.default);
    });
}
export default request;
export { default as Headers } from './request/Headers';
export { default as TimeoutError } from './request/TimeoutError';
//# sourceMappingURL=request.mjs.map