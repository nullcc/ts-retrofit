import * as http from "http";
import * as fs from "fs";
import axios, { InternalAxiosRequestConfig } from "axios";
import { app } from "./fixture/server";
import { ServiceBuilder, RequestInterceptorFunction, ResponseInterceptorFunction, RequestInterceptor } from "../src";
import {
  TEST_SERVER_ENDPOINT,
  TEST_SERVER_PORT,
  API_PREFIX,
  TOKEN,
  UserService,
  SearchService,
  GroupService,
  PostService,
  AuthService,
  FileService,
  MessagingService,
  User,
  SearchQuery,
  Auth,
  Post,
  Group,
  InterceptorService,
  TransformerService,
  TimeoutService,
  ResponseStatusService,
  ConfigService,
  AbsoluteURLService,
  HealthService,
  GraphQLService,
} from "./fixture/fixtures";
import { HttpContentType } from "../src/constants";
import { RequestConfig, Response } from "../src";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    standaloneId?: string;
  }
}

describe("Test ts-retrofit.", () => {

  let server: http.Server;

  beforeAll(() => {
    server = app.listen(TEST_SERVER_PORT);
  });

  afterAll(() => {
    server.close();
  });

  test("Test `@BasePath` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const response = await userService.getUsers(TOKEN);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users`);
  });

  test("Test `@GET` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const response = await userService.getUsers(TOKEN);
    expect(response.config.method).toEqual("get");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users`);
  });

  test("Test `@POST` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const newUser: User = {
      name: "Jane",
      age: 18,
    };
    const response = await userService.createUser(TOKEN, newUser);
    expect(response.config.method).toEqual("post");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users`);
  });

  test("Test `@PUT` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const name = "Johnny";
    const age = 21;
    const country = "US";
    const user = { name, age, country };
    const response = await userService.replaceUser(TOKEN, userId, user);
    expect(response.config.method).toEqual("put");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`);
  });

  test("Test `@PATCH` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const age = 21;
    const user = { age };
    const response = await userService.updateUser(TOKEN, userId, user);
    expect(response.config.method).toEqual("patch");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`);
  });

  test("Test `@DELETE` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.deleteUser(TOKEN, userId);
    expect(response.config.method).toEqual("delete");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`);
  });

  test("Test `@HEAD` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.headUser(TOKEN, userId);
    expect(response.config.method).toEqual("head");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`);
  });

  test("Test `@OPTIONS` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.optionsUser(TOKEN, userId);
    expect(response.config.method).toEqual("options");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`);
  });

  test("Test `@Path` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.getUser(TOKEN, userId);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`);
  });

  test("Test `@Path` decorator 1.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.getUser1(TOKEN, userId);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/uid-${userId}`);
  });

  test("Test `@Body` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const newUser: User = {
      name: "Jane",
      age: 18,
    };
    const response = await userService.createUser(TOKEN, newUser);
    expect(response.config.data).toEqual(JSON.stringify(newUser));
  });

  test("Test `@Headers` decorator.", async () => {
    const authService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(AuthService);
    const auth: Auth = {
      username: "test",
      password: "123456",
    };
    const response = await authService.auth(auth);
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded;charset=utf-8");
    expect(response.config.headers["Accept"]).toEqual("application/json");
  });

  test("Test `@Header` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const response = await userService.getUsers(TOKEN);
    expect(response.config.headers["X-Token"]).toEqual(TOKEN);
  });

  test("Test `@HeaderMap` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const post: Post = { title: "hello", content: "world" };
    const response = await postService.createPost3({ "X-Foo": "foo", "X-Bar": "bar" }, post);
    expect(response.config.headers["X-Foo"]).toEqual("foo");
    expect(response.config.headers["X-Bar"]).toEqual("bar");
  });

  test("Test `@Queries` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.getPosts();
    expect(response.config.params).toMatchObject({
      page: 1,
      size: 20,
      sort: "createdAt:desc",
    });
  });

  test("Test `@Query` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.getPosts1("typescript");
    expect(response.config.params.group).toEqual("typescript");
  });

  test("Test `@QueryArrayFormat` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);

    const response1 = await postService.getPostsWithQueryArrayFormatIndices(["typescript", "ruby", "python"]);
    expect(response1.request.path).toEqual("/api/v1/posts?groups%5B0%5D=typescript&groups%5B1%5D=ruby&groups%5B2%5D=python");

    const response2 = await postService.getPostsWithQueryArrayFormatBrackets(["typescript", "ruby", "python"]);
    expect(response2.request.path).toEqual("/api/v1/posts?groups%5B%5D=typescript&groups%5B%5D=ruby&groups%5B%5D=python");

    const response3 = await postService.getPostsWithQueryArrayFormatRepeat(["typescript", "ruby", "python"]);
    expect(response3.request.path).toEqual("/api/v1/posts?groups=typescript&groups=ruby&groups=python");

    const response4 = await postService.getPostsWithQueryArrayFormatComma(["typescript", "ruby", "python"]);
    expect(response4.request.path).toEqual("/api/v1/posts?groups=typescript%2Cruby%2Cpython");
  });

  test("Test `@QueryMap` decorator.", async () => {
    const searchService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(SearchService);
    const query: SearchQuery = {
      title: "TypeScript",
      author: "John Doe",
    };
    const response = await searchService.search(TOKEN, query);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/search`);
    expect(response.config.params).toMatchObject(query);
  });

  test("Test `@FormUrlEncoded` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost("hello", "world");
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded;charset=utf-8");
  });

  test("Test `@FormUrlEncoded` decorator with nested object.", async () => {
    const groupService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(GroupService);
    const group: Group = {
      name: "Video Game",
      description: "Video game group!",
      members: [1, 2, 3],
      tags: ["video", "game", "PS4", "XBox"],
    };
    const response = await groupService.createGroup(group);
    expect(response.config.data).toEqual("name=Video%20Game&description=Video%20game%20group%21&members=%5B1%2C2%2C3%5D&tags=%5B%22video%22%2C%22game%22%2C%22PS4%22%2C%22XBox%22%5D");
  });

  test("Test `@Field` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost("hello", "world");
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded;charset=utf-8");
    expect(response.config.data).toEqual("title=hello&content=world");
  });

  test("Test `@FieldMap` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost2({ title: "hello", content: "world" });
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded;charset=utf-8");
    expect(response.config.data).toEqual("title=hello&content=world");
  });

  test("Test `@Multipart` decorator.", async () => {
    const fileService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(FileService);
    const bucket = {
      value: "test-bucket",
    };
    const metadata = {
      value: JSON.stringify({ tag: "logo" }),
      contentType: "application/json",
    };
    const file = {
      value: fs.readFileSync("test/fixture/pic.png"),
      filename: "pic.png",
      contentType: "image/png",
    };
    const response = await fileService.upload(bucket, metadata, file);
    expect(response.config.headers["Content-Type"]).toContain("multipart/form-data");
  });

  test("Test `@Multipart` decorator 1.", async () => {
    const messagingService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(MessagingService);
    const from = { value: "+11111111" };
    const to = { value: ["+22222222", "+33333333"] };
    const response = await messagingService.createSMS(from, to);
    expect(response.config.headers["Content-Type"]).toContain("multipart/form-data");
  });

  test("Test multi-standalone services", async () => {
    const standaloneId1 = Math.random().toString();
    const axiosInstance1 = axios.create();
    axiosInstance1.interceptors.response.use((value) => {
      value.config.standaloneId = standaloneId1;
      return value;
    });
    const userService1 = new ServiceBuilder()
      .setStandalone(axiosInstance1)
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);

    const response1 = await userService1.getUsers(TOKEN);
    expect(response1.config.standaloneId).toEqual(standaloneId1);

    const standaloneId2 = Math.random().toString();
    const axiosInstance2 = axios.create();
    axiosInstance2.interceptors.response.use((value) => {
      value.config.standaloneId = standaloneId2;
      return value;
    });
    const userService2 = new ServiceBuilder()
      .setStandalone(axiosInstance2)
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);

    const response2 = await userService2.getUsers(TOKEN);
    expect(response2.config.standaloneId).toEqual(standaloneId2);

    const standaloneId3 = Math.random().toString();
    const axiosInstance3 = axios.create();
    axiosInstance3.interceptors.response.use((value) => {
      value.config.standaloneId = standaloneId3;
      return value;
    });
    const userService3 = new ServiceBuilder()
      .setStandalone(axiosInstance3)
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);

    const response3 = await userService3.getUsers(TOKEN);
    expect(response3.config.standaloneId).toEqual(standaloneId3);
  });

  test("Test Request Interceptors", async () => {
    const requestInterceptor: RequestInterceptorFunction = (config) => {
      switch (config.method) {
        case "GET":
        case "get":
          if (typeof config.params !== "object") { config.params = {}; }
          config.params.role = "interceptor";
          break;
        case "POST":
        case "post":
          const data = config.data;
          const body: { [key: string]: string } = {};
          if (typeof data === "string" && data.length) {
            const list = data.split("&").map((v) => v.split("="));
            for (const [key, value] of list) {
              body[key] = value;
            }
          } else if (typeof data === "object") {
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const element = data[key];
                body[key] = element;
              }
            }
          }
          body.role = "interceptor";
          config.data = Object.entries(body).map((v) => v.join("=")).join("&");
          break;
        default:
          break;
      }
      return config;
    };

    const interceptorService = new ServiceBuilder()
      .setStandalone(true)
      .setRequestInterceptors(requestInterceptor)
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(InterceptorService);

    const response1 = await interceptorService.getParams();
    expect(response1.config.params.role).toEqual("interceptor");
    expect(response1.data.role).toEqual("interceptor");

    const response2 = await interceptorService.createParams({ title: "title", content: "content" });
    expect(response2.data.role).toEqual("interceptor");
  });

  test("Test Response Interceptors", async () => {
    const standaloneId = "im a interceptor";

    // tslint:disable-next-line:no-shadowed-variable
    const responseInterceptor: ResponseInterceptorFunction = (response) => {
      response.config.standaloneId = standaloneId;
      return response;
    };

    const userService = new ServiceBuilder()
      .setStandalone(true)
      .setResponseInterceptors(responseInterceptor)
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);

    const response = await userService.getUsers(TOKEN);
    expect(response.config.standaloneId).toEqual(standaloneId);
  });

  test("Test Interceptor Abstract Class", async () => {
    class AddHeaderInterceptor extends RequestInterceptor {
      public role = "interceptor";

      public onFulfilled(config: InternalAxiosRequestConfig) {
        switch (config.method) {
          case "get":
          case "GET":
            if (typeof config.headers === "object") {
              config.headers["X-Role"] = this.role;
            }
            break;

          default:
            break;
        }
        return config;
      }
    }

    const interceptorService = new ServiceBuilder()
      .setStandalone(true)
      .setRequestInterceptors(new AddHeaderInterceptor())
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(InterceptorService);

    const response = await interceptorService.getHeader();
    expect(response.data.role).toEqual("interceptor");
  });

  test("Test `@ResponseType` decorator.", async () => {
    const fileService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(FileService);
    const response = await fileService.getFile("x-y-z");
    expect(response.config.responseType).toEqual("stream");
  });

  test("Test `@Get` decorator and path is absolute URL.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const response = await service.getUsersOther(TOKEN);
    expect(response.config.method).toEqual("get");
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/users`);
  });

  test("Test `@RequestTransformer` decorator.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(TransformerService);
    const response = await service.createSomething({ name: "ts-retrofit" });
    expect(response.config.data).toEqual('{"name":"ts-retrofit","foo":"foo"}');
  });

  test("Test `@ResponseTransformer` decorator.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(TransformerService);
    const response = await service.getSomething();
    expect(response.data).toEqual({ foo: "foo" });
  });

  test("Test `setTimeout` method.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .setTimeout(3000)
      .build(TimeoutService);
    await expect(service.sleep5000()).rejects.toThrow(/timeout/);

    service.setTimeout(6000);
    const response = await service.sleep5000();
    expect(response.data).toEqual({});
  });

  test("Test `@Timeout` decorator.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(TimeoutService);
    await expect(service.timeoutIn3000()).rejects.toThrow(/timeout/);
  });

  test("The timeout in `@Timeout` decorator should shield the value in `setTimeout` method.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .setTimeout(3000)
      .build(TimeoutService);
    const response = await service.timeoutIn6000();
    expect(response.config.timeout).toEqual(6000);
    expect(response.data).toEqual({});
  });

  test("Test `@ResponseStatus` decorator.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(ResponseStatusService);
    expect(service.__meta__.getSomething.responseStatus).toEqual(200);
  });

  test("Test `@Config` decorator.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(ConfigService);
    const response = await service.getConfig();
    expect(response.config.maxRedirects).toEqual(1);
  });

  test("Test absolute URL.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(AbsoluteURLService);
    try {
      const response = await service.getSomethingAbsolute();
    } catch (err) {
      // @ts-ignore
      expect(err.config.url).toEqual("https://absolute-foobar.com");
    }
  });

  test("Test `ignoreBasePath` in HTTP method option.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(HealthService);
    const response = await service.ping();
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/ping`);
    expect(response.data).toEqual({ result: "pong" });
  });

  test("Test `@GraphQL` decorator.", async () => {
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(GraphQLService);

    const response1 = await service.graphql1(
      {
        name: "ts-retrofit",
        owner: "nullcc",
      },
    );
    expect(response1.config.data).toEqual("{\"query\":\"query ($name: String!, $owner: String!) {\\n  viewer {\\n    name\\n    location\\n  }\\n  repository(name: $name, owner: $owner) {\\n    stargazerCount\\n    forkCount\\n  }\\n}\",\"variables\":{\"name\":\"ts-retrofit\",\"owner\":\"nullcc\"}}");
    expect(response1.data).toEqual({
      data: {
        viewer: {
          name: "nullcc",
          location: "Xiamen China" },
        repository: {
          stargazerCount: 45,
          forkCount: 11,
        },
      },
    });

    const response2 = await service.graphql2(
      {
        name: "ts-retrofit",
        owner: "nullcc",
      },
    );
    expect(response2.config.data).toEqual("{\"query\":\"query ($name: String!, $owner: String!) {\\n  viewer {\\n    name\\n    location\\n  }\\n  repository(name: $name, owner: $owner) {\\n    stargazerCount\\n    forkCount\\n  }\\n}\",\"operationName\":\"UserAndRepo\",\"variables\":{\"name\":\"ts-retrofit\",\"owner\":\"nullcc\"}}");
    expect(response2.data).toEqual({
      data: {
        viewer: {
          name: "nullcc",
          location: "Xiamen China" },
        repository: {
          stargazerCount: 45,
          forkCount: 11,
        },
      },
    });

    const response3 = await service.graphql3();
    expect(response3.config.data).toEqual("{\"query\":\"query ($name: String!, $owner: String!) {\\n  viewer {\\n    name\\n    location\\n  }\\n  repository(name: $name, owner: $owner) {\\n    stargazerCount\\n    forkCount\\n  }\\n}\",\"operationName\":\"UserAndRepo\"}");
    expect(response3.data).toEqual({
      data: {
        viewer: {
          name: "nullcc",
          location: "Xiamen China" },
        repository: {
          stargazerCount: 45,
          forkCount: 11,
        },
      },
    });
  });

  test("Test log callback with ok response.", async () => {
    const myLogCallback = (config: RequestConfig, response: Response) => {
      const log = `[${config.method}] ${config.url} ${response.status}`;
      expect(log).toEqual("[GET] http://localhost:12345/ping 200");
    };
    const myLogCallback2 = (config: RequestConfig, response: Response) => {
      const log = `-> [${config.method}] ${config.url} ${response.status}`;
      expect(log).toEqual("-> [GET] http://localhost:12345/ping 200");
    };
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .setLogCallback(myLogCallback)
      .build(HealthService);
    const response1 = await service.ping();
    expect(response1.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/ping`);
    expect(response1.data).toEqual({ result: "pong" });

    service.setLogCallback(myLogCallback2);
    const response2 = await service.ping();
    expect(response2.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/ping`);
    expect(response2.data).toEqual({ result: "pong" });
  });

  test("Test log callback with error response.", async () => {
    const myLogCallback = (config: RequestConfig, response: Response) => {
      const log = `[${config.method}] ${config.url} ${response.status}`;
      expect(log).toEqual("[GET] http://localhost:12345/boom 404");
    };
    const service = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .setLogCallback(myLogCallback)
      .build(HealthService);
    try {
      await service.boom();
    } catch (err) {
      // @ts-ignore
      expect(err.response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/boom`);
      // @ts-ignore
      expect(err.response.status).toEqual(404);
    }
  });

  test("Test `@Deprecated` decorator.", async () => {
    const userId = 1;
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const response = await userService.getUserPets(TOKEN, userId);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/1/pets`);
  });
});
