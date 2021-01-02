import { ServiceBuilder } from "../../src/service.builder";
import { testServer } from "../testHelpers";
import { PostsApiService } from "../fixture/fixtures";

describe("Metadata", () => {
  let service: PostsApiService;

  beforeAll(() => {
    service = new ServiceBuilder().setEndpoint(testServer.url).build(PostsApiService);
  });

  test("Method not found", () => {
    const methodName = "sadksadlasd";
    const t = () => {
      service.__getServiceMetadata().getMetadata(methodName);
    };
    expect(t).toThrowError(`Method ${methodName} does not exist`);
  });

  test("Method  found", () => {
    const metadata = service.__getServiceMetadata().getMetadata("getAbsoluteUrl");
    expect(metadata.httpMethod).toBe("GET");
  });
});
