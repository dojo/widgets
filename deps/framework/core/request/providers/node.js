(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "../../../shim/Set", "../../../shim/WeakMap", "http", "https", "url", "zlib", "../../async/Task", "../../lang", "../../queue", "../../util", "../Headers", "../Response", "../TimeoutError", "../../Observable", "../SubscriptionPool"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var Set_1 = require("../../../shim/Set");
    var WeakMap_1 = require("../../../shim/WeakMap");
    var http = require("http");
    var https = require("https");
    var urlUtil = require("url");
    var zlib = require("zlib");
    var Task_1 = require("../../async/Task");
    var lang_1 = require("../../lang");
    var queue_1 = require("../../queue");
    var util_1 = require("../../util");
    var Headers_1 = require("../Headers");
    var Response_1 = require("../Response");
    var TimeoutError_1 = require("../TimeoutError");
    var Observable_1 = require("../../Observable");
    var SubscriptionPool_1 = require("../SubscriptionPool");
    // TODO: This should be read from the package and not hard coded!
    var version = '2.0.0-pre';
    /**
     * If not overridden, redirects will only be processed this many times before aborting (per request).
     * @type {number}
     */
    var DEFAULT_REDIRECT_LIMIT = 15;
    var dataMap = new WeakMap_1.default();
    var discardedDuplicates = new Set_1.default([
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
        var data = dataMap.get(response);
        if (data.used) {
            return Task_1.default.reject(new TypeError('Body already read'));
        }
        data.used = true;
        return data.task.then(function (_) { return data; });
    }
    /**
     * Turn a node native response object into something that resembles the fetch api
     */
    var NodeResponse = /** @class */ (function (_super) {
        tslib_1.__extends(NodeResponse, _super);
        function NodeResponse(response) {
            var _this = _super.call(this) || this;
            _this.downloadBody = true;
            var headers = (_this.headers = new Headers_1.default());
            var _loop_1 = function (key) {
                var value = response.headers[key];
                if (value) {
                    if (discardedDuplicates.has(key) && !Array.isArray(value)) {
                        headers.append(key, value);
                    }
                    (Array.isArray(value) ? value : value.split(/\s*,\s*/)).forEach(function (v) {
                        headers.append(key, v);
                    });
                }
            };
            for (var key in response.headers) {
                _loop_1(key);
            }
            _this.status = response.statusCode || 0;
            _this.ok = _this.status >= 200 && _this.status < 300;
            _this.statusText = response.statusMessage || '';
            return _this;
        }
        Object.defineProperty(NodeResponse.prototype, "bodyUsed", {
            get: function () {
                return dataMap.get(this).used;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeResponse.prototype, "nativeResponse", {
            get: function () {
                return dataMap.get(this).nativeResponse;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeResponse.prototype, "requestOptions", {
            get: function () {
                return dataMap.get(this).requestOptions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeResponse.prototype, "url", {
            get: function () {
                return dataMap.get(this).url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeResponse.prototype, "download", {
            get: function () {
                return dataMap.get(this).downloadObservable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeResponse.prototype, "data", {
            get: function () {
                return dataMap.get(this).dataObservable;
            },
            enumerable: true,
            configurable: true
        });
        NodeResponse.prototype.arrayBuffer = function () {
            return getDataTask(this).then(function (data) {
                if (data) {
                    return data.data;
                }
                return new Buffer([]);
            });
        };
        NodeResponse.prototype.blob = function () {
            // Node doesn't support Blobs
            return Task_1.default.reject(new Error('Blob not supported'));
        };
        NodeResponse.prototype.formData = function () {
            return Task_1.default.reject(new Error('FormData not supported'));
        };
        NodeResponse.prototype.text = function () {
            return getDataTask(this).then(function (data) {
                return String(data ? data.data : '');
            });
        };
        return NodeResponse;
    }(Response_1.default));
    exports.NodeResponse = NodeResponse;
    function redirect(resolve, reject, originalUrl, redirectUrl, options) {
        if (!options.redirectOptions) {
            options.redirectOptions = {};
        }
        var _a = options.redirectOptions, _b = _a.limit, redirectLimit = _b === void 0 ? DEFAULT_REDIRECT_LIMIT : _b, _c = _a.count, redirectCount = _c === void 0 ? 0 : _c;
        var _d = options.followRedirects, followRedirects = _d === void 0 ? true : _d;
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
            reject(new Error("too many redirects, limit reached at " + redirectLimit));
            return true;
        }
        options.redirectOptions.count = redirectCount + 1;
        // we wrap the url in a call to node's URL.resolve which will handle relative and partial
        // redirects (like "/another-page" on the same domain).
        resolve(node(urlUtil.resolve(originalUrl, redirectUrl), options));
        return true;
    }
    function getAuth(proxyAuth, options) {
        if (proxyAuth) {
            return proxyAuth;
        }
        if (options.user || options.password) {
            return (options.user || '') + ":" + (options.password || '');
        }
        return undefined;
    }
    exports.getAuth = getAuth;
    function node(url, options) {
        if (options === void 0) { options = {}; }
        var parsedUrl = urlUtil.parse(options.proxy || url);
        var requestOptions = {
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
            .map(function (headerName) { return headerName.toLowerCase(); })
            .some(function (headerName) { return headerName === 'user-agent'; })) {
            requestOptions.headers['user-agent'] = 'dojo/' + version + ' Node.js/' + process.version.replace(/^v/, '');
        }
        if (options.proxy) {
            requestOptions.path = url;
            if (parsedUrl.auth) {
                requestOptions.headers['proxy-authorization'] = 'Basic ' + new Buffer(parsedUrl.auth).toString('base64');
            }
            var parsedProxyUrl = urlUtil.parse(url);
            if (parsedProxyUrl.host) {
                requestOptions.headers['host'] = parsedProxyUrl.host;
            }
            if (parsedProxyUrl.auth) {
                requestOptions.auth = parsedProxyUrl.auth;
            }
        }
        var _a = options.acceptCompression, acceptCompression = _a === void 0 ? true : _a;
        if (acceptCompression) {
            requestOptions.headers['Accept-Encoding'] = 'gzip, deflate';
        }
        var request = parsedUrl.protocol === 'https:' ? https.request(requestOptions) : http.request(requestOptions);
        var uploadObserverPool = new SubscriptionPool_1.default();
        var requestTask = new Task_1.default(function (resolve, reject) {
            var timeoutHandle;
            var timeoutReject = reject;
            if (options.socketOptions) {
                if (options.socketOptions.timeout) {
                    request.setTimeout(options.socketOptions.timeout);
                }
                if ('noDelay' in options.socketOptions) {
                    request.setNoDelay(options.socketOptions.noDelay);
                }
                if ('keepAlive' in options.socketOptions) {
                    var initialDelay = options.socketOptions.keepAlive;
                    if (initialDelay !== undefined) {
                        request.setSocketKeepAlive(initialDelay >= 0, initialDelay);
                    }
                }
            }
            request.once('response', function (message) {
                var response = new NodeResponse(message);
                // Redirection handling defaults to true in order to harmonise with the XHR provider, which will always
                // follow redirects
                if (response.status >= 300 && response.status < 400) {
                    var redirectOptions = options.redirectOptions || {};
                    var newOptions = lang_1.deepAssign({}, options);
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
                var downloadSubscriptionPool = new SubscriptionPool_1.default();
                var dataSubscriptionPool = new SubscriptionPool_1.default();
                /*
             [RFC 2616](https://tools.ietf.org/html/rfc2616#page-118) says that content-encoding can have multiple
             values, so we split them here and put them in a list to process later.
             */
                var contentEncodings = response.headers.getAll('content-encoding');
                var task = new Task_1.default(function (resolve, reject) {
                    timeoutReject = reject;
                    // we queue this up for later to allow listeners to register themselves before we start receiving data
                    queue_1.queueTask(function () {
                        /*
                 * Note that this is the raw data, if your input stream is zipped, and you are piecing
                 * together the downloaded data, you'll have to decompress it yourself
                 */
                        message.on('data', function (chunk) {
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
                        message.once('end', function () {
                            timeoutHandle && timeoutHandle.destroy();
                            var dataAsBuffer = options.streamEncoding
                                ? new Buffer(data.buffer.join(''), 'utf8')
                                : Buffer.concat(data.buffer, data.size);
                            var handleEncoding = function () {
                                /*
                         Content encoding is ordered by the order in which they were applied to the
                         content, so do undo the encoding we have to start at the end and work backwards.
                         */
                                if (contentEncodings.length) {
                                    var encoding = contentEncodings.pop().trim().toLowerCase();
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
                }, function () {
                    request.abort();
                });
                var data = {
                    task: task,
                    buffer: [],
                    data: Buffer.alloc(0),
                    size: 0,
                    used: false,
                    url: url,
                    requestOptions: options,
                    nativeResponse: message,
                    downloadObservable: new Observable_1.default(function (observer) { return downloadSubscriptionPool.add(observer); }),
                    dataObservable: new Observable_1.default(function (observer) { return dataSubscriptionPool.add(observer); })
                };
                dataMap.set(response, data);
                resolve(response);
            });
            request.once('error', reject);
            if (options.bodyStream) {
                options.bodyStream.pipe(request);
                var uploadedSize_1 = 0;
                options.bodyStream.on('data', function (chunk) {
                    uploadedSize_1 += chunk.length;
                    uploadObserverPool.next(uploadedSize_1);
                });
                options.bodyStream.on('end', function () {
                    uploadObserverPool.complete();
                    request.end();
                });
            }
            else if (options.body) {
                var body_1 = options.body.toString();
                request.on('response', function () {
                    uploadObserverPool.next(body_1.length);
                });
                request.end(body_1);
            }
            else {
                request.end();
            }
            if (options.timeout && options.timeout > 0 && options.timeout !== Infinity) {
                timeoutHandle = util_1.createTimer(function () {
                    timeoutReject && timeoutReject(new TimeoutError_1.default('The request timed out'));
                }, options.timeout);
            }
        }, function () {
            request.abort();
        }).catch(function (error) {
            var parsedUrl = urlUtil.parse(url);
            if (parsedUrl.auth) {
                parsedUrl.auth = '(redacted)';
            }
            var sanitizedUrl = urlUtil.format(parsedUrl);
            error.message = '[' + requestOptions.method + ' ' + sanitizedUrl + '] ' + error.message;
            throw error;
        });
        requestTask.upload = new Observable_1.default(function (observer) { return uploadObserverPool.add(observer); });
        return requestTask;
    }
    exports.default = node;
});
//# sourceMappingURL=node.js.map