import * as http from "http";
import * as fs from "fs";
import { app } from "./server";
import { ServiceBuilder } from "../src";
import {
  TEST_SERVER_ENDPOINT, API_PREFIX, TOKEN, UserService, SearchService,
  PostService, AuthService, FileService, MessagingService, User, SearchQuery, Auth, Post,
  TEST_SERVER_PORT,
} from "./fixtures";

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
      age: 18
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

  test("Test `@Body` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const newUser: User = {
      name: "Jane",
      age: 18
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
    const response = await postService.createPost3({ 'X-Foo': 'foo', 'X-Bar': 'bar'}, post);
    expect(response.config.headers["X-Foo"]).toEqual('foo');
    expect(response.config.headers["X-Bar"]).toEqual('bar');
  });

  test("Test `@Queries` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.getPosts();
    expect(response.config.params).toMatchObject({
      page: 1,
      size: 20,
      sort: "createdAt:desc"
    });
  });

  test("Test `@Query` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.getPosts1('typescript');
    expect(response.config.params.group).toEqual('typescript');
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
    const file = {
      value: fs.readFileSync('test/pic.png'),
      filename: "pic.png",
    };
    const response = await fileService.upload(bucket, file);
    expect(response.config.headers["Content-Type"]).toContain("multipart/form-data");
  });

  test("Test `@Multipart` decorator 1.", async () => {
    const fileService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(FileService);
    const bucket = {
      value: "test-bucket",
    };
    const files = [
      {
        value: fs.readFileSync('test/pic.png'),
        filename: "pic.png",
      }
    ];
    const response = await fileService.uploadMulti(bucket, files);
    expect(response.config.headers["Content-Type"]).toContain("multipart/form-data");
  });

  test("Test `@Multipart` decorator 2.", async () => {
    const messagingService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(MessagingService);
    const from = { value: '+11111111' };
    const to = { value: [ '+22222222', '+33333333' ] };
    const response = await messagingService.createSMS(from, to);
    expect(response.config.headers["Content-Type"]).toContain("multipart/form-data");
  });
});
