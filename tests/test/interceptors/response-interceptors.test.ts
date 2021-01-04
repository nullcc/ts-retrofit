import { ResponseInterceptor } from "../../../src";
import { ServiceBuilder } from "../../../src";
import { AxiosResponse } from "axios";
import { testServer, validateThrows } from "../../testHelpers";
import { PostsApiService } from "../../fixture/fixtures";
import { DataType } from "../../../src/constants";

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
    class Interceptor<T extends DataType = DataType> extends ResponseInterceptor<T> {
      onFulfilled(value: AxiosResponse<T>): AxiosResponse<T> | Promise<AxiosResponse<T>> {
        value.data["INTERCEPTOR"] = interceptedHeaderValue;
        return value;
      }
    }

    await verifyInterceptor((b) => b.setResponseInterceptors(new Interceptor()));
  });

  describe("onRejected", () => {
    test("Override onRejected", async () => {
      let calledRejected = false;

      class Interceptor<T extends Record<string, unknown>> extends ResponseInterceptor<T> {
        onRejected(): void {
          calledRejected = true;
        }

        onFulfilled(value: AxiosResponse<T>): AxiosResponse<T> | Promise<AxiosResponse<T>> {
          return value;
        }
      }

      const interceptor = new Interceptor();
      const spy = jest.spyOn(interceptor, "onRejected");

      const service = new ServiceBuilder()
        .baseUrl(testServer.url)
        .setResponseInterceptors(interceptor)
        .setStandalone(true)
        .build(PostsApiService);

      await service.wrongUrl();

      expect(spy).toHaveBeenCalled();
      expect(calledRejected).toBeTruthy();
    });

    test("No override", async () => {
      class Interceptor<T extends Record<string, unknown>> extends ResponseInterceptor<T> {
        onFulfilled(value: AxiosResponse<T>): AxiosResponse<T> | Promise<AxiosResponse<T>> {
          return value;
        }
      }

      const interceptor = new Interceptor();

      const service = new ServiceBuilder()
        .baseUrl(testServer.url)
        .setStandalone(true)
        .setResponseInterceptors(interceptor)
        .build(PostsApiService);

      await validateThrows(service.wrongUrl, (error) => {
        expect(error.message).toContain("404");
      });
    });
  });

  async function verifyInterceptor(setInterceptor: (builder: ServiceBuilder) => void) {
    const builder = new ServiceBuilder().baseUrl(testServer.url).setStandalone(true);

    setInterceptor(builder);

    const service = builder.build(PostsApiService);

    const result = await service.get();

    expect(result.data["INTERCEPTOR"]).toBe(interceptedHeaderValue);
  }
});
