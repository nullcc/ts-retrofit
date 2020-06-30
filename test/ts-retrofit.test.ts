import * as http from "http";
import * as fs from "fs";
import axios, { AxiosRequestConfig } from "axios";
import { app } from "./fixture/server";
import {
  ServiceBuilder,
  RequestInterceptorFunction,
  ResponseInterceptorFunction,
  RequestInterceptor,
} from "../src";
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
} from "./fixture/fixtures";
import { DATA_CONTENT_TYPES, HttpContentType } from "../src/constants";

declare module "axios" {
  interface AxiosRequestConfig {
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
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users`
    );
  });

  test("Test `@GET` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);

    const response = await userService.getUsers(TOKEN);
    expect(response.config.method).toEqual("get");
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users`
    );
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
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users`
    );
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
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`
    );
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
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`
    );
  });

  test("Test `@DELETE` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.deleteUser(TOKEN, userId);
    expect(response.config.method).toEqual("delete");
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`
    );
  });

  test("Test `@HEAD` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.headUser(TOKEN, userId);
    expect(response.config.method).toEqual("head");
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`
    );
  });

  test("Test `@OPTIONS` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.optionsUser(TOKEN, userId);
    expect(response.config.method).toEqual("options");
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`
    );
  });

  test("Test `@Path` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.getUser(TOKEN, userId);
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`
    );
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
    expect(response.config.headers["Content-Type"]).toEqual(
      "application/x-www-form-urlencoded;charset=utf-8"
    );
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
    const response = await postService.createPost3(
      { "X-Foo": "foo", "X-Bar": "bar" },
      post
    );
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

  test("Test `@QueryMap` decorator.", async () => {
    const searchService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(SearchService);
    const query: SearchQuery = {
      title: "TypeScript",
      author: "John Doe",
    };
    const response = await searchService.search(TOKEN, query);
    expect(response.config.url).toEqual(
      `${TEST_SERVER_ENDPOINT}${API_PREFIX}/search`
    );
    expect(response.config.params).toMatchObject(query);
  });

  test("Test `@FormUrlEncoded` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost("hello", "world");
    expect(response.config.headers["Content-Type"]).toEqual(
      "application/x-www-form-urlencoded;charset=utf-8"
    );
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
    expect(response.config.data).toEqual(
      "name=Video%20Game&description=Video%20game%20group%21&members=%5B1%2C2%2C3%5D&tags=%5B%22video%22%2C%22game%22%2C%22PS4%22%2C%22XBox%22%5D"
    );
  });

  test("Test `@Field` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost("hello", "world");
    expect(response.config.headers["Content-Type"]).toEqual(
      "application/x-www-form-urlencoded;charset=utf-8"
    );
    expect(response.config.data).toEqual("title=hello&content=world");
  });

  test("Test `@FieldMap` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost2({
      title: "hello",
      content: "world",
    });
    expect(response.config.headers["Content-Type"]).toEqual(
      "application/x-www-form-urlencoded;charset=utf-8"
    );
    expect(response.config.data).toEqual("title=hello&content=world");
  });

  test("Test `@Multipart` decorator.", async () => {
    const fileService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(FileService);
    const bucket = {
      value: "test-bucket",
    };
    const file = {
      value: fs.readFileSync("test/fixture/pic.png"),
      filename: "pic.png",
    };
    const response = await fileService.upload(bucket, file);
    expect(response.config.headers["Content-Type"]).toContain(
      "multipart/form-data"
    );
  });

  test("Test `@Multipart` decorator 1.", async () => {
    const messagingService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(MessagingService);
    const from = { value: "+11111111" };
    const to = { value: ["+22222222", "+33333333"] };
    const response = await messagingService.createSMS(from, to);
    expect(response.config.headers["Content-Type"]).toContain(
      "multipart/form-data"
    );
  });

  test("Test `@ActionFilter` decorator 1.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.getUser(TOKEN, userId);
    expect(response.headers["FilterDoesWork"]).toEqual(true);
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
          if (typeof config.params !== "object") config.params = {};
          config.params.role = "interceptor";
          break;
        case "POST":
        case "post":
          if (
            config.headers?.post["Content-Type"] === HttpContentType.urlencoded
          ) {
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
            body["role"] = "interceptor";
            config.data = Object.entries(body)
              .map((v) => v.join("="))
              .join("&");
          }
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

    const response2 = await interceptorService.createParams({
      title: "title",
      content: "content",
    });
    expect(response2.data.role).toEqual("interceptor");
  });

  test("Test Response Interceptors", async () => {
    const standaloneId = "im a interceptor";

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
      role = "interceptor";

      onFulfilled(config: AxiosRequestConfig) {
        switch (config.method) {
          case "get":
          case "GET":
            if (typeof config.headers?.get === "object") {
              config.headers.get["X-Role"] = this.role;
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
});
