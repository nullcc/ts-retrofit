import { PostsApiService } from "../../fixture/fixtures";
import { ServiceBuilder } from "../../../src/service.builder";
import { JSONPLACEHOLDER_URL, verifyRequest } from "../../testHelpers";
import { Response } from "../../../src";
import { Method } from "axios";

describe.skip("Decorators - with FormUrlEncoded", () => {
  let service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(PostsApiService);

  test("@FormUrlEncoded", async () => {
    const response = await service.formUrlEncoded(
      PostsApiService.dto.userId,
      PostsApiService.dto.title,
      PostsApiService.dto.body,
    );
    expect(response.data).toMatchObject(PostsApiService.dto);
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded;charset=utf-8");
    expect(response.config.data).toEqual("title=hello&content=world");

    verifyRequest(response, "post", "/posts/", 201);
  });

  test("@FormUrlEncoded with @Body", async () => {
    const response = await service.formUrlEncodedWithBody(PostsApiService.dto);
    expect(response.data).toMatchObject(PostsApiService.dto);

    verifyRequest(
      response,
      "post",
      "/posts/",
      201,
      //"body=updatedBody&title=updatedTitle&userId=100",
      //PostsApiService.dto,
    );
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded;charset=utf-8");
  });

  test("@FieldMap", async () => {
    const response = await service.fieldMap(PostsApiService.dto);
    //expect(response.data).toMatchObject(createUpdateDTO);

    verifyRequest(
      response,
      "post",
      "/posts/",
      201,
      //"body=updatedBody&title=updatedTitle&userId=100",
      //PostsApiService.dto,
    );
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded;charset=utf-8");
  });

  function verifyRequestResponseBody<T>(
    response: Response,
    expectedRequestBody?: T | string,
    expectedResponseBody?: T,
  ) {
    if (!expectedRequestBody) return;

    if (typeof expectedRequestBody === "string") {
      expect(response.config.data).toBe(expectedRequestBody);
    } else {
      expect(response.config.data).toBe(JSON.stringify(expectedRequestBody));
      expect(response.data).toMatchObject(expectedRequestBody);
    }

    if (expectedResponseBody) {
      expect(response.data).toMatchObject(expectedResponseBody);
    }
  }
});
