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
	            progress: function () { }
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
	    Http.prototype.buildData = function () {
	        var sendData = util_1.param(this.options.data);
	        return sendData;
	    };
	    Http.prototype.send = function (options) {
	        var _this = this;
	        this.buildHeaders();
	        this.buildMethod();
	        var timeout = options.hasOwnProperty('timeout') ? options.timeout : this.options.timeout;
	        var method = this.method;
	        var body = this.buildData();
	        var url = this.buildUrl(options);
	        var headers = JSON.parse(JSON.stringify(this.headers));
	        if (options.headers) {
	            Object.keys(options.headers).forEach(function (key) {
	                headers[key] = options.headers[key];
	            });
	        }
	        if (buildUrlMemthods.indexOf(this.method.toLocaleUpperCase()) === -1) {
	            var link = url.indexOf('?') === -1 ? '?' : '&';
	            url += link + body;
	            body = '';
	        }
	        return new Promise(function (resolve, reject) {
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