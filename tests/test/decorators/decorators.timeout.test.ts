import { ServiceBuilder } from "../../../src/service.builder";
import { TEST_SERVER_ENDPOINT, TEST_SERVER_PORT, TimeoutService } from "../../fixture/fixtures";
import http from "http";
import { app } from "../../fixture/server";

describe("Decorators - timeout", () => {
  let server: http.Server;

  beforeAll(() => {
    server = app.listen(TEST_SERVER_PORT);
  });

  afterAll(() => {
    server.close();
  });

  test("@Timeout", async () => {
    const service = new ServiceBuilder().setEndpoint(TEST_SERVER_ENDPOINT).build(TimeoutService);
    await expect(service.timeoutIn3000()).rejects.toThrow(/timeout/);
  });

  test("The timeout in `@Timeout` decorator should shield the value in `setTimeout` method.", async () => {
    const service = new ServiceBuilder().setEndpoint(TEST_SERVER_ENDPOINT).setTimeout(3000).build(TimeoutService);
    const response = await service.timeoutIn6000();
    expect(response.config.timeout).toEqual(6000);
    expect(response.data).toEqual({});
  });
});
