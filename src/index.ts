/**
 * http lib
 * @author vfasky<vfasky@gmail.com>
 *
 **/
'use strict'

import { setOptonsDefault, param } from './util'
import { HttpOptions, Response, HttpConfig } from './types'
var stream = weex.requireModule('stream')

const methods = ['GET', 'DELETE', 'HEAD', 'POST', 'PUT', 'PATCH']
const buildUrlMemthods = ['POST', 'PUT', 'PATCH']
const platform = weex.config.env.platform.toLocaleLowerCase()
const is = {
    web: platform === 'web',
    android: platform === 'android',
    iOS: platform === 'ios',
    ios: platform === 'ios',
    wechat: platform === 'web' && (/micromessenger/i).test(navigator.userAgent)
}

export default class Http {
    options: HttpOptions
    headers: {
        [key: string]: string
    }
    method: string
    url: string

    constructor(options: HttpOptions) {
        this.options = setOptonsDefault(options, {
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
        })

    }

    getHeaders() {
        return this.clone(setOptonsDefault(this.options.headers, {
            'Content-Type': 'application/x-www-form-urlencoded'
        }))
    }

    getMethod(options) {
        let method = String(options.method).trim().toLocaleUpperCase()
        if (methods.indexOf(method) === -1) {
            throw new Error(`${method} not in ${methods.join(', ')}`)
        }
        return method
    }

    buildUrl(options) {
        return (options.hasOwnProperty('baseURL') ? options.baseURL : this.options.baseURL) +
            options.url
    }

    clone(data) {
        return JSON.parse(JSON.stringify(data))
    }

    async buildData(options) {
        let data = this.clone(options.data)
        await this.callPromise('transformRequest', options, data)

        let sendData = param(data)

        return sendData
    }

    async callPromise(funStr: string, options: HttpOptions, data) {
        if (Array.isArray(this.options[funStr])) {
            await Promise.all(this.options[funStr].map((promise) => {
                return promise(data)
            }))
        }

        if (Array.isArray(options[funStr])) {
            await Promise.all(options[funStr].map((promise) => {
                return promise(data)
            }))
        }

        return data
    }

    async send(options: HttpConfig) {

        let timeout = options.hasOwnProperty('timeout') ? options.timeout : this.options.timeout
        let method = this.getMethod(options)
        let body = await this.buildData(options)
        let url = this.buildUrl(options)
        let headers = this.getHeaders()

        if (options.headers) {
            Object.keys(options.headers).forEach((key) => {
                headers[key] = options.headers[key]
            })
        }
        await this.callPromise('transformHeaders', options, headers)
        let isSend = true
        if (buildUrlMemthods.indexOf(method.toLocaleUpperCase()) === -1) {
            let link = url.indexOf('?') === -1 ? '?' : '&'
            url += link + body
            body = ''
            isSend = false
        }
        return new Promise((resolve: Function, reject: Function) => {
            let isReturn = false
            let timeoutId = setTimeout(() => {
                isReturn = true
                reject({
                    status: 0,
                    ok: false,
                    statusText: 'TIMEOUT',
                    data: 'TIMEOUT',
                    headers: {}
                })
            }, timeout)

            // ios8 wechat back bug
            if (is.wechat) {
                let deviceAgent = navigator.userAgent.toLowerCase()
                let isIos8 = /(iphone|ipod|ipad).* os 8_/.test(deviceAgent)

                let xhr = new XMLHttpRequest()

                let xhrDone = function () {
                    clearTimeout(timeoutId)
                    if (isReturn) return
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve({
                            status: xhr.status,
                            ok: true,
                            statusText: xhr.statusText,
                            data: xhr.responseText,
                            headers: {}
                        })
                    }
                }

                let xhrOnChange = function () {
                    if (xhr.readyState == 4) {
                        // 微信你大爷
                        if (!xhr.status && isIos8) {
                            let key = '__weex_http'
                            let lastReloadDate = localStorage.getItem(key)
                            let now = Date.now()
                            if (lastReloadDate == null || now - Number(lastReloadDate) > 5000) {
                                localStorage.setItem(key, String(now))
                                window.location.reload()
                            }

                            return
                        }
                        xhrDone()
                    }
                }
                xhr.onreadystatechange = xhrOnChange
                xhr.open(method, url, true)
                Object.keys(headers).forEach((key) => {
                    xhr.setRequestHeader(key, headers[key])
                })

                xhr.send(body)
            } else {
                stream.fetch({
                    method,
                    body,
                    url,
                    headers,
                    type: 'text'
                }, (response: Response) => {
                    clearTimeout(timeoutId)
                    if (isReturn) return

                    if (response.ok) {
                        resolve(response)
                    } else {
                        reject(response)
                    }

                }, (args) => {
                    this.options.progress(args)
                })
            }
        }).then(async (response: Response) => {
            await this.callPromise('transformResponse', options, response)

            return response
        })
    }

    static _config: HttpConfig = {
        timeout: 10000,
        baseURL: '',
        headers: {}
    }

    static get config() {
        return this._config
    }

    static set config(options: HttpConfig) {
        Object.keys(options).forEach((key) => {
            this._config[key] = options[key]
            if (this._instance) {
                this._instance.options[key] = options[key]
            }
        })
    }

    static _instance: Http

    static buildMethod(method, url, data = {}, options: HttpOptions = {}, instance?: Http) {

        if (!instance) {
            if (!this._instance) {
                this._instance = new this(this.config)
            }
            instance = this._instance

        }

        options.method = method
        options.data = data
        options.url = url

        return instance.send(options)

    }

    static create(options: HttpOptions = {}): {
        get(url, data?, options?: HttpOptions): Promise<Response>
        post(url, data?, options?: HttpOptions): Promise<Response>
        put(url, data?, options?: HttpOptions): Promise<Response>
        path(url, data?, options?: HttpOptions): Promise<Response>
        delete(url, data?, options?: HttpOptions): Promise<Response>
        head(url, data?, options?: HttpOptions): Promise<Response>
        instance: Http
    } {
        let instance = new this(options)
        let func: any = {
            instance
        }

        methods.forEach((method) => {
            func[method.toLocaleLowerCase()] = (url, data = {}, options?: HttpOptions) => {
                return this.buildMethod(method, url, data, options, instance)
            }
        })

        return func
    }

    static get(url, data = {}, options?: HttpOptions) {
        return this.buildMethod('GET', url, data, options)
    }

    static post(url, data = {}, options?: HttpOptions) {
        return this.buildMethod('POST', url, data, options)
    }

    static delete(url, data = {}, options?: HttpOptions) {
        return this.buildMethod('DELETE', url, data, options)
    }

    static head(url, data = {}, options?: HttpOptions) {
        return this.buildMethod('HEAD', url, data, options)
    }

    static put(url, data = {}, options?: HttpOptions) {
        return this.buildMethod('PUT', url, data, options)
    }

    static patch(url, data = {}, options?: HttpOptions) {
        return this.buildMethod('PATCH', url, data, options)
    }
}