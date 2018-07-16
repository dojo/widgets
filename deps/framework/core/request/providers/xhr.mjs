import global from '../../../shim/global';
import WeakMap from '../../../shim/WeakMap';
import Task from '../../async/Task';
import has from '../../has';
import Observable from '../../Observable';
import { createTimer } from '../../util';
import Headers from '../Headers';
import Response, { getArrayBufferFromBlob, getTextFromBlob } from '../Response';
import SubscriptionPool from '../SubscriptionPool';
import TimeoutError from '../TimeoutError';
import { generateRequestUrl } from '../util';
const dataMap = new WeakMap();
function getDataTask(response) {
    const data = dataMap.get(response);
    if (data.used) {
        return Task.reject(new TypeError('Body already read'));
    }
    data.used = true;
    return data.task;
}
/**
 * Wraps an XHR request in a response that mimics the fetch API
 */
export class XhrResponse extends Response {
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
    constructor(request) {
        super();
        const headers = (this.headers = new Headers());
        const responseHeaders = request.getAllResponseHeaders();
        if (responseHeaders) {
            const lines = responseHeaders.split(/\r\n/g);
            for (let i = 0; i < lines.length; i++) {
                const match = lines[i].match(/^(.*?): (.*)$/);
                if (match) {
                    headers.append(match[1], match[2]);
                }
            }
        }
        this.status = request.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = request.statusText || 'OK';
    }
    arrayBuffer() {
        return Task.reject(new Error('ArrayBuffer not supported'));
    }
    blob() {
        return Task.reject(new Error('Blob not supported'));
    }
    formData() {
        return Task.reject(new Error('FormData not supported'));
    }
    text() {
        return getDataTask(this).then((request) => {
            return String(request.responseText);
        });
    }
    xml() {
        return this.text().then((text) => {
            const parser = new DOMParser();
            const contentType = this.headers.get('content-type');
            return parser.parseFromString(text, contentType ? contentType.split(';')[0] : 'text/html');
        });
    }
}
if (has('blob')) {
    XhrResponse.prototype.blob = function () {
        return getDataTask(this).then((request) => request.response);
    };
    XhrResponse.prototype.text = function () {
        return this.blob().then(getTextFromBlob);
    };
    if (has('arraybuffer')) {
        XhrResponse.prototype.arrayBuffer = function () {
            return this.blob().then(getArrayBufferFromBlob);
        };
    }
}
if (has('formdata')) {
    XhrResponse.prototype.formData = function () {
        return this.text().then((text) => {
            const data = new FormData();
            text
                .trim()
                .split('&')
                .forEach((keyValues) => {
                if (keyValues) {
                    const pairs = keyValues.split('=');
                    const name = (pairs.shift() || '').replace(/\+/, ' ');
                    const value = pairs.join('=').replace(/\+/, ' ');
                    data.append(decodeURIComponent(name), decodeURIComponent(value));
                }
            });
            return data;
        });
    };
}
function noop() { }
function setOnError(request, reject) {
    request.addEventListener('error', function (event) {
        reject(new TypeError(event.error || 'Network request failed'));
    });
}
export default function xhr(url, options = {}) {
    const request = new XMLHttpRequest();
    const requestUrl = generateRequestUrl(url, options);
    options = Object.create(options);
    if (!options.method) {
        options.method = 'GET';
    }
    let isAborted = false;
    function abort() {
        isAborted = true;
        if (request) {
            request.abort();
            request.onreadystatechange = noop;
        }
    }
    let timeoutHandle;
    let timeoutReject;
    const task = new Task((resolve, reject) => {
        timeoutReject = reject;
        request.onreadystatechange = function () {
            if (isAborted) {
                return;
            }
            if (request.readyState === 2) {
                const response = new XhrResponse(request);
                const downloadSubscriptionPool = new SubscriptionPool();
                const dataSubscriptionPool = new SubscriptionPool();
                const task = new Task((resolve, reject) => {
                    timeoutReject = reject;
                    request.onprogress = function (event) {
                        if (isAborted) {
                            return;
                        }
                        downloadSubscriptionPool.next(event.loaded);
                    };
                    request.onreadystatechange = function () {
                        if (isAborted) {
                            return;
                        }
                        if (request.readyState === 4) {
                            request.onreadystatechange = noop;
                            timeoutHandle && timeoutHandle.destroy();
                            dataSubscriptionPool.next(request.response);
                            dataSubscriptionPool.complete();
                            resolve(request);
                        }
                    };
                    setOnError(request, reject);
                }, abort);
                dataMap.set(response, {
                    task,
                    used: false,
                    nativeResponse: request,
                    requestOptions: options,
                    url: requestUrl,
                    downloadObservable: new Observable((observer) => downloadSubscriptionPool.add(observer)),
                    dataObservable: new Observable((observer) => dataSubscriptionPool.add(observer))
                });
                resolve(response);
            }
        };
        setOnError(request, reject);
    }, abort);
    request.open(options.method, requestUrl, !options.blockMainThread, options.user, options.password);
    if (has('filereader') && has('blob')) {
        request.responseType = 'blob';
    }
    if (options.timeout && options.timeout > 0 && options.timeout !== Infinity) {
        timeoutHandle = createTimer(() => {
            // Reject first, since aborting will also fire onreadystatechange which would reject with a
            // less specific error.  (This is also why we set up our own timeout rather than using
            // native timeout and ontimeout, because that aborts and fires onreadystatechange before ontimeout.)
            timeoutReject && timeoutReject(new TimeoutError('The XMLHttpRequest request timed out'));
            abort();
        }, options.timeout);
    }
    let hasContentTypeHeader = false;
    let hasRequestedWithHeader = false;
    const { includeRequestedWithHeader = true, includeUploadProgress = true } = options;
    if (options.headers) {
        const requestHeaders = new Headers(options.headers);
        hasRequestedWithHeader = requestHeaders.has('x-requested-with');
        hasContentTypeHeader = requestHeaders.has('content-type');
        for (const [key, value] of requestHeaders) {
            request.setRequestHeader(key, value);
        }
    }
    if (!hasRequestedWithHeader && includeRequestedWithHeader) {
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }
    if (!hasContentTypeHeader && has('formdata') && options.body instanceof global.FormData) {
        // Assume that most forms do not contain large binary files. If that is not the case,
        // then "multipart/form-data" should be manually specified as the "Content-Type" header.
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    task.finally(() => {
        if (task.state !== 0 /* Fulfilled */) {
            request.onreadystatechange = noop;
            timeoutHandle && timeoutHandle.destroy();
        }
    });
    if (includeUploadProgress) {
        const uploadObserverPool = new SubscriptionPool();
        task.upload = new Observable((observer) => uploadObserverPool.add(observer));
        if (has('host-browser') || has('web-worker-xhr-upload')) {
            request.upload.addEventListener('progress', (event) => {
                uploadObserverPool.next(event.loaded);
            });
        }
    }
    request.send(options.body || null);
    return task;
}
//# sourceMappingURL=xhr.mjs.map