/// <reference types="node" />
import * as http from 'http';
import Task from '../../async/Task';
import Headers from '../Headers';
import { RequestOptions, UploadObservableTask } from '../interfaces';
import Response from '../Response';
import { Readable } from 'stream';
import Observable from '../../Observable';
/**
 * Request options specific to a node request. For HTTPS options, see
 * https://nodejs.org/api/tls.html#tls_tls_connect_options_callback for more details.
 */
export interface NodeRequestOptions extends RequestOptions {
    /**
     * User-agent header
     */
    agent?: any;
    /**
     * If specified, the request body is read from the stream specified here, rather than from the `body` field.
     */
    bodyStream?: Readable;
    /**
     * HTTPS optionally override the trusted CA certificates
     */
    ca?: any;
    /**
     * HTTPS optional cert chains in PEM format. One cert chain should be provided per private key.
     */
    cert?: string;
    /**
     * HTTPS optional cipher suite specification
     */
    ciphers?: string;
    dataEncoding?: string;
    /**
     * Whether or not to automatically follow redirects (default true)
     */
    followRedirects?: boolean;
    /**
     * HTTPS optional private key in PEM format.
     */
    key?: string;
    /**
     * Local interface to bind for network connections.
     */
    localAddress?: string;
    /**
     * HTTPS optional shared passphrase used for a single private key and/or a PFX.
     */
    passphrase?: string;
    /**
     * HTTPS optional PFX or PKCS12 encoded private key and certificate chain.
     */
    pfx?: any;
    /**
     * Optional proxy address. If specified, requests will be sent through this url.
     */
    proxy?: string;
    /**
     * HTTPS If not false the server will reject any connection which is not authorized with the list of supplied CAs
     */
    rejectUnauthorized?: boolean;
    /**
     * HTTPS optional SSL method to use, default is "SSLv23_method"
     */
    secureProtocol?: string;
    /**
     * Unix Domain Socket (use one of host:port or socketPath)
     */
    socketPath?: string;
    /**
     * Whether or not to add the gzip and deflate accept headers (default true)
     */
    acceptCompression?: boolean;
    /**
     * A set of options to set on the HTTP request
     */
    socketOptions?: {
        /**
         * Enable/disable keep-alive functionality, and optionally set the initial delay before the first keepalive probe is sent on an idle socket.
         */
        keepAlive?: number;
        /**
         * Disables the Nagle algorithm. By default TCP connections use the Nagle algorithm, they buffer data before sending it off.
         */
        noDelay?: boolean;
        /**
         * Number of milliseconds before the HTTP request times out
         */
        timeout?: number;
    };
    /**
     * Stream encoding on incoming HTTP response
     */
    streamEncoding?: string;
    /**
     * Options to control redirect follow logic
     */
    redirectOptions?: {
        /**
         * The limit to the number of redirects that will be followed (default 15). This is used to prevent infinite
         * redirect loops.
         */
        limit?: number;
        count?: number;
        /**
         * Whether or not to keep the original HTTP method during 301 redirects (default false).
         */
        keepOriginalMethod?: boolean;
    };
}
/**
 * Turn a node native response object into something that resembles the fetch api
 */
export declare class NodeResponse extends Response {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    downloadBody: boolean;
    readonly bodyUsed: boolean;
    readonly nativeResponse: http.IncomingMessage;
    readonly requestOptions: NodeRequestOptions;
    readonly url: string;
    readonly download: Observable<number>;
    readonly data: Observable<any>;
    constructor(response: http.IncomingMessage);
    arrayBuffer(): Task<ArrayBuffer>;
    blob(): Task<Blob>;
    formData(): Task<FormData>;
    text(): Task<string>;
}
export declare function getAuth(proxyAuth: string | undefined, options: NodeRequestOptions): string | undefined;
export default function node(url: string, options?: NodeRequestOptions): UploadObservableTask<NodeResponse>;
