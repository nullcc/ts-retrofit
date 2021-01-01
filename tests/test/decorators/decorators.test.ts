import { JSONPLACEHOLDER_URL, verifyRequest } from "../../testHelpers";
import { ServiceBuilder } from "../../../src/service.builder";
import { PostsApiService, ServiceWithoutBasePath } from "../../fixture/fixtures";
import { Response } from "../../../src";
import { CONTENT_TYPE, CONTENT_TYPE_HEADER } from "../../../src/constants";

describe("Decorators", () => {
  const service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(PostsApiService);

  test("@BasePath", async () => {
    const response = await service.get();
    expect(response.config.url).toEqual(postsUrl());
  });

  test("@GET", async () => {
    const response = await service.get();
    expect(response.data).toHaveLength(100);

    verifyRequest(response, "get");
  });

  test("@GET - without base path", async () => {
    const service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(ServiceWithoutBasePath);
    const response = await service.get();

    expect(response.data).toHaveLength(100);

    verifyRequest(response, "get", "/posts");
  });

  test("@GET - ignore base path", async () => {
    const response = await service.getIgnoreBasePath();
    expect(response.data).toHaveLength(100);

    verifyRequest(response, "get", "/posts");
  });

  test("@GET - Absolute url", async () => {
    const response = await service.getAbsoluteUrl();
    expect(response.data).toHaveLength(100);

    verifyRequest(response, "get", "/posts");
  });

  test("@POST", async () => {
    const response = await service.post(PostsApiService.dto);

    verifyRequest(response, "post", "/posts/", 201);
    verifyBody(response, PostsApiService.dto);
  });

  test("@PUT", async () => {
    const response = await service.put(1, PostsApiService.dto);

    verifyRequest(response, "put", "/posts/1", 200);
    verifyBody(response, PostsApiService.dto);
  });

  test("@PATCH", async () => {
    const response = await service.patch(1, PostsApiService.dto);

    verifyRequest(response, "patch", "/posts/1", 200);
    verifyBody(response, PostsApiService.dto);
  });

  test("@DELETE", async () => {
    const response = await service.delete(1);
    verifyRequest(response, "delete", "/posts/1");
  });

  test("@HEAD", async () => {
    const response = await service.head(1);
    verifyRequest(response, "head", "/posts/1");
  });

  test("@OPTIONS", async () => {
    const response = await service.options(1);
    verifyRequest(response, "options", "/posts/1", 204);
  });

  test("@Headers", async () => {
    const response = await service.headers(PostsApiService.dto);
    expect(response.config.headers["Header1"]).toBe("Value1");
    expect(response.config.headers["Header2"]).toBe("Value2");
    verifyRequest(response, "post", "/posts/", 201);
  });

  test("@Header", async () => {
    const response = await service.header("Value1");
    expect(response.config.headers["Header"]).toBe("Value1");
    verifyRequest(response, "get");
  });

  test("@HeaderMap", async () => {
    const response = await service.headerMap({ h1: 1, h2: "v2", h3: true });
    expect(response.config.headers["h1"]).toBe(1);
    expect(response.config.headers["h2"]).toBe("v2");
    expect(response.config.headers["h3"]).toBe(true);
    verifyRequest(response, "get");
  });

  test("@Queries", async () => {
    const response = await service.queries();
    expect(response.config.params).toMatchObject({
      page: 1,
      size: 20,
      sort: "createdAt:desc",
    });
  });

  test("@Query", async () => {
    const response = await service.query(15);
    expect(response.config.params.userId).toBe(15);
  });

  test("@ResponseStatus", async () => {
    expect(service.__getServiceMetadata__().getMetadata("responseStatus").responseStatus).toEqual(200);
  });

  test("@Config", async () => {
    const response = await service.config();
    expect(response.config.maxRedirects).toEqual(3);
  });

  test("@Field", async () => {
    const response = await service.field(
      PostsApiService.dto.userId,
      PostsApiService.dto.title,
      PostsApiService.dto.body,
    );

    expect(response.config.headers[CONTENT_TYPE_HEADER]).toBe(CONTENT_TYPE.APPLICATION_JSON);

    verifyRequest(response, "post", "/posts/", 201);
    verifyBody(response, PostsApiService.dto);
  });

  test("@FieldMap", async () => {
    const response = await service.fieldMap(PostsApiService.dto);

    expect(response.config.headers[CONTENT_TYPE_HEADER]).toBe(CONTENT_TYPE.APPLICATION_JSON);

    verifyRequest(response, "post", "/posts/", 201);
    verifyBody(response, PostsApiService.dto);
  });

  test("@QueryMap", async () => {
    const response = await service.queryMap({ userId: 15, body: "b", title: "t" });
    expect(response.config.params.userId).toBe(15);
    expect(response.config.params.body).toBe("b");
    expect(response.config.params.title).toBe("t");

    verifyRequest(response, "get", "/posts/?userId=15&body=b&title=t");
  });

  function verifyBody<T>(response: Response, expectedRequestBody?: T) {
    if (!expectedRequestBody) return;

    expect(JSON.parse(response.config.data)).toMatchObject(expectedRequestBody);
    expect(response.data).toMatchObject(expectedRequestBody);
  }

  function postsUrl() {
    return `${JSONPLACEHOLDER_URL}${PostsApiService.BASE_PATH}/`;
  }
});
