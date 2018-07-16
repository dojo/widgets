import Task from '../async/Task';
import { Headers, Response as ResponseInterface, RequestOptions } from './interfaces';
import Observable from '../Observable';
export interface ResponseData {
    task: Task<any>;
    used: boolean;
}
declare abstract class Response implements ResponseInterface {
    readonly abstract headers: Headers;
    readonly abstract ok: boolean;
    readonly abstract status: number;
    readonly abstract statusText: string;
    readonly abstract url: string;
    readonly abstract bodyUsed: boolean;
    readonly abstract requestOptions: RequestOptions;
    readonly abstract download: Observable<number>;
    readonly abstract data: Observable<any>;
    json<T>(): Task<T>;
    abstract arrayBuffer(): Task<ArrayBuffer>;
    abstract blob(): Task<Blob>;
    abstract formData(): Task<FormData>;
    abstract text(): Task<string>;
}
export default Response;
export declare function getFileReaderPromise<T>(reader: FileReader): Promise<T>;
export declare function getTextFromBlob(blob: Blob): Promise<string>;
export declare function getArrayBufferFromBlob(blob: Blob): Promise<ArrayBuffer>;
export declare function getTextFromArrayBuffer(buffer: ArrayBuffer): string;
