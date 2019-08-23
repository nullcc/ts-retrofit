import {
  GET, POST, PUT, PATCH, DELETE, HEAD, BasePath, Header,
  Headers, PathParam, QueryMap, Body, BaseService, Response
} from "../src";
export const TEST_SERVER_HOST = "http://localhost";
export const TEST_SERVER_PORT = 12345;
export const TEST_SERVER_ENDPOINT = `${TEST_SERVER_HOST}:${TEST_SERVER_PORT}`;
export const API_PREFIX = "/api/v1";
export const TOKEN = "abcdef123456";

export interface User {
  id?: number;
  name: string;
  age: number;
  [x: string]: any;
}

export interface SearchQuery {
  title?: string;
  author?: string;
  category?: string;
}

export interface Auth {
  username: string;
  password: string;
}

@BasePath(API_PREFIX)
export class UserService extends BaseService {
  @GET("/users")
  async getUsers(@Header("X-Token") token: string): Promise<Response> { return <Response> {} };

  @GET("/users/{userId}")
  async getUser(@Header("X-Token") token: string, @PathParam("userId") userId: number): Promise<Response> { return <Response> {} };

  @POST("/users")
  async createUser(@Header("X-Token") token: string, @Body user: User): Promise<Response> { return <Response> {} };

  @PUT("/users/{userId}")
  async replaceUser(@Header("X-Token") token: string, @PathParam("userId") userId: number, @Body user: User): Promise<Response> { return <Response> {} };

  @PATCH("/users/{userId}")
  async updateUser(@Header("X-Token") token: string, @PathParam("userId") userId: number, @Body user: Partial<User>): Promise<Response> { return <Response> {} };

  @DELETE("/users/{userId}")
  async deleteUser(@Header("X-Token") token: string, @PathParam("userId") userId: number): Promise<Response> { return <Response> {} };

  @HEAD("/users/{userId}")
  async headUser(@Header("X-Token") token: string, @PathParam("userId") userId: number): Promise<Response> { return <Response> {} };
}

@BasePath(API_PREFIX)
export class SearchService extends BaseService {
  @GET("/search")
  async search(@Header("X-Token") token: string, @QueryMap query: SearchQuery): Promise<Response> { return <Response> {} };
}

@BasePath("")
export class AuthService extends BaseService {
  @POST("/oauth2/authorize")
  @Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  })
  async auth(@Body body: Auth): Promise<Response> { return <Response> {} };
}
