/**
 * http lib
 * @author vfasky<vfasky@gmail.com>
 * 
 **/
'use strict'

import { setOptonsDefault, param } from './util'
import { HttpOptions, Response } from './types'
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
            progress: function () { }
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

    buildUrl() {
        return this.options.baseURL + this.options.url
    }

    buildData() {
        let sendData = param(this.options.data)

        return sendData
    }

    send(): Promise<Response> {
        this.buildHeaders()
        this.buildMethod()
        
        let timeout = this.options.timeout
        let method = this.method
        let body = this.buildData()
        let url = this.buildUrl()
        let headers = this.headers

        if (buildUrlMemthods.indexOf(this.method) !== -1) {
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

            }, this.options.progress)
        })
    }

    static config = {
        timeout: 1000,
        baseURL: '',
        headers: {}
    }

    static _instance: Http

    static buildMethod(method, url, data = {}, options: HttpOptions = {}, instance?: Http) {
        
        if (!instance) {
            if (!this._instance) {
                setOptonsDefault(options, this.config)
                this._instance = new this(options)
            }
            instance = this._instance
       
        }
        Object.keys(options).forEach((key) => {
            instance.options[key] = options[key]
        })
        instance.options.method = method
        instance.options.data = data
        instance.options.url = url
        return instance.send()
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