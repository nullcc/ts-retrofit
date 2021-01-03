import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import FormData from "form-data";
import {
  CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  HeadersParamType,
  HttpMethod,
  HttpMethodOptions,
  QueriesParamType,
} from "./constants";
import { isNode } from "./util";
import { RetrofitHttpClient } from "./http.client";
import { ServiceBuilder } from "./service.builder";
import { ServiceMetaData } from "./metadata";
import { requestHeadersResolver } from "./request-resolvers/headers-request-resolver";
import { requestQueryParamsResolver } from "./request-resolvers/query-params-request-resolver";
import { requestBodyResolver } from "./request-resolvers/body-request-resolver";
import { PostAsClass } from "../tests/fixture/fixtures";
import { ConvertToInlinedBodyService } from "../tests/fixture/fixtures.response-as-class";
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  validateSync,
} from "class-validator";

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

  __TEST_NO_REQUESTS_IN_HISTORY: "No requests in history",
};

export class BaseService {
  // Generated before constructor call from decorators
  // @ts-ignore
  private __meta__: ServiceMetaData<this>;
  private readonly _endpoint: string;
  private readonly _httpClient: RetrofitHttpClient;
  private readonly _timeout: number;
  public readonly __requestsHistory: AxiosResponse[] = [];

  constructor(private serviceBuilder: ServiceBuilder) {
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
            if (serviceBuilder.withInlineResponseBody) {
              return self._wrapToInlinedResponse(methodName, args);
            } else {
              return self._wrapToAxiosResponse(methodName, args);
            }
          };
        },
      };
      Object.defineProperty(this, methodName, descriptor);
    }
  }

  __getServiceMetadata() {
    if (!this.__meta__) this.__meta__ = new ServiceMetaData<this>();
    return this.__meta__;
  }

  async __performRequest<T>(methodName: keyof this, args: any[] = []): ApiResponse<T> {
    return await this._wrapToAxiosResponse(methodName as string, args);
  }

  // For testing purposes
  __getLastRequest() {
    const last = this.__requestsHistory.pop();
    if (last) return last;

    throw new Error(ErrorMessages.__TEST_NO_REQUESTS_IN_HISTORY);
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

  private _wrapToAxiosResponse<T>(methodName: string, args: any[]): ApiResponse<T> {
    this._resolveConverterAndValidator(methodName);

    const { url, method, headers, query, data } = this._resolveParameters(methodName, args);
    const config = this._makeConfig(methodName, url, method, headers, query, data);

    const promise = this._httpClient.sendRequest<T>(config);

    this._saveToRequestHistory(promise);

    return promise;
  }

  private _wrapToInlinedResponse<T = any>(methodName: string, args: any[]): Promise<T> {
    return this._wrapToAxiosResponse<T>(methodName, args).then((r) => r.data);
  }

  private _saveToRequestHistory<T>(promise: Promise<AxiosResponse<T>>) {
    if (!this.serviceBuilder.shouldSaveRequestHistory) return;

    promise.then((result) => {
      this.__requestsHistory.push(result);
    });
  }

  private _resolveConverterAndValidator(methodName: string) {
    const metadata = this.__meta__.getMetadata(methodName);

    const convert = (data: any) => {
      const obj = new metadata.convertTo();
      Object.assign(obj, data);
      return obj;
    };

    if (metadata.convertTo) {
      metadata.responseTransformer.push((data) => {
        if (Array.isArray(data)) {
          return data.map(convert);
        } else {
          return convert(data);
        }
      });
    }

    if (this.serviceBuilder.shouldValidate && metadata.convertTo) {
      metadata.responseTransformer.push((data) => {
        validateSync(data);
        return data;
      });
    }
  }

  private _resolveParameters(
    methodName: string,
    args: any[],
  ): { url: string; method: HttpMethod; headers: HeadersParamType; query: QueriesParamType; data: any } {
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
    if (metadata.requestTransformer.length > 0) {
      config.transformRequest = [
        ...metadata.requestTransformer,
        (data: string, headers?: { [key: string]: unknown }) => {
          // @TODO what if not json ??? response content type?
          return JSON.stringify(data);
        },
      ];
    }
    // response transformer
    if (metadata.responseTransformer.length > 0) {
      config.transformResponse = [
        (body: string, headers?: { [key: string]: unknown }) => {
          // @TODO what if not json ??? response content type?
          return JSON.parse(body);
        },
        ...metadata.responseTransformer,
      ];
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
