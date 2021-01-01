import { ServiceBuilder } from "../../../src/service.builder";
import http from "http";
import { app } from "../../fixture/server";
import { TimeoutService } from "../../fixture/fixtures.timeout";
import { testServerUrl } from "../../testHelpers";

describe("Decorators - timeout", () => {
  let server: http.Server;
  let url: string;

  beforeAll(() => {
    server = app.listen(0);
    url = testServerUrl(server.address());
  });

  afterAll(() => {
    server.close();
  });

  test("@Timeout", async () => {
    const service = new ServiceBuilder().setEndpoint(url).build(TimeoutService);
    await expect(service.timeoutIn3000()).rejects.toThrow(/timeout/);
  });

  test("The timeout in `@Timeout` decorator should shield the value in `setTimeout` method.", async () => {
    const service = new ServiceBuilder().setEndpoint(url).setTimeout(3000).build(TimeoutService);
    const response = await service.timeoutIn6000();
    expect(response.config.timeout).toEqual(6000);
    expect(response.data).toEqual({});
  });
});
