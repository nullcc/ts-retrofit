import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import FormData from "form-data";
import { DataResolverFactory } from "./dataResolver";
import { HttpMethod } from "./constants";
import { HttpMethodOptions } from "./decorators";
import { isNode } from "./util";
import { RetrofitHttpClient } from "./http.client";
import { ServiceBuilder } from "./service.builder";

axios.defaults.withCredentials = true;

export interface Response<T = any> extends AxiosResponse<T> {}
export const STUB_RESPONSE = <T>() => ({} as T);

const NON_HTTP_REQUEST_PROPERTY_NAME = "__nonHTTPRequestMethod__";

export const nonHTTPRequestMethod = (target: any, methodName: string) => {
  const descriptor = {
    value: true,
    writable: false,
  };
  Object.defineProperty(target[methodName], NON_HTTP_REQUEST_PROPERTY_NAME, descriptor);
};

export class BaseService {
  public __meta__: any;
  private _endpoint: string;
  private _httpClient: RetrofitHttpClient;
  private _methodMap: Map<string, Function>;
  private _timeout: number;

  constructor(serviceBuilder: ServiceBuilder) {
    this._endpoint = serviceBuilder.endpoint;
    this._httpClient = new RetrofitHttpClient(serviceBuilder);
    this._methodMap = new Map<string, Function>();
    this._timeout = serviceBuilder.timeout;

    const methodNames = this._getInstanceMethodNames();
    methodNames.forEach((methodName) => {
      this._methodMap[methodName] = this[methodName];
    });

    const self = this;
    for (const methodName of methodNames) {
      const descriptor = {
        enumerable: true,
        configurable: true,
        get(): Function {
          const method = self._methodMap[methodName];
          const methodOriginalDescriptor = Object.getOwnPropertyDescriptor(method, NON_HTTP_REQUEST_PROPERTY_NAME);
          if (methodOriginalDescriptor && methodOriginalDescriptor.value === true) {
            return method;
          }
          return (...args: any[]) => {
            return self._wrap(methodName, args);
          };
        },
      };
      Object.defineProperty(this, methodName, descriptor);
    }
  }

  @nonHTTPRequestMethod
  public isClientStandalone(): boolean {
    return this._httpClient.isStandalone();
  }

  @nonHTTPRequestMethod
  public useRequestInterceptor(interceptor: RequestInterceptorFunction): number {
    return this._httpClient.useRequestInterceptor(interceptor);
  }

  @nonHTTPRequestMethod
  public useResponseInterceptor(interceptor: ResponseInterceptorFunction): number {
    return this._httpClient.useResponseInterceptor(interceptor);
  }

  @nonHTTPRequestMethod
  public ejectRequestInterceptor(id: number): void {
    this._httpClient.ejectRequestInterceptor(id);
  }

  @nonHTTPRequestMethod
  public ejectResponseInterceptor(id: number): void {
    this._httpClient.ejectResponseInterceptor(id);
  }

  @nonHTTPRequestMethod
  public setEndpoint(endpoint: string): void {
    this._endpoint = endpoint;
  }

  @nonHTTPRequestMethod
  private _getInstanceMethodNames(): string[] {
    let properties: string[] = [];
    let obj = this;
    do {
      properties = properties.concat(Object.getOwnPropertyNames(obj));
      obj = Object.getPrototypeOf(obj);
    } while (obj);
    return properties.sort().filter((e, i, arr) => {
      return e !== arr[i + 1] && this[e] && typeof this[e] === "function";
    });
  }

  @nonHTTPRequestMethod
  private _wrap(methodName: string, args: any[]): Promise<Response> {
    const { url, method, headers, query, data } = this._resolveParameters(methodName, args);
    const config = this._makeConfig(methodName, url, method, headers, query, data);
    return this._httpClient.sendRequest(config);
  }

  @nonHTTPRequestMethod
  private _resolveParameters(methodName: string, args: any[]): any {
    const url = this._resolveUrl(methodName, args);
    const method = this._resolveHttpMethod(methodName);
    let headers = this._resolveHeaders(methodName, args);
    const query = this._resolveQuery(methodName, args);
    const data = this._resolveData(methodName, headers, args);
    if (headers["content-type"] && headers["content-type"].indexOf("multipart/form-data") !== -1 && isNode) {
      headers = { ...headers, ...(data as FormData).getHeaders() };
    }
    return { url, method, headers, query, data };
  }

  @nonHTTPRequestMethod
  private _makeConfig(
    methodName: string,
    url: string,
    method: HttpMethod,
    headers: any,
    query: any,
    data: any,
  ): AxiosRequestConfig {
    let config: AxiosRequestConfig = {
      url,
      method,
      headers,
      params: query,
      data,
    };
    // response type
    if (this.__meta__[methodName].responseType) {
      config.responseType = this.__meta__[methodName].responseType;
    }
    // request transformer
    if (this.__meta__[methodName].requestTransformer) {
      config.transformRequest = this.__meta__[methodName].requestTransformer;
    }
    // response transformer
    if (this.__meta__[methodName].responseTransformer) {
      config.transformResponse = this.__meta__[methodName].responseTransformer;
    }
    // timeout
    config.timeout = this.__meta__[methodName].timeout || this._timeout;
    // mix in config set by @Config
    config = {
      ...config,
      ...this.__meta__[methodName].config,
    };
    return config;
  }

