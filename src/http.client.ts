import {
  RequestInterceptor,
  RequestInterceptorFunction,
  Response,
  ResponseInterceptor,
  ResponseInterceptorFunction
} from "./baseService";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { ServiceBuilder } from "./service.builder";

export class RetrofitHttpClient {
  private axios: AxiosInstance = axios;
  private standalone: boolean = false;

  constructor(builder: ServiceBuilder) {
    if (builder.standalone === true) {
      this.axios = axios.create();
      this.standalone = true;
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

  public isStandalone(): boolean {
    return this.standalone;
  }

  public async sendRequest(config: AxiosRequestConfig): Promise<Response> {
    try {
      return await this.axios(config);
    } catch (err) {
      throw err;
    }
  }

  public useRequestInterceptor(interceptor: RequestInterceptorFunction): number {
    return this.axios.interceptors.request.use(interceptor);
  }

  public useResponseInterceptor(interceptor: ResponseInterceptorFunction): number {
    return this.axios.interceptors.response.use(interceptor);
  }

  public ejectRequestInterceptor(id: number): void {
    this.axios.interceptors.request.eject(id);
  }

  public ejectResponseInterceptor(id: number): void {
    this.axios.interceptors.response.eject(id);
  }
}
