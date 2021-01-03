import { ServiceBuilder } from "../../../src";
import { TimeoutService } from "../../fixture/fixtures.timeout";
import { testServer } from "../../testHelpers";

describe("Decorators - timeout", () => {
  test("@Timeout", async () => {
    const service = new ServiceBuilder().baseUrl(testServer.url).build(TimeoutService);
    await expect(service.timeoutIn3000()).rejects.toThrow(/timeout/);
  });

  test("The timeout in `@Timeout` decorator should shield the value in `setTimeout` method.", async () => {
    const service = new ServiceBuilder().baseUrl(testServer.url).setTimeout(3000).build(TimeoutService);
    const response = await service.timeoutIn6000();
    expect(response.config.timeout).toEqual(6000);
    expect(response.data).toEqual({});
  });
});