  @nonHTTPRequestMethod
  private _resolveUrl(methodName: string, args: any[]): string {
    const meta = this.__meta__;
    const endpoint = this._endpoint;
    const basePath = meta.basePath;
    const path = meta[methodName].path;
    const pathParams = meta[methodName].pathParams;
    const options = meta[methodName].options || {};
    let url = this.makeURL(endpoint, basePath, path, options);
    for (const pos in pathParams) {
      if (pathParams[pos]) {
        url = url.replace(new RegExp(`\{${pathParams[pos]}}`), args[pos]);
      }
    }
    return url;
  }

  @nonHTTPRequestMethod
  private makeURL(endpoint: string, basePath: string, path: string, options: HttpMethodOptions): string {
    const isAbsoluteURL = /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(path);
    if (isAbsoluteURL) {
      return path;
    }
    if (options.ignoreBasePath) {
      return [endpoint, path].join("");
    }
    return [endpoint, basePath, path].join("");
  }

  @nonHTTPRequestMethod
  private _resolveHttpMethod(methodName: string): HttpMethod {
    const meta = this.__meta__;
    return meta[methodName].method;
  }

  @nonHTTPRequestMethod
  private _resolveHeaders(methodName: string, args: any[]): any {
    const meta = this.__meta__;
    const headers = meta[methodName].headers || {};
    const headerParams = meta[methodName].headerParams;
    for (const pos in headerParams) {
      if (headerParams[pos]) {
        headers[headerParams[pos]] = args[pos];
      }
    }
    const headerMapIndex = meta[methodName].headerMapIndex;
    if (headerMapIndex >= 0) {
      for (const key in args[headerMapIndex]) {
        if (args[headerMapIndex][key]) {
          headers[key] = args[headerMapIndex][key];
        }
      }
    }
    return headers;
  }

  @nonHTTPRequestMethod
  private _resolveQuery(methodName: string, args: any[]): any {
    const meta = this.__meta__;
    const query = meta[methodName].query || {};
    const queryParams = meta[methodName].queryParams;
    for (const pos in queryParams) {
      if (queryParams[pos]) {
        query[queryParams[pos]] = args[pos];
      }
    }
    const queryMapIndex = meta[methodName].queryMapIndex;
    if (queryMapIndex >= 0) {
      for (const key in args[queryMapIndex]) {
        if (args[queryMapIndex][key]) {
          query[key] = args[queryMapIndex][key];
        }
      }
    }
    return query;
  }

  @nonHTTPRequestMethod
  private _resolveData(methodName: string, headers: any, args: any[]): any {
    const meta = this.__meta__;
    const bodyIndex = meta[methodName].bodyIndex;
    const fields = meta[methodName].fields || {};
    const parts = meta[methodName].parts || {};
    const fieldMapIndex = meta[methodName].fieldMapIndex;
    let data = {};

    // @Body
    if (bodyIndex >= 0) {
      if (Array.isArray(args[bodyIndex])) {
        data = args[bodyIndex];
      } else {
        data = { ...data, ...args[bodyIndex] };
      }
    }

    // @Field
    if (Object.keys(fields).length > 0) {
      const reqData = {};
      for (const pos in fields) {
        if (fields[pos]) {
          reqData[fields[pos]] = args[pos];
        }
      }
      data = { ...data, ...reqData };
    }

    // @FieldMap
    if (fieldMapIndex >= 0) {
      const reqData = {};
      for (const key in args[fieldMapIndex]) {
        if (args[fieldMapIndex][key]) {
          reqData[key] = args[fieldMapIndex][key];
        }
      }
      data = { ...data, ...reqData };
    }

    // @MultiPart
    if (Object.keys(parts).length > 0) {
      const reqData = {};
      for (const pos in parts) {
        if (parts[pos]) {
          reqData[parts[pos]] = args[pos];
        }
      }
      data = { ...data, ...reqData };
    }

    const contentType = headers["content-type"] || "application/json";
    const dataResolverFactory = new DataResolverFactory();
    const dataResolver = dataResolverFactory.createDataResolver(contentType);
    return dataResolver.resolve(headers, data);
  }
}

export type RequestInterceptorFunction = (
  value: AxiosRequestConfig,
) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
export type ResponseInterceptorFunction<T = any> = (
  value: AxiosResponse<T>,
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;

abstract class BaseInterceptor {
  public onRejected(error: any) {
    return;
  }
}

export abstract class RequestInterceptor extends BaseInterceptor {
  public abstract onFulfilled(value: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig>;
}

export abstract class ResponseInterceptor<T = any> extends BaseInterceptor {
  public abstract onFulfilled(value: AxiosResponse<T>): AxiosResponse<T> | Promise<AxiosResponse<T>>;
}
