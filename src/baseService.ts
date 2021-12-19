import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import FormData from "form-data";
import {
  CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  DataType,
  HeadersParamType,
  HttpMethod,
  HttpMethodOptions,
  MethodMetadata,
  QueriesParamType,
  ValidationErrors,
} from "./constants";
import { isNode } from "./util";
import { RetrofitHttpClient } from "./http.client";
import { ServiceBuilder } from "./service.builder";
import { ServiceMetaData } from "./metadata";
import { requestHeadersResolver } from "./request-resolvers/headers-request-resolver";
import { requestQueryParamsResolver } from "./request-resolvers/query-params-request-resolver";
import { requestBodyResolver } from "./request-resolvers/body-request-resolver";
import { validateSync } from "class-validator";
import { plainToClass } from "class-transformer";
import { ValidationError } from "class-validator/types/validation/ValidationError";
import { makeConfig } from "./request-config-builder";

axios.defaults.withCredentials = true;

export type HttpApiResponse<T = unknown> = Awaited<Promise<AxiosResponse<T>>>;

export type ApiResponse<T = unknown> = HttpApiResponse<T> & void;
export type ApiResponseBody<T = unknown> = Awaited<Promise<T>> & void;

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

  FIELD_WITH_ARRAY_BODY: "Field can't be used when array passed in @Body",
  FIELD_MAP_FOR_ARRAY_BODY: "@FieldMap can't be used with array @Body",
  FIELD_MAP_PARAM_TYPE: "@FieldMap should be object",

  MULTIPART_WITH_ARRAY_BODY: "@Multipart can't be used with array @Body",
  MULTIPART_PARAM_WRONG_TYPE: "Multipart param should be PartDescriptor",

  VALIDATION_NOT_OBJECT: `Response is not an object or array: "{}"`,

  __TEST_NO_REQUESTS_IN_HISTORY: "No requests in history",
};

export class BaseService {
  // Generated before constructor call from decorators
  // @ts-ignore
  private __meta__: ServiceMetaData<this>;
  private readonly _endpoint: string;
  private readonly _httpClient: RetrofitHttpClient;
  public readonly __requestsHistory: AxiosResponse[] = [];

  constructor(private serviceBuilder: ServiceBuilder) {
    this._endpoint = serviceBuilder.endpoint;
    this._httpClient = new RetrofitHttpClient(serviceBuilder);

    const methodNames = this._getInstanceMethodNames();

    for (const methodName of methodNames) {
      const get = () => {
        return (...args: unknown[]) => {
          if (serviceBuilder.withInlineResponseBody) {
            return this._wrapToInlinedResponse(methodName, args);
          } else {
            return this._wrapToAxiosResponse(methodName, args);
          }
        };
      };

      const descriptor = {
        enumerable: true,
        configurable: true,
        get,
      };
      Object.defineProperty(this, methodName, descriptor);
    }
  }

  __getServiceMetadata() {
    if (!this.__meta__) this.__meta__ = new ServiceMetaData<this>();
    return this.__meta__;
  }

  async __performRequest<T = DataType | DataType[]>(
    methodName: keyof this,
    args: unknown[] = [],
  ): Promise<HttpApiResponse<T>> {
    return await this._wrapToAxiosResponse(methodName as string, args);
  }

  // For testing purposes
  __getLastRequest() {
    const last = this.__requestsHistory.pop();
    if (last) return last;

    throw new Error(ErrorMessages.__TEST_NO_REQUESTS_IN_HISTORY);
  }

  private _getInstanceMethodNames(): string[] {
    function props(obj: unknown) {
      const p = [];
      for (; obj != null; obj = Object.getPrototypeOf(obj)) {
        const op = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < op.length; i++) if (p.indexOf(op[i]) == -1) p.push(op[i]);
      }
      return p;
    }

    return props(this)
      .sort()
      .filter((e, i, arr) => {
        return e !== arr[i + 1] && this[e] && typeof this[e] === "function" && this.__meta__.methodMetadata.has(e);
      });
  }

  private async _wrapToAxiosResponse<T = DataType | DataType[]>(
    methodName: string,
    args: unknown[],
  ): Promise<HttpApiResponse<T>> {
    const metadata = this.__meta__.getMetadata(methodName);
    this._resolveConverterAndValidator(methodName, metadata);

    const { url, method, headers, query, data } = this._resolveParameters(methodName, args);
    const config = makeConfig(metadata, this.serviceBuilder, methodName, url, method, headers, query, data);

    const result = await this._httpClient.sendRequest<T>(config);

    this._responseValidator(result, methodName, metadata);

    this._saveToRequestHistory(result);

    return result;
  }

  private _wrapToInlinedResponse<T extends Record<string, unknown>>(methodName: string, args: unknown[]): Promise<T> {
    return this._wrapToAxiosResponse<T>(methodName, args).then((r) => r.data);
  }

  private _saveToRequestHistory<T>(result: AxiosResponse<T>) {
    if (!this.serviceBuilder.shouldSaveRequestHistory) return;

    this.__requestsHistory.push(result);
  }

  private _responseValidator<T extends unknown | Array<unknown>>(
    response: AxiosResponse<T>,
    methodName: string,
    metadata: MethodMetadata,
  ) {
    if (!response || !this.serviceBuilder.responseValidator || !metadata.convertTo) return;

    const data = response.data;

    let errors: ValidationError[] = [];
    if (Array.isArray(data)) {
      errors = Array.prototype.concat.apply(
        [],
        data.map((e) => validateSync(e)),
      );
    } else if (typeof data === "object") {
      errors = validateSync(data as Record<string, unknown>);
    } else {
      throw new Error(ErrorMessages.VALIDATION_NOT_OBJECT.replace("{}", "" + data));
    }

    if (errors.length !== 0) throw new ValidationErrors(errors, JSON.stringify(data));
  }

  private _resolveConverterAndValidator(methodName: string, metadata: MethodMetadata) {
    if (metadata.convertTo) {
      const convert = (data: Record<string, unknown>) => {
        if (!metadata.convertTo) throw new Error("metadata.convertTo null???");

        if (typeof data !== "object") return data;

        return plainToClass(metadata.convertTo, data);
      };

      metadata.responseTransformer.push((data) => {
        if (!data) return data;

        if (Array.isArray(data)) {
          return data.map(convert);
        } else {
          return convert(data);
        }
      });
    }
  }

  private _resolveParameters(
    methodName: string,
    args: unknown[],
  ): {
    url: string;
    method: HttpMethod;
    headers: HeadersParamType;
    query: QueriesParamType;
    data: DataType | DataType[];
  } {
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

  private _resolveUrl(methodName: string, args: unknown[]): string {
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

export type ResponseInterceptorFunction<T extends Record<string, unknown> = Record<string, unknown>> = (
  value: AxiosResponse<T>,
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;

abstract class BaseInterceptor {
  public onRejected(error: Error) {
    throw error;
  }
}

export abstract class RequestInterceptor extends BaseInterceptor {
  public abstract onFulfilled(value: AxiosRequestConfig): AxiosRequestConfig | Promise<AxiosRequestConfig>;
}

export abstract class ResponseInterceptor<T extends DataType = DataType> extends BaseInterceptor {
  public abstract onFulfilled(value: AxiosResponse<T>): AxiosResponse<T> | Promise<AxiosResponse<T>>;
}
