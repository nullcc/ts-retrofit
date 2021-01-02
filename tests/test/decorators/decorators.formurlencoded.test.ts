import { ServiceBuilder } from "../../../src/service.builder";
import { testServer } from "../../testHelpers";
import { CHARSET_UTF_8, CONTENT_TYPE, CONTENT_TYPE_HEADER } from "../../../src/constants";
import { FormUrlEncodedService } from "../../fixture/fixtures.formurlencoded";

describe("Decorators - @FormUrlEncoded", () => {
  let service: FormUrlEncodedService;

  beforeAll(() => {
    service = new ServiceBuilder().baseUrl(testServer.url).build(FormUrlEncodedService);
  });

  const object = {
    param1: 1,
    param2: "a",
    param3: true,
  };

  const objectFieldsAsString = {
    param1: "1",
    param2: "a",
    param3: "true",
  };

  test("Primitive types", async () => {
    const response = await service.formUrlEncoded(object.param1, object.param2, object.param3);

    expect(response.data).toMatchObject(objectFieldsAsString);
    expect(response.config.headers[CONTENT_TYPE_HEADER]).toEqual(`${CONTENT_TYPE.FORM_URL_ENCODED};${CHARSET_UTF_8}`);
    expect(response.config.data).toEqual(`param1=${object.param1}&param2=${object.param2}&param3=${object.param3}`);
  });

  test("With @Body", async () => {
    const response = await service.formUrlEncodedWithBody(object);

    expect(response.data).toMatchObject(objectFieldsAsString);
    expect(response.config.headers[CONTENT_TYPE_HEADER]).toEqual(`${CONTENT_TYPE.FORM_URL_ENCODED};${CHARSET_UTF_8}`);
    expect(response.config.data).toEqual(`param1=${object.param1}&param2=${object.param2}&param3=${object.param3}`);
  });

  test("With @FieldMap", async () => {
    const response = await service.formUrlEncodedWithFieldMap(object);

    expect(response.data).toMatchObject(objectFieldsAsString);
    expect(response.config.headers[CONTENT_TYPE_HEADER]).toEqual(`${CONTENT_TYPE.FORM_URL_ENCODED};${CHARSET_UTF_8}`);
    expect(response.config.data).toEqual(`param1=${object.param1}&param2=${object.param2}&param3=${object.param3}`);
  });
});
