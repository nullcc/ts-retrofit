import { ResponseBodyWithHeaderService, TEST_HEADER, WithHeaderService } from "../../fixture/fixtures";
import { ServiceBuilder } from "../../../src";
import { testServer } from "../../testHelpers";

describe("Requests with header", () => {
  describe("withOauth", () => {
    test("Raw response", async () => {
      const service = new ServiceBuilder().baseUrl(testServer.url).withOauth("321").build(WithHeaderService);

      const result = await service.withOauth();
      expect(result.data).toBe("Bearer 321");
    });

    test("Inlined response", async () => {
      const service = new ServiceBuilder()
        .baseUrl(testServer.url)
        .withOauth("321")
        .inlineResponseBody()
        .build(ResponseBodyWithHeaderService);

      const result = await service.withOauth();
      expect(result).toBe("Bearer 321");
    });
  });

  describe("withRequestHeader", () => {
    test("Raw response", async () => {
      const service = new ServiceBuilder()
        .baseUrl(testServer.url)
        .withRequestHeader(TEST_HEADER, 123)
        .build(WithHeaderService);

      const result = await service.withHeaders();
      expect(result.data).toBe(123);
    });

    test("Inlined response", async () => {
      const service = new ServiceBuilder()
        .baseUrl(testServer.url)
        .withRequestHeader(TEST_HEADER, 123)
        .inlineResponseBody()
        .build(ResponseBodyWithHeaderService);

      const result = await service.withHeaders();
      expect(result).toBe(123);
    });
  });
});
