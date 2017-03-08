/**
 * types
 * @author vfasky<vfasky@gmail.com>
 *
 **/
export interface HttpOptions {
    timeout?: number;
    headers?: {
        [key: string]: string;
    };
    baseURL?: string;
    method?: string;
    data?: {
        [key: string]: any;
    };
    url?: string;
    transformRequest?: Function[];
    transformHeaders?: Function[];
    transformResponse?: Function[];
    progress?: Function;
}
export interface HttpConfig {
    timeout?: number;
    headers?: {
        [key: string]: string;
    };
    method?: string;
    data?: {
        [key: string]: any;
    };
    url?: string;
    transformRequest?: Function[];
    transformHeaders?: Function[];
    transformResponse?: Function[];
    baseURL?: string;
}
export interface Response {
    status: number;
    ok: boolean;
    statusText: string;
    data: string;
    headers: {
        [key: string]: string;
    };
}
