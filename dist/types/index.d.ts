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
    buildData(): string;
    send(options: HttpConfig): Promise<Response>;
    static _config: HttpConfig;
    static config: HttpConfig;
    static _instance: Http;
    static buildMethod(method: any, url: any, data?: {}, options?: HttpOptions, instance?: Http): Promise<Response>;
    static create(options?: HttpOptions): {
        get(url, data?, options?: HttpOptions): Promise<Response>;
        post(url, data?, options?: HttpOptions): Promise<Response>;
        put(url, data?, options?: HttpOptions): Promise<Response>;
        path(url, data?, options?: HttpOptions): Promise<Response>;
        delete(url, data?, options?: HttpOptions): Promise<Response>;
        head(url, data?, options?: HttpOptions): Promise<Response>;
        instance: Http;
    };
    static get(url: any, data?: {}, options?: HttpOptions): Promise<Response>;
    static post(url: any, data?: {}, options?: HttpOptions): Promise<Response>;
    static delete(url: any, data?: {}, options?: HttpOptions): Promise<Response>;
    static head(url: any, data?: {}, options?: HttpOptions): Promise<Response>;
    static put(url: any, data?: {}, options?: HttpOptions): Promise<Response>;
    static patch(url: any, data?: {}, options?: HttpOptions): Promise<Response>;
}
