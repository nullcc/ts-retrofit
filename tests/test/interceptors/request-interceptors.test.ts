import { RequestInterceptor, RequestInterceptorFunction } from "../../../src";
import { ServiceBuilder } from "../../../src/service.builder";
import { AxiosRequestConfig } from "axios";
import { testServer } from "../../testHelpers";
import { PostsApiService } from "../../fixture/fixtures";

describe("Request interceptors", () => {
  const interceptedHeaderValue = 100;

  test("RequestInterceptorFunction", async () => {
    const interceptor = (config: AxiosRequestConfig) => {
      config.headers["INTERCEPTOR"] = interceptedHeaderValue;
      return config;
    };

    await verifyInterceptor((b) => b.setRequestInterceptors(interceptor));
  });

  test("RequestInterceptor class", async () => {
    class Interceptor extends RequestInterceptor {
      onFulfilled(config: AxiosRequestConfig) {
        config.headers["INTERCEPTOR"] = interceptedHeaderValue;
        return config;
      }
    }

    await verifyInterceptor((b) => b.setRequestInterceptors(new Interceptor()));
  });

  async function verifyInterceptor(setInterceptor: (builder: ServiceBuilder) => void) {
    const builder = new ServiceBuilder().setEndpoint(testServer.url);
    setInterceptor(builder);
    const service = builder.build(PostsApiService);

    const result = await service.get();

    expect(result.config.headers.INTERCEPTOR).toBe(interceptedHeaderValue);
  }
});
