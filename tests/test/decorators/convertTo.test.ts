import { ServiceBuilder } from "../../../src";
import { testServer, verifyRequest } from "../../testHelpers";
import { ConvertToInlinedBodyService, ConvertToService } from "../../fixture/fixtures.response-as-class";
import { posts } from "../../fixture/fixtures";

describe("@ConvertTo", () => {
  describe("AxiosResponse", () => {
    let service: ConvertToService;

    beforeAll(() => {
      service = new ServiceBuilder().baseUrl(testServer.url).saveRequestHistory().build(ConvertToService);
    });

    test("@GET", async () => {
      const response = await service.get();
      expect(response.data[0].methodInside()).toBe(1);
      expect(response.data[1].methodInside()).toBe(2);
      verifyRequest(response, "get");
    });

    test("@GET - to type", async () => {
      const response = await service.getToType();
      expect(response.data.length).toBe(posts.length);
      verifyRequest(response, "get");
    });

    test("@GET - single", async () => {
      const response = await service.getWithPath(1);
      expect(response.data.methodInside()).toBe(1);
      verifyRequest(response, "get", "/posts/1");
    });

    test("No ConvertTo", async () => {
      const result = await service.getNoConvertTo();
      expect(result.data[0].methodInside).toBeUndefined();
      expect(result.data[1].methodInside).toBeUndefined();
    });
  });

  describe("Inline", () => {
    let service: ConvertToInlinedBodyService;

    beforeAll(() => {
      service = new ServiceBuilder()
        .baseUrl(testServer.url)
        .saveRequestHistory()
        .inlineResponseBody()
        .build(ConvertToInlinedBodyService);
    });

    test("@GET", async () => {
      const response = await service.get();
      expect(response[0].methodInside()).toBe(1);
      expect(response[1].methodInside()).toBe(2);
      verifyRequest(service.__getLastRequest(), "get");
    });

    test("@GET - to type", async () => {
      const response = await service.getToType();
      expect(response.length).toBe(posts.length);
      verifyRequest(service.__getLastRequest(), "get");
    });

    test("@GET - single", async () => {
      const response = await service.getWithPath(1);
      expect(response.methodInside()).toBe(1);
      verifyRequest(service.__getLastRequest(), "get", "/posts/1");
    });

    test("No ConvertTo", async () => {
      const result = await service.getNoConvertTo();
      expect(result[0].methodInside).toBeUndefined();
      expect(result[1].methodInside).toBeUndefined();
    });
  });
});
