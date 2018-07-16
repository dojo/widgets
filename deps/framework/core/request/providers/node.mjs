import Set from '../../../shim/Set';
import WeakMap from '../../../shim/WeakMap';
import * as http from 'http';
import * as https from 'https';
import * as urlUtil from 'url';
import * as zlib from 'zlib';
import Task from '../../async/Task';
import { deepAssign } from '../../lang';
import { queueTask } from '../../queue';
import { createTimer } from '../../util';
import Headers from '../Headers';
import Response from '../Response';
import TimeoutError from '../TimeoutError';
import Observable from '../../Observable';
import SubscriptionPool from '../SubscriptionPool';
// TODO: This should be read from the package and not hard coded!
let version = '2.0.0-pre';
/**
 * If not overridden, redirects will only be processed this many times before aborting (per request).
 * @type {number}
 */
const DEFAULT_REDIRECT_LIMIT = 15;
const dataMap = new WeakMap();
const discardedDuplicates = new Set([
    'age',
    'authorization',
    'content-length',
    'content-type',
    'etag',
    'expires',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'last-modified',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'retry-after',
    'user-agent'
]);
function getDataTask(response) {
    const data = dataMap.get(response);
    if (data.used) {
        return Task.reject(new TypeError('Body already read'));
    }
    data.used = true;
    return data.task.then((_) => data);
}
/**
 * Turn a node native response object into something that resembles the fetch api
 */
