import { ServiceBuilder } from "../../../src";
import { testServer } from "../../testHelpers";
import { ConvertToInlinedBodyService } from "../../fixture/fixtures.response-as-class";

describe("Validate", () => {
  test("@GET", async () => {
    const service = new ServiceBuilder()
      .baseUrl(testServer.url)
      .inlineResponseBody()
      .build(ConvertToInlinedBodyService);

    const result = await service.get();
    expect(result[0].methodInside()).toBe(1);
    expect(result[1].methodInside()).toBe(2);
  });

  test("@GET single", async () => {
    const service = new ServiceBuilder()
      .baseUrl(testServer.url)
      .inlineResponseBody()
      .build(ConvertToInlinedBodyService);

    const result = await service.getWithPath(1);
    expect(result.methodInside()).toBe(1);
  });
});
