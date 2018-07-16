import Task from '../../async/Task';
import Observable from '../../Observable';
import Headers from '../Headers';
import { RequestOptions, UploadObservableTask } from '../interfaces';
import Response from '../Response';
/**
 * Request options specific to an XHR request
 */
export interface XhrRequestOptions extends RequestOptions {
    /**
     * Controls whether or not the request is synchronous (blocks the main thread) or asynchronous (default).
     */
    blockMainThread?: boolean;
    /**
     * Controls whether or not the X-Requested-With header is added to the request (default true). Set to false to not
     * include the header.
     */
    includeRequestedWithHeader?: boolean;
    /**
     * Controls whether or not to subscribe to events on `XMLHttpRequest.upload`, if available. This causes all requests
     * to be preflighted (https://xhr.spec.whatwg.org/#request)
     */
    includeUploadProgress?: boolean;
}
/**
 * Wraps an XHR request in a response that mimics the fetch API
 */
export declare class XhrResponse extends Response {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly bodyUsed: boolean;
    readonly nativeResponse: XMLHttpRequest;
    readonly requestOptions: XhrRequestOptions;
    readonly url: string;
    readonly download: Observable<number>;
    readonly data: Observable<any>;
    constructor(request: XMLHttpRequest);
    arrayBuffer(): Task<ArrayBuffer>;
    blob(): Task<Blob>;
    formData(): Task<FormData>;
    text(): Task<string>;
    xml(): Task<Document>;
}
export default function xhr(url: string, options?: XhrRequestOptions): UploadObservableTask<XhrResponse>;
