import { ResponseInterceptor, ResponseInterceptorFunction } from "../../../src";
import { ServiceBuilder } from "../../../src/service.builder";
import { AxiosResponse } from "axios";
import { JSONPLACEHOLDER_URL } from "../../testHelpers";
import { PostsApiService } from "../../fixture/fixtures";

describe("Response interceptors", () => {
  const interceptedHeaderValue = 100;

  test("ResponseInterceptorFunction", async () => {
    const interceptor = <T>(value: AxiosResponse<T>) => {
      value.data["INTERCEPTOR"] = interceptedHeaderValue;
      return value;
    };

    await verifyInterceptor((b) => b.setResponseInterceptors(interceptor));
  });

  test("ResponseInterceptor class", async () => {
    class Interceptor<T> extends ResponseInterceptor<T> {
      onRejected(error: any): void {}

      onFulfilled(value: AxiosResponse<T>): AxiosResponse<T> | Promise<AxiosResponse<T>> {
        value.data["INTERCEPTOR"] = interceptedHeaderValue;
        return value;
      }
    }

    await verifyInterceptor((b) => b.setResponseInterceptors(new Interceptor()));
  });

  async function verifyInterceptor(setInterceptor: (builder: ServiceBuilder) => void) {
    const builder = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL);

    setInterceptor(builder);

    const service = builder.build(PostsApiService);

    const result = await service.get();

    expect(result.data["INTERCEPTOR"]).toBe(interceptedHeaderValue);
  }
});