export class NodeResponse extends Response {
    constructor(response) {
        super();
        this.downloadBody = true;
        const headers = (this.headers = new Headers());
        for (let key in response.headers) {
            const value = response.headers[key];
            if (value) {
                if (discardedDuplicates.has(key) && !Array.isArray(value)) {
                    headers.append(key, value);
                }
                (Array.isArray(value) ? value : value.split(/\s*,\s*/)).forEach((v) => {
                    headers.append(key, v);
                });
            }
        }
        this.status = response.statusCode || 0;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = response.statusMessage || '';
    }
    get bodyUsed() {
        return dataMap.get(this).used;
    }
    get nativeResponse() {
        return dataMap.get(this).nativeResponse;
    }
    get requestOptions() {
        return dataMap.get(this).requestOptions;
    }
    get url() {
        return dataMap.get(this).url;
    }
    get download() {
        return dataMap.get(this).downloadObservable;
    }
    get data() {
        return dataMap.get(this).dataObservable;
    }
    arrayBuffer() {
        return getDataTask(this).then((data) => {
            if (data) {
                return data.data;
            }
            return new Buffer([]);
        });
    }
    blob() {
        // Node doesn't support Blobs
        return Task.reject(new Error('Blob not supported'));
    }
    formData() {
        return Task.reject(new Error('FormData not supported'));
    }
    text() {
        return getDataTask(this).then((data) => {
            return String(data ? data.data : '');
        });
    }
}
function redirect(resolve, reject, originalUrl, redirectUrl, options) {
    if (!options.redirectOptions) {
        options.redirectOptions = {};
    }
    const { limit: redirectLimit = DEFAULT_REDIRECT_LIMIT, count: redirectCount = 0 } = options.redirectOptions;
    const { followRedirects = true } = options;
    if (!followRedirects) {
        return false;
    }
    // we only check for undefined here because empty string redirects are now allowed
    // (they'll resolve to the current url)
    if (redirectUrl === undefined || redirectUrl === null) {
        reject(new Error('asked to redirect but no location header was found'));
        return true;
    }
    if (redirectCount > redirectLimit) {
        reject(new Error(`too many redirects, limit reached at ${redirectLimit}`));
        return true;
    }
    options.redirectOptions.count = redirectCount + 1;
    // we wrap the url in a call to node's URL.resolve which will handle relative and partial
    // redirects (like "/another-page" on the same domain).
    resolve(node(urlUtil.resolve(originalUrl, redirectUrl), options));
    return true;
}
export function getAuth(proxyAuth, options) {
    if (proxyAuth) {
        return proxyAuth;
    }
    if (options.user || options.password) {
        return `${options.user || ''}:${options.password || ''}`;
    }
    return undefined;
}
export default function node(url, options = {}) {
    const parsedUrl = urlUtil.parse(options.proxy || url);
    const requestOptions = {
        agent: options.agent,
        auth: getAuth(parsedUrl.auth, options),
        ca: options.ca,
        cert: options.cert,
        ciphers: options.ciphers,
        host: parsedUrl.host,
        hostname: parsedUrl.hostname,
        key: options.key,
        localAddress: options.localAddress,
        method: options.method ? options.method.toUpperCase() : 'GET',
        passphrase: options.passphrase,
        path: parsedUrl.path,
        pfx: options.pfx,
        port: Number(parsedUrl.port),
        rejectUnauthorized: options.rejectUnauthorized,
        secureProtocol: options.secureProtocol,
        socketPath: options.socketPath
    };
    requestOptions.headers = options.headers || {};
    if (!Object.keys(requestOptions.headers)
        .map((headerName) => headerName.toLowerCase())
        .some((headerName) => headerName === 'user-agent')) {
        requestOptions.headers['user-agent'] = 'dojo/' + version + ' Node.js/' + process.version.replace(/^v/, '');
    }
    if (options.proxy) {
        requestOptions.path = url;
        if (parsedUrl.auth) {
            requestOptions.headers['proxy-authorization'] = 'Basic ' + new Buffer(parsedUrl.auth).toString('base64');
        }
        const parsedProxyUrl = urlUtil.parse(url);
        if (parsedProxyUrl.host) {
            requestOptions.headers['host'] = parsedProxyUrl.host;
        }
        if (parsedProxyUrl.auth) {
            requestOptions.auth = parsedProxyUrl.auth;
        }
    }
    const { acceptCompression = true } = options;
    if (acceptCompression) {
        requestOptions.headers['Accept-Encoding'] = 'gzip, deflate';
    }
    const request = parsedUrl.protocol === 'https:' ? https.request(requestOptions) : http.request(requestOptions);
    const uploadObserverPool = new SubscriptionPool();
    const requestTask = new Task((resolve, reject) => {
        let timeoutHandle;
        let timeoutReject = reject;
        if (options.socketOptions) {
            if (options.socketOptions.timeout) {
                request.setTimeout(options.socketOptions.timeout);
            }
            if ('noDelay' in options.socketOptions) {
                request.setNoDelay(options.socketOptions.noDelay);
            }
            if ('keepAlive' in options.socketOptions) {
                const initialDelay = options.socketOptions.keepAlive;
                if (initialDelay !== undefined) {
                    request.setSocketKeepAlive(initialDelay >= 0, initialDelay);
                }
            }
        }
        request.once('response', (message) => {
            const response = new NodeResponse(message);
            // Redirection handling defaults to true in order to harmonise with the XHR provider, which will always
            // follow redirects
            if (response.status >= 300 && response.status < 400) {
                const redirectOptions = options.redirectOptions || {};
                const newOptions = deepAssign({}, options);
                switch (response.status) {
                    case 300:
                        /**
                         * Note about 300 redirects. RFC 2616 doesn't specify what to do with them, it is up to the client to "pick
                         * the right one".  We're picking like Chrome does, just don't pick any.
                         */
                        break;
                    case 301:
                    case 302:
                        /**
                         * RFC 2616 says,
                         *
                         *     If the 301 status code is received in response to a request other
                         *     than GET or HEAD, the user agent MUST NOT automatically redirect the
                         *     request unless it can be confirmed by the user, since this might
                         *       change the conditions under which the request was issued.
                         *
                         *     Note: When automatically redirecting a POST request after
                         *     receiving a 301 status code, some existing HTTP/1.0 user agents
                         *     will erroneously change it into a GET request.
                         *
                         * We're going to be one of those erroneous agents, to prevent the request from failing..
                         */
                        if (requestOptions.method !== 'GET' &&
                            requestOptions.method !== 'HEAD' &&
                            !redirectOptions.keepOriginalMethod) {
                            newOptions.method = 'GET';
                        }
                        if (redirect(resolve, reject, url, response.headers.get('location'), newOptions)) {
                            return;
                        }
                        break;
                    case 303:
                        /**
                         * The response to the request can be found under a different URI and
                         * SHOULD be retrieved using a GET method on that resource.
                         */
                        if (requestOptions.method !== 'GET') {
                            newOptions.method = 'GET';
                        }
                        if (redirect(resolve, reject, url, response.headers.get('location'), newOptions)) {
                            return;
                        }
                        break;
                    case 304:
                        // do nothing so this can fall through and return the response as normal. Nothing more can
                        // be done for 304
                        break;
                    case 305:
                        if (!response.headers.get('location')) {
                            reject(new Error('expected Location header to contain a proxy url'));
                        }
                        else {
                            newOptions.proxy = response.headers.get('location') || '';
                            if (redirect(resolve, reject, url, '', newOptions)) {
                                return;
                            }
                        }
                        break;
                    case 307:
                        /**
                         *  If the 307 status code is received in response to a request other
                         *  than GET or HEAD, the user agent MUST NOT automatically redirect the
                         *  request unless it can be confirmed by the user, since this might
                         *  change the conditions under which the request was issued.
                         */
                        if (redirect(resolve, reject, url, response.headers.get('location'), newOptions)) {
                            return;
                        }
                        break;
                    default:
                        reject(new Error('unhandled redirect status ' + response.status));
                        return;
                }
            }
            options.streamEncoding && message.setEncoding(options.streamEncoding);
            const downloadSubscriptionPool = new SubscriptionPool();
            const dataSubscriptionPool = new SubscriptionPool();
            /*
         [RFC 2616](https://tools.ietf.org/html/rfc2616#page-118) says that content-encoding can have multiple
         values, so we split them here and put them in a list to process later.
         */
            const contentEncodings = response.headers.getAll('content-encoding');
            const task = new Task((resolve, reject) => {
                timeoutReject = reject;
                // we queue this up for later to allow listeners to register themselves before we start receiving data
                queueTask(() => {
                    /*
             * Note that this is the raw data, if your input stream is zipped, and you are piecing
             * together the downloaded data, you'll have to decompress it yourself
             */
                    message.on('data', (chunk) => {
                        dataSubscriptionPool.next(chunk);
                        if (response.downloadBody) {
                            data.buffer.push(chunk);
                        }
                        data.size +=
                            typeof chunk === 'string'
                                ? Buffer.byteLength(chunk, options.streamEncoding)
                                : chunk.length;
                        downloadSubscriptionPool.next(data.size);
                    });
                    message.once('end', () => {
                        timeoutHandle && timeoutHandle.destroy();
                        let dataAsBuffer = options.streamEncoding
                            ? new Buffer(data.buffer.join(''), 'utf8')
                            : Buffer.concat(data.buffer, data.size);
                        const handleEncoding = function () {
                            /*
                     Content encoding is ordered by the order in which they were applied to the
                     content, so do undo the encoding we have to start at the end and work backwards.
                     */
                            if (contentEncodings.length) {
                                const encoding = contentEncodings.pop().trim().toLowerCase();
                                if (encoding === '' || encoding === 'none' || encoding === 'identity') {
                                    // do nothing, response stream is as-is
                                    handleEncoding();
                                }
                                else if (encoding === 'gzip') {
                                    zlib.gunzip(dataAsBuffer, function (err, result) {
                                        if (err) {
                                            reject(err);
                                        }
                                        dataAsBuffer = result;
                                        handleEncoding();
                                    });
                                }
                                else if (encoding === 'deflate') {
                                    zlib.inflate(dataAsBuffer, function (err, result) {
                                        if (err) {
                                            reject(err);
                                        }
                                        dataAsBuffer = result;
                                        handleEncoding();
                                    });
                                }
                                else {
                                    reject(new Error('Unsupported content encoding, ' + encoding));
                                }
                            }
                            else {
                                data.data = dataAsBuffer;
                                resolve(message);
                            }
                        };
                        handleEncoding();
                    });
                });
            }, () => {
                request.abort();
            });
            const data = {
                task,
                buffer: [],
                data: Buffer.alloc(0),
                size: 0,
                used: false,
                url: url,
                requestOptions: options,
                nativeResponse: message,
                downloadObservable: new Observable((observer) => downloadSubscriptionPool.add(observer)),
                dataObservable: new Observable((observer) => dataSubscriptionPool.add(observer))
            };
            dataMap.set(response, data);
            resolve(response);
        });
        request.once('error', reject);
        if (options.bodyStream) {
            options.bodyStream.pipe(request);
            let uploadedSize = 0;
            options.bodyStream.on('data', (chunk) => {
                uploadedSize += chunk.length;
                uploadObserverPool.next(uploadedSize);
            });
            options.bodyStream.on('end', () => {
                uploadObserverPool.complete();
                request.end();
            });
        }
        else if (options.body) {
            const body = options.body.toString();
            request.on('response', () => {
                uploadObserverPool.next(body.length);
            });
            request.end(body);
        }
        else {
            request.end();
        }
        if (options.timeout && options.timeout > 0 && options.timeout !== Infinity) {
            timeoutHandle = createTimer(() => {
                timeoutReject && timeoutReject(new TimeoutError('The request timed out'));
            }, options.timeout);
        }
    }, () => {
        request.abort();
    }).catch(function (error) {
        const parsedUrl = urlUtil.parse(url);
        if (parsedUrl.auth) {
            parsedUrl.auth = '(redacted)';
        }
        const sanitizedUrl = urlUtil.format(parsedUrl);
        error.message = '[' + requestOptions.method + ' ' + sanitizedUrl + '] ' + error.message;
        throw error;
    });
    requestTask.upload = new Observable((observer) => uploadObserverPool.add(observer));
    return requestTask;
}
//# sourceMappingURL=node.mjs.map