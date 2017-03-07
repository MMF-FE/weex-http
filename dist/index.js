module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * http lib
	 * @author vfasky<vfasky@gmail.com>
	 *
	 **/
	'use strict';
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
	    return { next: verb(0), "throw": verb(1), "return": verb(2) };
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = __webpack_require__(1);
	var stream = weex.requireModule('stream');
	var methods = ['GET', 'DELETE', 'HEAD', 'POST', 'PUT', 'PATCH'];
	var buildUrlMemthods = ['POST', 'PUT', 'PATCH'];
	var Http = (function () {
	    function Http(options) {
	        this.options = util_1.setOptonsDefault(options, {
	            timeout: 10000,
	            headers: {},
	            baseURL: '',
	            method: 'GET',
	            data: {},
	            url: '/',
	            progress: function () { },
	            transformRequest: [],
	            transformResponse: [],
	            transformHeaders: []
	        });
	    }
	    Http.prototype.buildHeaders = function () {
	        this.headers = util_1.setOptonsDefault(this.options.headers, {
	            'Content-Type': 'application/x-www-form-urlencoded'
	        });
	    };
	    Http.prototype.buildMethod = function () {
	        var method = String(this.options.method).trim().toLocaleUpperCase();
	        if (methods.indexOf(method) === -1) {
	            throw new Error(method + " not in " + methods.join(', '));
	        }
	        this.method = method;
	    };
	    Http.prototype.buildUrl = function (options) {
	        return (options.hasOwnProperty('baseURL') ? options.baseURL : this.options.baseURL) +
	            this.options.url;
	    };
	    Http.prototype.buildData = function (options) {
	        return __awaiter(this, void 0, void 0, function () {
	            var sendData;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.callPromise('transformRequest', options, this.options.data)];
	                    case 1:
	                        _a.sent();
	                        sendData = util_1.param(this.options.data);
	                        return [2 /*return*/, sendData];
	                }
	            });
	        });
	    };
	    Http.prototype.callPromise = function (funStr, options, data) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            return __generator(this, function (_a) {
	                if (Array.isArray(this.options[funStr])) {
	                    this.options[funStr].forEach(function (promise) { return __awaiter(_this, void 0, void 0, function () {
	                        return __generator(this, function (_a) {
	                            switch (_a.label) {
	                                case 0: return [4 /*yield*/, promise(data)];
	                                case 1:
	                                    _a.sent();
	                                    return [2 /*return*/];
	                            }
	                        });
	                    }); });
	                }
	                if (Array.isArray(options[funStr])) {
	                    options[funStr].forEach(function (promise) { return __awaiter(_this, void 0, void 0, function () {
	                        return __generator(this, function (_a) {
	                            switch (_a.label) {
	                                case 0: return [4 /*yield*/, promise(data)];
	                                case 1:
	                                    _a.sent();
	                                    return [2 /*return*/];
	                            }
	                        });
	                    }); });
	                }
	                return [2 /*return*/];
	            });
	        });
	    };
	    Http.prototype.send = function (options) {
	        return __awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            var timeout, method, body, url, headers, link;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this.buildHeaders();
	                        this.buildMethod();
	                        timeout = options.hasOwnProperty('timeout') ? options.timeout : this.options.timeout;
	                        method = this.method;
	                        return [4 /*yield*/, this.buildData(options)];
	                    case 1:
	                        body = _a.sent();
	                        url = this.buildUrl(options);
	                        headers = JSON.parse(JSON.stringify(this.headers));
	                        if (options.headers) {
	                            Object.keys(options.headers).forEach(function (key) {
	                                headers[key] = options.headers[key];
	                            });
	                        }
	                        return [4 /*yield*/, this.callPromise('transformHeaders', options, headers)];
	                    case 2:
	                        _a.sent();
	                        if (buildUrlMemthods.indexOf(this.method.toLocaleUpperCase()) === -1) {
	                            link = url.indexOf('?') === -1 ? '?' : '&';
	                            url += link + body;
	                            body = '';
	                        }
	                        return [2 /*return*/, new Promise(function (resolve, reject) {
	                                var isReturn = false;
	                                var timeoutId = setTimeout(function () {
	                                    isReturn = true;
	                                    reject({
	                                        status: 0,
	                                        ok: false,
	                                        statusText: 'TIMEOUT',
	                                        data: 'TIMEOUT',
	                                        headers: {}
	                                    });
	                                }, timeout);
	                                stream.fetch({
	                                    method: method,
	                                    body: body,
	                                    url: url,
	                                    headers: headers,
	                                    type: 'text'
	                                }, function (response) {
	                                    if (isReturn)
	                                        return;
	                                    clearTimeout(timeoutId);
	                                    if (response.ok) {
	                                        resolve(response);
	                                    }
	                                    else {
	                                        reject(response);
	                                    }
	                                }, function (args) {
	                                    _this.options.progress(args);
	                                });
	                            }).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
	                                return __generator(this, function (_a) {
	                                    switch (_a.label) {
	                                        case 0: return [4 /*yield*/, this.callPromise('transformResponse', options, response)];
	                                        case 1:
	                                            _a.sent();
	                                            return [2 /*return*/, response];
	                                    }
	                                });
	                            }); })];
	                }
	            });
	        });
	    };
	    Object.defineProperty(Http, "config", {
	        get: function () {
	            return this._config;
	        },
	        set: function (options) {
	            var _this = this;
	            Object.keys(options).forEach(function (key) {
	                _this._config[key] = options[key];
	                if (_this._instance) {
	                    _this._instance.options[key] = options[key];
	                }
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Http.buildMethod = function (method, url, data, options, instance) {
	        if (data === void 0) { data = {}; }
	        if (options === void 0) { options = {}; }
	        if (!instance) {
	            if (!this._instance) {
	                this._instance = new this(this.config);
	            }
	            instance = this._instance;
	        }
	        instance.options.method = method;
	        instance.options.data = data;
	        instance.options.url = url;
	        return instance.send(options);
	    };
	    Http.create = function (options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        var instance = new this(options);
	        var func = {
	            instance: instance
	        };
	        methods.forEach(function (method) {
	            func[method.toLocaleLowerCase()] = function (url, data, options) {
	                if (data === void 0) { data = {}; }
	                return _this.buildMethod(method, url, data, options, instance);
	            };
	        });
	        return func;
	    };
	    Http.get = function (url, data, options) {
	        if (data === void 0) { data = {}; }
	        return this.buildMethod('GET', url, data, options);
	    };
	    Http.post = function (url, data, options) {
	        if (data === void 0) { data = {}; }
	        return this.buildMethod('POST', url, data, options);
	    };
	    Http.delete = function (url, data, options) {
	        if (data === void 0) { data = {}; }
	        return this.buildMethod('DELETE', url, data, options);
	    };
	    Http.head = function (url, data, options) {
	        if (data === void 0) { data = {}; }
	        return this.buildMethod('HEAD', url, data, options);
	    };
	    Http.put = function (url, data, options) {
	        if (data === void 0) { data = {}; }
	        return this.buildMethod('PUT', url, data, options);
	    };
	    Http.patch = function (url, data, options) {
	        if (data === void 0) { data = {}; }
	        return this.buildMethod('PATCH', url, data, options);
	    };
	    return Http;
	}());
	Http._config = {
	    timeout: 10000,
	    baseURL: '',
	    headers: {}
	};
	exports.default = Http;


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * util
	 * @author vfasky<vfasky@gmail.com>
	 *
	 **/
	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var rbracket = /\[\]$/;
	function buildParams(prefix, obj, add) {
	    var name;
	    if (Array.isArray(obj)) {
	        // Serialize array item.
	        obj.forEach(function (v, i) {
	            if (rbracket.test(prefix)) {
	                // Treat each array item as a scalar.
	                add(prefix, v);
	            }
	            else {
	                // Item is non-scalar (array or object), encode its numeric index.
	                buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, add);
	            }
	        });
	    }
	    else if (typeof obj === "object") {
	        // Serialize object item.
	        for (name in obj) {
	            buildParams(prefix + "[" + name + "]", obj[name], add);
	        }
	    }
	    else {
	        // Serialize scalar item.
	        add(prefix, obj);
	    }
	}
	function setOptonsDefault(options, defaultVals) {
	    if (options === void 0) { options = {}; }
	    if (defaultVals === void 0) { defaultVals = {}; }
	    Object.keys(defaultVals).forEach(function (key) {
	        if (!options.hasOwnProperty(key)) {
	            options[key] = defaultVals[key];
	        }
	    });
	    return options;
	}
	exports.setOptonsDefault = setOptonsDefault;
	function isFunction(obj) {
	    return !!(obj && obj.constructor && obj.call && obj.apply);
	}
	exports.isFunction = isFunction;
	function param(a) {
	    if (a === void 0) { a = {}; }
	    var prefix;
	    var s = [];
	    var add = function (key, valueOrFunction) {
	        // If value is a function, invoke it and use its return value
	        var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
	        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
	    };
	    for (prefix in a) {
	        buildParams(prefix, a[prefix], add);
	    }
	    // Return the resulting serialization
	    return s.join("&");
	}
	exports.param = param;


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map