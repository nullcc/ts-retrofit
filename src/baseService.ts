import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import FormData from "form-data";
import { DataResolverFactory } from "./dataResolver";
import { HttpMethod } from "./constants";

axios.defaults.withCredentials = true;

export interface Response<T = any> extends AxiosResponse<T> {}
export interface IFilter {
  invoke(
    config: AxiosRequestConfig,
    continuation: () => Promise<Response>
  ): Promise<Response>;
}

const NON_HTTP_REQUEST_PROPERTY_NAME = "__nonHTTPRequestMethod__";

export const nonHTTPRequestMethod = (target: any, methodName: string) => {
  const descriptor = {
    value: true,
    writable: false,
  };
  Object.defineProperty(
    target[methodName],
    NON_HTTP_REQUEST_PROPERTY_NAME,
    descriptor
  );
};

export class BaseService {
  public __meta__: any;
  private _endpoint: string;
  private _httpClient: HttpClient;
  private _methodMap: Map<string, Function>;

  constructor(serviceBuilder: ServiceBuilder) {
    this._endpoint = serviceBuilder.endpoint;
    this._httpClient = new HttpClient(serviceBuilder);
    this._methodMap = new Map<string, Function>();

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
          const methodOriginalDescriptor = Object.getOwnPropertyDescriptor(
            method,
            NON_HTTP_REQUEST_PROPERTY_NAME
          );
          if (
            methodOriginalDescriptor &&
            methodOriginalDescriptor.value === true
          ) {
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

  _filters: IFilter[] = []; //TODO

  @nonHTTPRequestMethod
  private async _wrap(methodName: string, args: any[]): Promise<Response> {
    const url = this._resolveUrl(methodName, args);
    const method = this._resolveHttpMethod(methodName);
    let headers = this._resolveHeaders(methodName, args);
    const query = this._resolveQuery(methodName, args);
    const data = this._resolveData(methodName, headers, args);
    const filters = this._resolveActionFilters(methodName);
    this._filters = filters; // we need like as acitoncontext property to...what?
    if (
      headers["content-type"] &&
      headers["content-type"].indexOf("multipart/form-data") !== -1
    ) {
      headers = { ...headers, ...(data as FormData).getHeaders() };
    }
    const config: AxiosRequestConfig = {
      url,
      method,
      headers,
      params: query,
      data,
    };
    if (this.__meta__[methodName].responseType) {
      config.responseType = this.__meta__[methodName].responseType;
    }
    return this._sendRequesetWithFilter(config, 0, async () => {
      return await this._httpClient.sendRequest(config);
    });
  }

  @nonHTTPRequestMethod
  private async _sendRequesetWithFilter(
    config: AxiosRequestConfig,
    index: number,
    continuation: () => Promise<Response>
  ): Promise<Response> {
    if (this._filters?.length && this._filters[index]) {
      const filter = this._filters[index];
      return await filter.invoke(
        config,
        async () =>
          await this._sendRequesetWithFilter(config, index + 1, continuation)
      );
    } else {
      return await continuation();
    }
  }

  @nonHTTPRequestMethod
  private _resolveUrl(methodName: string, args: any[]): string {
    const meta = this.__meta__;
    const endpoint = this._endpoint;
    const basePath = meta.basePath;
    const path = meta[methodName].path;
    const pathParams = meta[methodName].pathParams;
    let url = [endpoint, basePath, path].join("");
    for (const pos in pathParams) {
      if (pathParams[pos]) {
        url = url.replace(new RegExp(`\{${pathParams[pos]}}`), args[pos]);
      }
    }
    return url;
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
      data = { ...data, ...args[bodyIndex] };
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

  @nonHTTPRequestMethod
  private _resolveActionFilters(methodName: string): IFilter[] {
    const meta = this.__meta__;
    return meta[methodName].Filters;
  }
}

export type RequestInterceptorFunction = (
  value: AxiosRequestConfig
) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
export type ResponseInterceptorFunction<T = any> = (
  value: AxiosResponse<T>
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;

abstract class BaseInterceptor {
  public onRejected(error: any) {
    return;
  }
}

export abstract class RequestInterceptor extends BaseInterceptor {
  public abstract onFulfilled(
    value: AxiosRequestConfig
  ): AxiosRequestConfig | Promise<AxiosRequestConfig>;
}

export abstract class ResponseInterceptor<T = any> extends BaseInterceptor {
  public abstract onFulfilled(
    value: AxiosResponse<T>
  ): AxiosResponse<T> | Promise<AxiosResponse<T>>;
}

export class ServiceBuilder {
  private _endpoint: string = "";
  private _standalone: boolean | AxiosInstance = false;
  private _requestInterceptors: Array<
    RequestInterceptorFunction | RequestInterceptor
  > = [];
  private _responseInterceptors: Array<
    ResponseInterceptorFunction | ResponseInterceptor
  > = [];

  public build<T>(service: new (builder: ServiceBuilder) => T): T {
    return new service(this);
  }

  public setEndpoint(endpoint: string): ServiceBuilder {
    this._endpoint = endpoint;
    return this;
  }

  // 单例模式
  public setStandalone(standalone: boolean | AxiosInstance) {
    this._standalone = standalone;
    return this;
  }

  // 插入请求拦截器
  public setRequestInterceptors(
    ...interceptors: Array<RequestInterceptorFunction | RequestInterceptor>
  ) {
    this._requestInterceptors.push(...interceptors);
    return this;
  }

  // 插入应答拦截器
  public setResponseInterceptors(
    ...interceptors: Array<ResponseInterceptorFunction | ResponseInterceptor>
  ) {
    this._responseInterceptors.push(...interceptors);
    return this;
  }

  get endpoint(): string {
    return this._endpoint;
  }

  get standalone(): boolean | AxiosInstance {
    return this._standalone;
  }

  get requestInterceptors(): Array<
    RequestInterceptorFunction | RequestInterceptor
  > {
    return this._requestInterceptors;
  }

  get responseInterceptors(): Array<
    ResponseInterceptorFunction | ResponseInterceptor
  > {
    return this._responseInterceptors;
  }
}

class HttpClient {
  private axios: AxiosInstance = axios;

  constructor(builder: ServiceBuilder) {
    if (builder.standalone === true) {
      this.axios = axios.create();
    } else if (typeof builder.standalone === "function") {
      this.axios = builder.standalone;
    }

    builder.requestInterceptors.forEach((interceptor) => {
      if (interceptor instanceof RequestInterceptor) {
        this.axios.interceptors.request.use(
          interceptor.onFulfilled.bind(interceptor),
          interceptor.onRejected.bind(interceptor)
        );
      } else {
        this.axios.interceptors.request.use(interceptor);
      }
    });

    builder.responseInterceptors.forEach((interceptor) => {
      if (interceptor instanceof ResponseInterceptor) {
        this.axios.interceptors.response.use(
          interceptor.onFulfilled.bind(interceptor),
          interceptor.onRejected.bind(interceptor)
        );
      } else {
        this.axios.interceptors.response.use(interceptor);
      }
    });
  }

  public async sendRequest(config: AxiosRequestConfig): Promise<Response> {
    try {
      return await this.axios(config);
    } catch (err) {
      throw err;
    }
  }
}
