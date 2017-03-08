import { HttpOptions, Response, HttpConfig } from './types';
export default class Http {
    options: HttpOptions;
    headers: {
        [key: string]: string;
    };
    method: string;
    url: string;
    constructor(options: HttpOptions);
    buildHeaders(): void;
    buildMethod(): void;
    buildUrl(options: any): string;
    clone(data: any): any;
    buildData(options: any): Promise<string>;
    callPromise(funStr: string, options: HttpOptions, data: any): Promise<any>;
    send(options: HttpConfig): Promise<{}>;
    static _config: HttpConfig;
    static config: HttpConfig;
    static _instance: Http;
    static buildMethod(method: any, url: any, data?: {}, options?: HttpOptions, instance?: Http): Promise<{}>;
    static create(options?: HttpOptions): {
        get(url, data?, options?: HttpOptions): Promise<Response>;
        post(url, data?, options?: HttpOptions): Promise<Response>;
        put(url, data?, options?: HttpOptions): Promise<Response>;
        path(url, data?, options?: HttpOptions): Promise<Response>;
        delete(url, data?, options?: HttpOptions): Promise<Response>;
        head(url, data?, options?: HttpOptions): Promise<Response>;
        instance: Http;
    };
    static get(url: any, data?: {}, options?: HttpOptions): Promise<{}>;
    static post(url: any, data?: {}, options?: HttpOptions): Promise<{}>;
    static delete(url: any, data?: {}, options?: HttpOptions): Promise<{}>;
    static head(url: any, data?: {}, options?: HttpOptions): Promise<{}>;
    static put(url: any, data?: {}, options?: HttpOptions): Promise<{}>;
    static patch(url: any, data?: {}, options?: HttpOptions): Promise<{}>;
}
