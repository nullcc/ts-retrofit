import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import FormData from "form-data";
import { CONTENT_TYPE, CONTENT_TYPE_HEADER, HttpMethod, HttpMethodOptions } from "./constants";
import { isNode } from "./util";
import { RetrofitHttpClient } from "./http.client";
import { ServiceBuilder } from "./service.builder";
import { ServiceMetaData } from "./metadata";
import { requestHeadersResolver } from "./request-resolvers/headers-request-resolver";
import { requestQueryParamsResolver } from "./request-resolvers/query-params-request-resolver";
import { requestBodyResolver } from "./request-resolvers/body-request-resolver";

axios.defaults.withCredentials = true;

export type ApiResponse<T = unknown> = Promise<AxiosResponse<T>>;

export const STUB_RESPONSE = <T>() => ({} as T);

export const ErrorMessages = {
  NO_HTTP_METHOD: "No http method for method (Add @GET / @POST ...)",

  EMPTY_HEADER_KEY: "Header key can't be empty",
  WRONG_HEADERS_PROPERTY_TYPE: "Header's property can be only number / string / boolean",
  WRONG_HEADER_TYPE: "Header type can be only number / string / boolean",

  EMPTY_QUERY_KEY: "Query key can't be empty",
  WRONG_QUERY_TYPE: "Query type can be only number / string / boolean",
  WRONG_QUERY_MAP_PROPERTY_TYPE: "QueryMap should only contain number / string / boolean",

  EMPTY_FIELD_KEY: "Field key can't be empty",
  EMPTY_PART_KEY: "Part key can't be empty",
};

export class BaseService {
  // Generated before constructor call from decorators
  // @ts-ignore
  private __meta__: ServiceMetaData<this>;
  private readonly _endpoint: string;
  private readonly _httpClient: RetrofitHttpClient;
  private readonly _timeout: number;

  constructor(serviceBuilder: ServiceBuilder) {
    this._endpoint = serviceBuilder.endpoint;
    this._httpClient = new RetrofitHttpClient(serviceBuilder);
    this._timeout = serviceBuilder.timeout;

    const methodNames = this._getInstanceMethodNames();

    const self = this;
    for (const methodName of methodNames) {
      const descriptor = {
        enumerable: true,
        configurable: true,
        get() {
          return (...args: any[]) => {
            return self._wrap(methodName, args);
          };
        },
      };
      Object.defineProperty(this, methodName, descriptor);
    }
  }

  __getServiceMetadata__() {
    if (!this.__meta__) this.__meta__ = new ServiceMetaData<this>();
    return this.__meta__;
  }

  private _getInstanceMethodNames(): string[] {
    let properties: string[] = [];
    let obj = this;

    do {
      properties = properties.concat(Object.getOwnPropertyNames(obj));
      obj = Object.getPrototypeOf(obj);
    } while (obj);
    return properties.sort().filter((e, i, arr) => {
      return e !== arr[i + 1] && this[e] && typeof this[e] === "function" && this.__meta__.methodMetadata.has(e);
    });
  }

  private _wrap<T>(methodName: string, args: any[]): ApiResponse<T> {
    const { url, method, headers, query, data } = this._resolveParameters(methodName, args);
    const config = this._makeConfig(methodName, url, method, headers, query, data);
    return this._httpClient.sendRequest(config);
  }

  private _resolveParameters(methodName: string, args: any[]): any {
    const metadata = this.__meta__.getMetadata(methodName);

    const url = this._resolveUrl(methodName, args);
    const method = this._resolveHttpMethod(methodName);
    let headers = requestHeadersResolver(metadata, methodName, args);
    const query = requestQueryParamsResolver(metadata, methodName, args);
    const data = requestBodyResolver(metadata, methodName, headers, args);
    if (
      headers[CONTENT_TYPE_HEADER] &&
      (headers[CONTENT_TYPE_HEADER] as string).indexOf(CONTENT_TYPE.MULTIPART_FORM_DATA) !== -1 &&
      isNode
    ) {
      headers = { ...headers, ...(data as FormData).getHeaders() };
    }
    return { url, method, headers, query, data };
  }

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
    const metadata = this.__meta__.getMetadata(methodName);

    // response type
    if (metadata.responseType) {
      config.responseType = metadata.responseType;
    }
    // request transformer
    if (metadata.requestTransformer) {
      config.transformRequest = metadata.requestTransformer;
    }
    // response transformer
    if (metadata.responseTransformer) {
      config.transformResponse = metadata.responseTransformer;
    }
    // timeout
    config.timeout = metadata.timeout || this._timeout;
    // mix in config set by @Config
    config = {
      ...config,
      ...metadata.config,
    };
    return config;
  }

  private _resolveUrl(methodName: string, args: any[]): string {
    const metadata = this.__meta__.getMetadata(methodName);

    const endpoint = this._endpoint;
    const pathParams = metadata.pathParams;
    let url = this.makeURL(endpoint, this.__meta__.basePath, metadata.path, metadata.options);

    Object.entries(pathParams).map((e) => {
      const [idx, pathParamName] = e;
      url = url.replace(new RegExp(`{${pathParamName}}`), args[idx]);
    });

    return url;
  }

  private makeURL(endpoint: string, basePath?: string, path?: string, options?: HttpMethodOptions): string {
    const buf = [endpoint];

    if (basePath) buf.push(basePath);

    if (path) {
      const isAbsoluteURL = /^([a-z][a-z\d+\-.]*:)?\/\//i.test(path);
      if (isAbsoluteURL) {
        return path;
      }

      if (options && options.ignoreBasePath) {
        return [endpoint, path].join("");
      }

      buf.push(path);
    }

    return buf.join("");
  }

  private _resolveHttpMethod(methodName: string): HttpMethod {
    const httpMethod = this.__meta__.getMetadata(methodName).httpMethod;
    if (!httpMethod) throw new Error(ErrorMessages.NO_HTTP_METHOD);

    return httpMethod;
  }
}

export type RequestInterceptorFunction = (
  value: AxiosRequestConfig,
) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

export type ResponseInterceptorFunction<T = any> = (
  value: AxiosResponse<T>,
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;

abstract class BaseInterceptor {
  public onRejected(error: Error) {
    return;
  }
}

export abstract class RequestInterceptor extends BaseInterceptor {
  public abstract onFulfilled(value: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig>;
}

export abstract class ResponseInterceptor<T = any> extends BaseInterceptor {
  public abstract onFulfilled(value: AxiosResponse<T>): AxiosResponse<T> | Promise<AxiosResponse<T>>;
}
