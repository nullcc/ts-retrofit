import { PostsApiService, TEST_SERVER_PORT } from "../../fixture/fixtures";
import { ServiceBuilder } from "../../../src/service.builder";
import { JSONPLACEHOLDER_URL, testServerUrl } from "../../testHelpers";
import { FileService, MessagingService, TEST_SERVER_ENDPOINT } from "../../fixture/fixtures";
import fs from "fs";
import http from "http";
import { app } from "../../fixture/server";
import { AddressInfo } from "net";

describe("Decorators - Multipart", () => {
  let server: http.Server;
  let url: string;

  beforeAll(() => {
    server = app.listen();
    url = testServerUrl(server.address());
  });

  afterAll(() => {
    server.close();
  });

  test("Test `@Multipart` decorator.", async () => {
    const fileService = new ServiceBuilder().setEndpoint(url).build(FileService);
    const bucket = {
      value: "test-bucket",
    };
    const file = {
      value: fs.readFileSync("tests/fixture/pic.png"),
      filename: "pic.png",
    };
    const response = await fileService.upload(bucket, file);
    expect(response.config.headers["Content-Type"]).toContain("multipart/form-data");
  });

  test("Test `@Multipart` decorator 1.", async () => {
    const messagingService = new ServiceBuilder().setEndpoint(url).build(MessagingService);
    const from = { value: "+11111111" };
    const to = { value: ["+22222222", "+33333333"] };
    const response = await messagingService.createSMS(from, to);
    expect(response.config.headers["Content-Type"]).toContain("multipart/form-data");
  });

  test("Test `@ResponseType` decorator.", async () => {
    const fileService = new ServiceBuilder().setEndpoint(url).build(FileService);
    const response = await fileService.getFile("x-y-z");
    expect(response.config.responseType).toEqual("stream");
  });
});
