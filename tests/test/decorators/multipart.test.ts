import { ServiceBuilder } from "../../../src";
import { testServer } from "../../testHelpers";
import fs from "fs";
import { CONTENT_TYPE, CONTENT_TYPE_HEADER } from "../../../src/constants";
import { FileService, MessagingService } from "../../fixture/fixtures.multipart";

describe("Decorators - Multipart", () => {
  test("@Multipart", async () => {
    const fileService = new ServiceBuilder().baseUrl(testServer.url).build(FileService);
    const bucket = {
      value: "test-bucket",
    };
    const file = {
      value: fs.readFileSync("tests/fixture/pic.png"),
      filename: "pic.png",
    };
    const response = await fileService.upload(bucket, file);
    expect(response.config.headers![CONTENT_TYPE_HEADER]).toContain(CONTENT_TYPE.MULTIPART_FORM_DATA);
  });

  test("@Multipart - test2", async () => {
    const messagingService = new ServiceBuilder().baseUrl(testServer.url).build(MessagingService);
    const from = { value: "+11111111" };
    const to = { value: ["+22222222", "+33333333"] };
    const response = await messagingService.createSMS(from, to);
    expect(response.config.headers![CONTENT_TYPE_HEADER]).toContain(CONTENT_TYPE.MULTIPART_FORM_DATA);
  });

  test("@ResponseType", async () => {
    const fileService = new ServiceBuilder().baseUrl(testServer.url).build(FileService);
    const response = await fileService.getFile("x-y-z");
    expect(response.config.responseType).toEqual("stream");
  });
});
