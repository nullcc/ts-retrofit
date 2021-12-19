import { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  RequestInterceptor,
  RequestInterceptorFunction,
  ResponseInterceptor,
  ResponseInterceptorFunction,
} from "./baseService";
import { Primitive, ValidationMethod } from "./constants";

export class ServiceBuilder {
  private _endpoint = "";
  private _standalone: boolean | AxiosInstance = false;
  private _requestInterceptors: Array<RequestInterceptorFunction | RequestInterceptor> = [];
  private _responseInterceptors: Array<ResponseInterceptorFunction | ResponseInterceptor> = [];
  private _withInlineResponseBody = false;
  private _responseValidator?: ValidationMethod;
  private _shouldSaveRequestHistory = false;
  private _timeout = 60000;
  private _loggerOptions: { showLogs?: boolean; logLevel?: "LOG" | "DEBUG" } = { showLogs: false };

  public build<T>(service: new (builder: ServiceBuilder) => T): T {
    return new service(this);
  }

  public baseUrl(endpoint: string): ServiceBuilder {
    this._endpoint = endpoint;
    return this;
  }

  public setStandalone(standalone: boolean | AxiosInstance): ServiceBuilder {
    this._standalone = standalone;
    return this;
  }

  public validateResponse(type: ValidationMethod = ValidationMethod.CLASS_VALIDATOR): ServiceBuilder {
    this._responseValidator = type;
    return this;
  }

  public setRequestInterceptors(
    ...interceptors: Array<RequestInterceptorFunction | RequestInterceptor>
  ): ServiceBuilder {
    this._requestInterceptors.push(...interceptors);
    return this;
  }

  public setResponseInterceptors(
    ...interceptors: Array<ResponseInterceptorFunction | ResponseInterceptor>
  ): ServiceBuilder {
    this._responseInterceptors.push(...interceptors);
    return this;
  }

  public setTimeout(timeout: number): ServiceBuilder {
    this._timeout = timeout;
    return this;
  }

  /**
   * Sends request header "Authorization": "Bearer ${token}"
   */
  public withOauth(token?: string): ServiceBuilder {
    return this.withRequestHeader("Authorization", `Bearer ${token ? token : ""}`);
  }

  public withRequestHeader(key: string, value?: Primitive): ServiceBuilder {
    this.setRequestInterceptors((config: AxiosRequestConfig) => {
      if (!value) return config;

      return {
        ...config,
        headers: {
          ...config.headers,
          [key]: `${value}`,
        },
      };
    });
    return this;
  }

  public withRequestLogger(
    options: { showLogs?: boolean; logLevel?: "LOG" | "DEBUG" } = { showLogs: true },
  ): ServiceBuilder {
    this._loggerOptions = options;
    return this;
  }

  public inlineResponseBody(): ServiceBuilder {
    this._withInlineResponseBody = true;
    return this;
  }

  public saveRequestHistory(): ServiceBuilder {
    this._shouldSaveRequestHistory = true;
    return this;
  }

  get loggerOptions() {
    return this._loggerOptions;
  }

  get shouldSaveRequestHistory() {
    return this._shouldSaveRequestHistory;
  }

  get withInlineResponseBody(): boolean {
    return this._withInlineResponseBody;
  }

  get responseValidator() {
    return this._responseValidator;
  }

  get endpoint(): string {
    return this._endpoint;
  }

  get standalone(): boolean | AxiosInstance {
    return this._standalone;
  }

  get requestInterceptors(): Array<RequestInterceptorFunction | RequestInterceptor> {
    return this._requestInterceptors;
  }

  get responseInterceptors(): Array<ResponseInterceptorFunction | ResponseInterceptor> {
    return this._responseInterceptors;
  }

  get timeout(): number {
    return this._timeout;
  }
}
