import * as http from "http";
import { app } from "./server";
import { ServiceBuilder } from "../src";
import {
  TEST_SERVER_ENDPOINT, API_PREFIX, TOKEN, UserService, SearchService,
  PostService, AuthService, IUser, ISearchQuery, IAuth, IPost, TEST_SERVER_PORT
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
    const newUser: IUser = {
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

  test("Test `@PathParam` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const response = await userService.getUser(TOKEN, userId);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/users/${userId}`);
  });

  test("Test `@QueryMap` decorator.", async () => {
    const searchService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(SearchService);
    const query: ISearchQuery = {
      title: "TypeScript",
      author: "John Doe",
    };
    const response = await searchService.search(TOKEN, query);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}${API_PREFIX}/search`);
    expect(response.config.params).toMatchObject(query);
  });

  test("Test `@Body` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const newUser: IUser = {
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
    const auth: IAuth = {
      username: "test",
      password: "123456",
    };
    const response = await authService.auth(auth);
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded");
    expect(response.config.headers["Accept"]).toEqual("application/json");
  });

  test("Test `@Header` decorator.", async () => {
    const userService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const response = await userService.getUsers(TOKEN);
    expect(response.config.headers["X-Token"]).toEqual(TOKEN);
  });

  test("Test `@Query` decorator.", async () => {
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

  test("Test `@FormUrlEncoded` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost("hello", "world");
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded; charset=UTF-8");
  });

  test("Test `@Field` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost("hello", "world");
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded; charset=UTF-8");
    expect(response.config.data).toEqual("title=hello&content=world");
  });

  test("Test `@FieldMap` decorator.", async () => {
    const postService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(PostService);
    const response = await postService.createPost2({ title: "hello", content: "world" });
    expect(response.config.headers["Content-Type"]).toEqual("application/x-www-form-urlencoded; charset=UTF-8");
    expect(response.config.data).toEqual("title=hello&content=world");
  });
});
