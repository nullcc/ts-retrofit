import { AxiosResponse } from "axios";
import {
  Post,
  posts,
  PostsApiService,
  ResponseBodyPostsApiService,
  ServiceWithoutBasePath,
} from "../../fixture/fixtures";
import { ServiceBuilder } from "../../../src";
import { JSONPLACEHOLDER_URL, testServer, verifyRequest } from "../../testHelpers";
import { CONTENT_TYPE, CONTENT_TYPE_HEADER } from "../../../src/constants";

describe("Decorators - inlined response", () => {
  let service: ResponseBodyPostsApiService;

  beforeEach(() => {
    service = new ServiceBuilder()
      .saveRequestHistory()
      .baseUrl(testServer.url)
      .inlineResponseBody()
      .withRequestLogger({ showLogs: true, logLevel: "LOG" }) // to test logger
      .build(ResponseBodyPostsApiService);
  });

  test("__performRequest GET", async () => {
    const request = await service.__performRequest<Post[]>("get");
    expect(request.data).toHaveLength(posts.length);
    verifyRequest(request, "get");
  });

  test("@BasePath", async () => {
    await service.get();
    expect(service.__getLastRequest().config.url).toEqual(postsUrl());
  });

  test("@GET", async () => {
    const response = await service.get();
    expect(response).toHaveLength(posts.length);

    verifyRequest(service.__getLastRequest(), "get");
  });

  test("@GET - without base path", async () => {
    const service = new ServiceBuilder().baseUrl(testServer.url).build(ServiceWithoutBasePath);
    const response = await service.get();

    expect(response.data).toHaveLength(posts.length);

    verifyRequest(response, "get", "/posts");
  });

  test("@GET - ignore base path", async () => {
    const response = await service.getIgnoreBasePath();
    expect(response).toHaveLength(posts.length);

    verifyRequest(service.__getLastRequest(), "get", "/posts");
  });

  test("@GET - Absolute url", async () => {
    const service = new ServiceBuilder().baseUrl(JSONPLACEHOLDER_URL).build(PostsApiService);
    const response = await service.getAbsoluteUrl();
    expect(response.data).toHaveLength(100);
    verifyRequest(response, "get", "/posts");
  });

  test("@POST", async () => {
    const response = await service.post(PostsApiService.dto);
    const lastRequest = service.__getLastRequest();

    verifyRequest(lastRequest, "post", "/posts/", 201);
    verifyInlinedBody(response, lastRequest, PostsApiService.dto);
  });

  test("@PUT", async () => {
    const response = await service.put(1, PostsApiService.dto);
    const lastRequest = service.__getLastRequest();

    verifyRequest(lastRequest, "put", "/posts/1", 200);
    verifyInlinedBody(response, lastRequest, PostsApiService.dto);
  });

  test("@PATCH", async () => {
    const response = await service.patch(1, PostsApiService.dto);
    const lastRequest = service.__getLastRequest();

    verifyRequest(lastRequest, "patch", "/posts/1", 200);
    verifyInlinedBody(response, lastRequest, PostsApiService.dto);
  });

  test("@DELETE", async () => {
    await service.delete(1);
    verifyRequest(service.__getLastRequest(), "delete", "/posts/1");
  });

  test("@HEAD", async () => {
    await service.head(1);
    verifyRequest(service.__getLastRequest(), "head", "/posts/1");
  });

  test("@OPTIONS", async () => {
    await service.options(1);
    verifyRequest(service.__getLastRequest(), "options", "/posts/1", 204);
  });

  test("@Headers", async () => {
    await service.headers(PostsApiService.dto);
    const lastRequest = service.__getLastRequest();
    expect(lastRequest.config.headers!["Header1"]).toBe("Value1");
    expect(lastRequest.config.headers!["Header2"]).toBe("Value2");
    verifyRequest(lastRequest, "post", "/posts/", 201);
  });

  test("@Header", async () => {
    await service.header("Value1");
    const lastRequest = service.__getLastRequest();
    expect(lastRequest.config.headers!["Header"]).toBe("Value1");
    verifyRequest(lastRequest, "get");
  });

  test("@HeaderMap", async () => {
    await service.headerMap({ h1: 1, h2: "v2", h3: true });
    const lastRequest = service.__getLastRequest();
    expect(lastRequest.config.headers!["h1"]).toBe("1");
    expect(lastRequest.config.headers!["h2"]).toBe("v2");
    expect(lastRequest.config.headers!["h3"]).toBe("true");
    verifyRequest(lastRequest, "get");
  });

  test("@Queries", async () => {
    await service.queries();
    const lastRequest = service.__getLastRequest();
    expect(lastRequest.config.params).toMatchObject({
      page: 1,
      size: 20,
      sort: "createdAt:desc",
    });
  });

  test("@Query", async () => {
    await service.query(15);
    const lastRequest = service.__getLastRequest();
    expect(lastRequest.config.params.userId).toBe(15);
  });

  test("@ResponseStatus", async () => {
    expect(service.__getServiceMetadata().getMetadata("responseStatus").responseStatus).toEqual(200);
  });

  test("@Config", async () => {
    await service.config();
    expect(service.__getLastRequest().config.maxRedirects).toEqual(3);
  });

  test("@Field", async () => {
    const response = await service.field(
      PostsApiService.dto.userId,
      PostsApiService.dto.title,
      PostsApiService.dto.body,
    );

    const lastRequest = service.__getLastRequest();
    expect(lastRequest.config.headers![CONTENT_TYPE_HEADER]).toBe(CONTENT_TYPE.APPLICATION_JSON);

    verifyRequest(lastRequest, "post", "/posts/", 201);
    verifyInlinedBody(response, lastRequest, PostsApiService.dto);
  });

  test("@FieldMap", async () => {
    const response = await service.fieldMap(PostsApiService.dto);
    const lastRequest = service.__getLastRequest();

    expect(lastRequest.config.headers![CONTENT_TYPE_HEADER]).toBe(CONTENT_TYPE.APPLICATION_JSON);

    verifyRequest(lastRequest, "post", "/posts/", 201);
    verifyInlinedBody(response, lastRequest, PostsApiService.dto);
  });

  test("@QueryMap", async () => {
    await service.queryMap({ userId: 15, body: "b", title: "t" });
    const lastRequest = service.__getLastRequest();
    expect(lastRequest.config.params.userId).toBe(15);
    expect(lastRequest.config.params.body).toBe("b");
    expect(lastRequest.config.params.title).toBe("t");

    verifyRequest(lastRequest, "get", "/posts/?userId=15&body=b&title=t");
  });

  function verifyInlinedBody<T>(response: T, request: AxiosResponse<T>, expectedRequestBody?: T) {
    if (!expectedRequestBody) return;

    expect(JSON.parse(request.config.data)).toMatchObject(expectedRequestBody);
    expect(response).toMatchObject(expectedRequestBody);
  }

  function postsUrl() {
    return `${testServer.url}${PostsApiService.BASE_PATH}/`;
  }
});
