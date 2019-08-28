# ts-retrofit

A retrofit implementation in TypeScript.


## Usages

```typescript
import {
  GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, BasePath, Header, Query,
  Headers, PathParam, QueryMap, Body, FormUrlEncoded, BaseService, ServiceBuilder, Response
} from "ts-retrofit";
export const TEST_SERVER_HOST = "http://localhost";
export const TEST_SERVER_PORT = 12345;
export const TEST_SERVER_ENDPOINT = `${TEST_SERVER_HOST}:${TEST_SERVER_PORT}`;
export const API_PREFIX = "/api/v1";
export const TOKEN = "abcdef123456";

export interface IUser {
  id?: number;
  name: string;
  age: number;
  [x: string]: any;
}

export interface ISearchQuery {
  title?: string;
  author?: string;
  category?: string;
}

export interface IAuth {
  username: string;
  password: string;
}

export interface IPost {
  title: string;
  content: string;
}

@BasePath(API_PREFIX)
export class UserService extends BaseService {
  @GET("/users")
  async getUsers(@Header("X-Token") token: string): Promise<Response> { return <Response> {} };

  @GET("/users/{userId}")
  async getUser(@Header("X-Token") token: string, @PathParam("userId") userId: number): Promise<Response> { return <Response> {} };

  @POST("/users")
  async createUser(@Header("X-Token") token: string, @Body user: IUser): Promise<Response> { return <Response> {} };

  @PUT("/users/{userId}")
  async replaceUser(@Header("X-Token") token: string, @PathParam("userId") userId: number, @Body user: IUser): Promise<Response> { return <Response> {} };

  @PATCH("/users/{userId}")
  async updateUser(@Header("X-Token") token: string, @PathParam("userId") userId: number, @Body user: Partial<IUser>): Promise<Response> { return <Response> {} };

  @DELETE("/users/{userId}")
  async deleteUser(@Header("X-Token") token: string, @PathParam("userId") userId: number): Promise<Response> { return <Response> {} };

  @HEAD("/users/{userId}")
  async headUser(@Header("X-Token") token: string, @PathParam("userId") userId: number): Promise<Response> { return <Response> {} };

  @OPTIONS("/users/{userId}")
  async optionsUser(@Header("X-Token") token: string, @PathParam("userId") userId: number): Promise<Response> { return <Response> {} };
}

@BasePath(API_PREFIX)
export class SearchService extends BaseService {
  @GET("/search")
  async search(@Header("X-Token") token: string, @QueryMap query: ISearchQuery): Promise<Response> { return <Response> {} };
}

@BasePath("")
export class AuthService extends BaseService {
  @POST("/oauth2/authorize")
  @Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json"
  })
  async auth(@Body body: IAuth): Promise<Response> { return <Response> {} };
}

@BasePath(API_PREFIX)
export class PostService extends BaseService {
  @GET("/posts")
  @Query({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async getPosts(): Promise<Response> { return <Response> {} };

  @POST("/posts")
  @FormUrlEncoded()
  async createPost(@Body body: IPost): Promise<Response> { return <Response> {} };
}

(async () => {
  const userService = new ServiceBuilder()
    .setEndpoint(TEST_SERVER_ENDPOINT)
    .build(UserService);
  const response = await userService.getUsers(TOKEN);
  // use response.data ...
})()
```

## Decorators

|     Category     |      Name       |                         Description                          | Decorator Position |                           Example                            |
| :--------------: | :-------------: | :----------------------------------------------------------: | :----------------: | :----------------------------------------------------------: |
|   HTTP Method    |      @GET       |                          GET Method                          |       Method       |                        @GET("/users")                        |
|   HTTP Method    |      @POST      |                         POST Method                          |       Method       |                       @POST("/users")                        |
|   HTTP Method    |      @PUT       |                          PUT Method                          |       Method       |                   @PUT("/users/{userId}")                    |
|   HTTP Method    |     @PATCH      |                         PATCH Method                         |       Method       |                  @PATCH("/users/{userId}")                   |
|   HTTP Method    |     @DELETE     |                        DELETE Method                         |       Method       |                  @DELETE("/users/{userId}")                  |
|   HTTP Method    |      @HEAD      |                         HEAD Method                          |       Method       |                   @HEAD("/users/{userId}")                   |
|   HTTP Method    |    @OPTIONS     |                        OPTIONS Method                        |       Method       |                 @OPTIONS("/users/{userId}")                  |
|    Base Path     |    @BasePath    |    Specifying the base path of a series of API endpoints     |       Class        |                     @BasePath("/api/v1")                     |
|  Static Headers  |    @Headers     |        Specifying the static headers of API endpoint         |       Method       | @Headers({ "Content-Type": "application/x-www-form-urlencoded",   "Accept": "application/json" }) |
| Header Parameter |     @Header     |                    Parameterizing header                     |  Method Parameter  |                      @Header("X-Token")                      |
|  Path Parameter  |   @PathParam    |             Specifying parameter in path of API              |  Method Parameter  |                     @PathParam("userId")                     |
|       Body       |      @Body      |                     Specifying body data                     |  Method Parameter  |                            @Body                             |
|   Static Query   |     @Query      |                 Specifying static query data                 |       Method       | @Query({   page: 1,   size: 20,   sort: "createdAt:desc" })  |
| Query Parameters |    @QueryMap    |                     Parameterizing query                     |  Method Parameter  |                          @QueryMap                           |
|  Static Headers  | @FormUrlEncoded | Specifying "Content-Type" to be "application/x-www-form-urlencoded" |       Method       |                      @FormUrlEncoded()                       |




## Test

```bash
npm test
```
