import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { DataResolverFactory } from "./dataResolver";

axios.defaults.withCredentials = true;

export type Response = AxiosResponse;

const NON_HTTP_REQUEST_PROPERTY_NAME = '__nonHTTPRequestMethod__';

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
  private _httpClient: HttpClient;
  private _methodMap: Map<string, Function>;

  constructor(serviceBuilder: ServiceBuilder) {
    this._endpoint = serviceBuilder.endpoint;
    this._httpClient = new HttpClient();
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
          const descriptor = Object.getOwnPropertyDescriptor(method, NON_HTTP_REQUEST_PROPERTY_NAME);
          if (descriptor && descriptor.value === true) {
            return method;
          }
          return (...args: any[]) => {
            return self._wrap(methodName, args);
          };
        },
        set(value: Function) {
          self[methodName] = value;
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

  @nonHTTPRequestMethod
  private _wrap(methodName: string, args: any[]): Promise<Response> {
    const url = this._resolveUrl(methodName, args);
    const method = this._resolveHttpMethod(methodName);
    const headers = this._resolveHeaders(methodName, args);
    const query = this._resolveQuery(methodName, args);
    const data = this._resolveData(methodName, headers, args);

    const config: AxiosRequestConfig = {
      url,
      method,
      headers,
      params: query,
      data,
    };
    return this._httpClient.sendRequest(config);
  }

  @nonHTTPRequestMethod
  private _resolveUrl(methodName: string, args: any[]) {
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
  private _resolveHttpMethod(methodName: string) {
    const meta = this.__meta__;
    return meta[methodName].method;
  }

  @nonHTTPRequestMethod
  private _resolveHeaders(methodName: string, args: any[]) {
    const meta = this.__meta__;
    const headers = meta[methodName].headers || {};
    const headerParams = meta[methodName].headerParams;
    for (const pos in headerParams) {
      if (headerParams[pos]) {
        headers[headerParams[pos]] = args[pos];
      }
    }
    return headers;
  }

  @nonHTTPRequestMethod
  private _resolveQuery(methodName: string, args: any[]) {
    const meta = this.__meta__;
    const query = meta[methodName].query || {};
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
  private _resolveData(methodName: string, headers: any, args: any[]) {
    const meta = this.__meta__;
    const bodyIndex = meta[methodName].bodyIndex;
    const fields = meta[methodName].fields || {};
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

    const contentType = headers["Content-Type"] || "application/json";
    const dataResolver = DataResolverFactory.createDataResolver(contentType);
    return dataResolver.resolve(data);
  }
}

export class ServiceBuilder {
  private _endpoint: string = "";

  public build<T>(service: new(builder: ServiceBuilder) => T): T {
    return new service(this);
  }

  public setEndpoint(endpoint: string): ServiceBuilder {
    this._endpoint = endpoint;
    return this;
  }

  get endpoint(): string {
    return this._endpoint;
  }
}

class HttpClient {
  public async sendRequest(config: AxiosRequestConfig): Promise<Response> {
    try {
      return await axios(config);
    } catch (err) {
      throw err;
    }
  }
}
