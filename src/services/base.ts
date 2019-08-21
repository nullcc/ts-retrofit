import { AxiosRequestConfig, AxiosResponse } from 'axios';
import HttpClient from '../utils/httpClient';

export class BaseService {
  private _endpoint: string;
  private _httpClient: HttpClient;
  private _methodMap: Map<string, Function>;

  constructor(serviceBuilder: ServiceBuilder) {
    this._endpoint = serviceBuilder.endpoint;
    this._httpClient = new HttpClient();
    this._methodMap = new Map<string, Function>();

    const methodNames = this._getInstanceMethodNames();
    methodNames.forEach(methodName => {
      this._methodMap[methodName] = this[methodName];
    });

    const noWrappedMethodNames = [
      'getInstanceMethodNames',
      '_wrap',
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
          const endpoint = self._endpoint;
          const method = self['$meta'][methodName].method;
          const basePath = self['$meta'].basePath;
          const path = self['$meta'][methodName].path;
          const headers = self['$meta'][methodName].headers || {};
          const headerParams = self['$meta'][methodName].headerParams;
          const pathParams = self['$meta'][methodName].pathParams;
          const queryMapIndex = self['$meta'][methodName].queryMap;
          const bodyIndex = self['$meta'][methodName].body;
          return (...args: any[]) => {
            const url = `${endpoint}/${basePath}/${path}`;
            return self._wrap(method, url, headers, headerParams, pathParams, queryMapIndex, bodyIndex, args);
          };
        },
        set(value: Function) {
          self[methodName] = value;
        }
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
      return e !== arr[i + 1] && this[e] && typeof this[e] === 'function';
    });
  }

  private _wrap(method: string, path: string, headers: any, headerParams: any[], pathParams: any[], queryMapIndex: number, bodyIndex: number, args: any[]): Promise<AxiosResponse> {
    let url = path;

    const config: AxiosRequestConfig = {
      headers,
      params: {},
    };

    for (const pos in pathParams) {
      url = url.replace(new RegExp(`\{${pathParams[pos]}}`), args[pos]);
    }

    for (const pos in headerParams) {
      config.headers[headerParams[pos]] = args[pos];
    }

    if (queryMapIndex >= 0) {
      for (const key in args[queryMapIndex]) {
        config.params[key] = args[queryMapIndex][key];
      }
    }

    if (bodyIndex >= 0) {
      config.data = args[bodyIndex];
    }

    switch (method) {
      case 'GET':
        return this._httpClient.get(url, config);
      case 'POST':
        return this._httpClient.post(url, config);
      case 'PUT':
        return this._httpClient.put(url, config);
      case 'PATCH':
        return this._httpClient.patch(url, config);
      case 'DELETE':
        return this._httpClient.delete(url, config);
      case 'HEAD':
        return this._httpClient.head(url, config);
      default:
        return this._httpClient.get(url, config);
    }
  }
}

export class ServiceBuilder {
  private _endpoint: string = '';

  public build<T>(service: { new(builder: ServiceBuilder): T; }): T {
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
