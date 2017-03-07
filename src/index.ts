/**
 * http lib
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import { setOptonsDefault, param } from './util'
import { HttpOptions, Response, HttpConfig } from './types'
const stream = weex.requireModule('stream')

const methods = ['GET', 'DELETE', 'HEAD', 'POST', 'PUT', 'PATCH']
const buildUrlMemthods = ['POST', 'PUT', 'PATCH']

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

    buildHeaders() {
        this.headers = setOptonsDefault(this.options.headers, {
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    }

    buildMethod() {
        let method = String(this.options.method).trim().toLocaleUpperCase()
        if (methods.indexOf(method) === -1) {
            throw new Error(`${method} not in ${methods.join(', ')}`)
        }
        this.method = method
    }

    buildUrl(options) {
        return (options.hasOwnProperty('baseURL') ? options.baseURL : this.options.baseURL) + 
               this.options.url
    }

    async buildData(options) {
        await this.callPromise('transformRequest', options, this.options.data)

        let sendData = param(this.options.data)

        return sendData
    }

    async callPromise(funStr: string, options: HttpOptions, data) {
        if (Array.isArray(this.options[funStr])) {
            this.options[funStr].forEach(async (promise) => {
                await promise(data)
            })
        }

        if (Array.isArray(options[funStr])) {
            options[funStr].forEach(async (promise) => {
                await promise(data)
            })
        }
    }

    async send(options: HttpConfig) {
        this.buildHeaders()
        this.buildMethod()
        
        let timeout = options.hasOwnProperty('timeout') ? options.timeout : this.options.timeout
        let method = this.method
        let body = await this.buildData(options)
        let url = this.buildUrl(options)
        let headers = JSON.parse(JSON.stringify(this.headers))

        if(options.headers) {
            Object.keys(options.headers).forEach((key) => {
                headers[key] = options.headers[key]
            })
        }
        await this.callPromise('transformHeaders', options, headers)

        if (buildUrlMemthods.indexOf(this.method.toLocaleUpperCase()) === -1) {
            let link = url.indexOf('?') === -1 ? '?' : '&'
            url += link + body
            body = ''
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

            stream.fetch({
                method,
                body,
                url,
                headers,
                type: 'text'
            }, (response: Response) => {
                if (isReturn) return
                clearTimeout(timeoutId)

                if (response.ok) {
                    resolve(response)
                } else {
                    reject(response)
                }

            }, (args) => {
                this.options.progress(args)
            })
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
            if(this._instance) {
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
        
        instance.options.method = method
        instance.options.data = data
        instance.options.url = url

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