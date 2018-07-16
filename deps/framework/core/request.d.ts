import Task from './async/Task';
import { RequestOptions, Response, Provider, UploadObservableTask } from './request/interfaces';
import ProviderRegistry from './request/ProviderRegistry';
export declare const providerRegistry: ProviderRegistry;
declare const request: {
    (url: string, options?: RequestOptions): Task<Response>;
    delete(url: string, options?: RequestOptions): Task<Response>;
    get(url: string, options?: RequestOptions): Task<Response>;
    head(url: string, options?: RequestOptions): Task<Response>;
    options(url: string, options?: RequestOptions): Task<Response>;
    post(url: string, options?: RequestOptions): UploadObservableTask<Response>;
    put(url: string, options?: RequestOptions): UploadObservableTask<Response>;
    setDefaultProvider(provider: Provider): void;
};
export default request;
export * from './request/interfaces';
export { default as Headers } from './request/Headers';
export { default as TimeoutError } from './request/TimeoutError';
export { ResponseData } from './request/Response';
