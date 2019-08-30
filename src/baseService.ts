import * as qs from "qs";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Method } from "./constants";

axios.defaults.withCredentials = true;

export type Response = AxiosResponse;

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

    const noWrappedMethodNames = [
      "getInstanceMethodNames",
      "_wrap",
      "_resolveData",
    ];

    const self = this;
    for (const methodName of methodNames) {
      const descriptor = {
        enumerable: true,
        configurable: true,
        get(): Function {
          if (noWrappedMethodNames.includes(methodName)) {
            return self._methodMap[methodName];
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

  private _wrap(methodName: string, args: any[]): Promise<Response> {
    const meta = this.__meta__;
    const endpoint = this._endpoint;
    const basePath = meta.basePath;
    const method = meta[methodName].method;
    const path = meta[methodName].path;
    const headers = meta[methodName].headers || {};
    const query = meta[methodName].query || {};
    const headerParams = meta[methodName].headerParams;
    const pathParams = meta[methodName].pathParams;
    const queryMapIndex = meta[methodName].queryMap;
    const bodyIndex = meta[methodName].body;
    const fields = meta[methodName].fields || {};
    const fieldMapIndex = meta[methodName].fieldMap;

    let url = [endpoint, basePath, path].join("");

    const config: AxiosRequestConfig = {
      headers,
      params: query,
    };

    for (const pos in pathParams) {
      if (pathParams[pos]) {
        url = url.replace(new RegExp(`\{${pathParams[pos]}}`), args[pos]);
      }
    }

    for (const pos in headerParams) {
      if (headerParams[pos]) {
        config.headers[headerParams[pos]] = args[pos];
      }
    }

    if (queryMapIndex >= 0) {
      for (const key in args[queryMapIndex]) {
        if (args[queryMapIndex][key]) {
          config.params[key] = args[queryMapIndex][key];
        }
      }
    }

    if (bodyIndex >= 0) {
      config.data = this._resolveData(config.headers, args[bodyIndex]);
    }

    if (Object.keys(fields).length > 0) {
      const data = {};
      for (const pos in fields) {
        if (fields[pos]) {
          data[fields[pos]] = args[pos];
        }
      }
      config.data = this._resolveData(config.headers, data);
    }

    if (fieldMapIndex >= 0) {
      const data = {};
      for (const key in args[fieldMapIndex]) {
        if (args[fieldMapIndex][key]) {
          data[key] = args[fieldMapIndex][key];
        }
      }
      config.data = this._resolveData(config.headers, data);
    }

    switch (method) {
      case Method.GET:
        return this._httpClient.get(url, config);
      case Method.POST:
        return this._httpClient.post(url, config);
      case Method.PUT:
        return this._httpClient.put(url, config);
      case Method.PATCH:
        return this._httpClient.patch(url, config);
      case Method.DELETE:
        return this._httpClient.delete(url, config);
      case Method.HEAD:
        return this._httpClient.head(url, config);
      case Method.OPTIONS:
        return this._httpClient.options(url, config);
      default:
        return this._httpClient.get(url, config);
    }
  }

  private _resolveData(headers: any, data: any): any {
    if (!headers["Content-Type"]) {
      return data;
    }
    if (headers["Content-Type"].indexOf("application/x-www-form-urlencoded") !== -1) {
      return qs.stringify(data);
    }
    return data;
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
  public async get(url: string, config: AxiosRequestConfig): Promise<Response> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: Method.GET,
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async post(url: string, config: AxiosRequestConfig): Promise<Response> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: Method.POST,
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async put(url: string, config: AxiosRequestConfig): Promise<Response> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: Method.PUT,
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async patch(url: string, config: AxiosRequestConfig): Promise<Response> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: Method.PATCH,
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async delete(url: string, config: AxiosRequestConfig): Promise<Response> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: Method.DELETE,
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async head(url: string, config: AxiosRequestConfig): Promise<Response> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: Method.HEAD,
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  public async options(url: string, config: AxiosRequestConfig): Promise<Response> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method: Method.OPTIONS,
      ...config,
    };
    return await this._sendRequest(requestConfig);
  }

  private async _sendRequest(config: AxiosRequestConfig): Promise<Response> {
    try {
      return await axios(config);
    } catch (err) {
      throw err;
    }
  }
}
