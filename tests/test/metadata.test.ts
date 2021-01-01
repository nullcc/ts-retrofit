import { ServiceBuilder } from "../../src/service.builder";
import { JSONPLACEHOLDER_URL } from "../testHelpers";
import { PostsApiService } from "../fixture/fixtures";

describe("Metadata", () => {
  const service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(PostsApiService);
  test("Method not found", () => {
    const methodName = "sadksadlasd";
    const t = () => {
      service.__getServiceMetadata__().getMetadata(methodName);
    };
    expect(t).toThrowError(`Method ${methodName} does not exist`);
  });

  test("Method  found", () => {
    const metadata = service.__getServiceMetadata__().getMetadata("getAbsoluteUrl");
    expect(metadata.httpMethod).toBe("GET");
  });
});
