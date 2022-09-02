# ts-retrofit

[![build status](https://travis-ci.org/nullcc/ts-retrofit.svg?branch=master)](https://travis-ci.org/nullcc/ts-retrofit)
[![](https://img.shields.io/npm/dm/ts-retrofit.svg?style=flat)](https://www.npmjs.org/package/ts-retrofit)

| Statements                               | Branches                                 | Functions                                | Lines                               |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ----------------------------------- |
| ![Statements](#statements# "Make me better!") | ![Branches](#branches# "Make me better!") | ![Functions](#functions# "Make me better!") | ![Lines](#lines# "Make me better!") |

> A declarative and [axios](https://github.com/axios/axios) based retrofit implementation for JavaScript and TypeScript.

## Install

```bash
$ npm i ts-retrofit
```

## Quick Overview

Here is a typical service definition and usage:

```typescript
import { GET, POST, PUT, PATCH, DELETE, BasePath, Header, Path, Body, BaseService, ServiceBuilder, Response } from "ts-retrofit";

interface User {
  id?: number;
  name: string;
  email: string;
}

@BasePath("/api/v1")
class UserService extends BaseService {
  @GET("/users")
  async getUsers(@Header("Authorization") authorization: string): Promise<Response<Array<User>>> { return <Response<Array<User>>> {} };

  @GET("/users/{userId}")
  async getUser(@Header("Authorization") authorization: string, @Path("userId") userId: number): Promise<Response<User>> { return <Response<User>> {} };

  @POST("/users")
  async createUser(@Header("Authorization") authorization: string, @Body user: User): Promise<Response> { return <Response> {} };

  @PUT("/users/{userId}")
  async updateUser(@Header("Authorization") authorization: string, @Path("userId") userId: number, @Body user: User): Promise<Response> { return <Response> {} };

  @PATCH("/users/{userId}")
  async patchUser(@Header("Authorization") authorization: string, @Path("userId") userId: number, @Body user: Partial<User>): Promise<Response> { return <Response> {} };

  @DELETE("/users/{userId}")
  async deleteUser(@Header("Authorization") authorization: string, @Path("userId") userId: number): Promise<Response> { return <Response> {} };
}

(async () => {
  const authorization = "foobar";
  const userService = new ServiceBuilder()
    .setEndpoint("https://www.your-host.com")
    .build(UserService);
  const response = await userService.getUsers(authorization);
  // Now you can get response data from response.data
})()
```

You can see [test file](test/ts-retrofit.test.ts) to get more examples.

## ServiceBuilder

Example:

```typescript
import { AxiosRequestConfig } from "axios";
import {
  ServiceBuilder,
  ResponseInterceptorFunction,
  RequestInterceptorFunction,
  RequestInterceptor,
  ResponseInterceptor,
} from "ts-retrofit";

@BasePath("/api/v1")
class ItemService extends BaseService {
  @GET("/items")
  async getItems(): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}

const RequestInterceptor: RequestInterceptorFunction = (config) => {
  console.log("Before sending request to server.");
  return config;
};

const ResponseInterceptor: ResponseInterceptorFunction = (response) => {
  console.log("After receiving response from server.");
  return response;
};

(async () => {
  const itemService = new ServiceBuilder()
	.setEndpoint(${ENDPOINT})
    .setStandalone(true)
    .setRequestInterceptors(RequestInterceptor)
    .setResponseInterceptors(ResponseInterceptor)
    .build(ItemService);
  const response: any = await itemService.getVersion();
  console.log(response.data);
})();

// outputs:
// Before sending request to server.
// After receiving response from server.
// <response data>
```

## Log

You can set log callback to print some information after request finished (ok/error):

```typescript
@BasePath("")
export class HealthService extends BaseService {
  @GET("/ping")
  @ResponseStatus(200)
  async ping(): Promise<Response> { return <Response>{} };
}
const myLogCallback = (config: RequestConfig, response: Response) => {
  const log = `[${config.method}] ${config.url} ${response.status}`;
  console.log(log); // [GET] http://localhost:12345/ping 200
};
const service = new ServiceBuilder()
  .setEndpoint("http://localhost:12345")
  .setLogCallback(myLogCallback)
  .build(HealthService);

// or use this
service.setLogCallback(myLogCallback);
const response = await service.ping();
```

## Decorators

### BasePath

* Position: Class

`BasePath` decorator declares the path prefix of a service.

```typescript
// The common path of ItemService is ${ENDPOINT}/api/v1
@BasePath("/api/v1")
class ItemService extends BaseService {}
```

### HTTP Method Decorators

All HTTP method decorators have an optional second parameter with type **HttpMethodOptions**:

```typescript
export interface HttpMethodOptions {
  ignoreBasePath?: boolean;
}
```

#### GET

* Position: Method

`GET` decorator declares that what it decorated use HTTP **GET** method to request server.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items
  @GET("/items")
  async getItems(): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };

  // GET ${ENDPOINT}/items
  @GET("/items", { ignoreBasePath: true })
  async getItemsWithoutBasePath(): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

#### POST

* Position: Method

`POST` decorator declares that what it decorated use HTTP **POST** method to request server.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // POST ${ENDPOINT}/api/v1/items
  @POST("/items")
  async createItem(@Body item: Item): Promise<Response> { return <Response> {} };
}
```

#### PUT

* Position: Method

`PUT` decorator declares that what it decorated use HTTP **PUT** method to request server.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // PUT ${ENDPOINT}/api/v1/items/{itemId}
  @PUT("/items/{itemId}")
  async updateItem(@Path("itemId") itemId: number, @Body item: Item): Promise<Response> { return <Response> {} };
}
```

#### PATCH

* Position: Method

`PATCH` decorator declares that what it decorated use HTTP **PATCH** method to request server. 

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // PATCH ${ENDPOINT}/api/v1/items/{itemId}
  @PATCH("/items/{itemId}")
  async patchItem(@Path("itemId") itemId: number, @Body item: Partial<Item>): Promise<Response> { return <Response> {} };
}
```

#### DELETE

* Position: Method

`DELETE` decorator declares that what it decorated use HTTP **DELETE** method to request server. 

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // DELETE ${ENDPOINT}/api/v1/items/{itemId}
  @DELETE("/items/{itemId}")
  async deleteItem(@Path("itemId") itemId: number): Promise<Response> { return <Response> {} };
}
```

#### HEAD

* Position: Method

`HEAD` decorator declares that what it decorated use HTTP **HEAD** method to request server. 

```typescript
@BasePath("/api/v1")
class FileService extends BaseService {
  // HEAD ${ENDPOINT}/api/v1/files/{fileId}
  @HEAD("/files/{fileId}")
  async getFileMetaInfo(@Path("fileId") fileId: number): Promise<Response> { return <Response> {} };
}
```

#### OPTIONS

* Position: Method

`OPTIONS` decorator declares that what it decorated use HTTP **OPTIONS** method to request server. 

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // OPTIONS ${ENDPOINT}/api/v1/items/{itemId}
  @OPTIONS("/items/{itemId}")
  async getFileMetaInfo(@Path("itemId") itemId: number): Promise<Response> { return <Response> {} };
}
```

### Headers

* Position: Method

`Headers` decorator declares that what **static HTTP headers** should be added to request. 

```typescript
@BasePath("")
export class AuthService extends BaseService {
  @POST("/oauth/token")
  @Headers({
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    "Accept": "application/json"
  })
  async auth(@Body body: OAuth): Promise<Response<Token>> { return <Response<Token>>{} };
}
```

### Header

* Position: Method Parameter

`Header` decorator parameterizes the header in HTTP request. Client can provide a value to **one header**.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items
  async getItems(@Header("Authorization") authorization: string): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### HeaderMap

- Position: Method Parameter

`HeaderMap` decorator parameterizes the headers in HTTP request. Client can provide values to **multi headers**.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items
  async getItems(@HeaderMap headers: any): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### Path

- Position: Method Parameter

`Path` decorator parameterizes the part of path in HTTP request.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items/{itemId}
  @GET("/items/{itemId}")
  async getItem(@Path("itemId") itemId: number): Promise<Response<Item>> { return <Response<Item>> {} };
}
```

### Body

- Position: Method Parameter

`Body` decorator parameterizes the body in HTTP request.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // POST ${ENDPOINT}/api/v1/items
  @POST("/items")
  async createItem(@Body item: Item): Promise<Response> { return <Response> {} };
}
```

### QueryArrayFormat

* Position: Method

`QueryArrayFormat` decorator declares that what kind of array format should be used in query.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // getItemsWithQueryArrayFormatIndices(["food", "book", "pet"])
  // GET ${ENDPOINT}/api/v1/items?categories[0]=food&categories[1]=book&categories[2]=pet
  @GET("/items")
  @QueryArrayFormat("indices")
  async getItemsWithQueryArrayFormatIndices(
    @Query("categories") categories: string[]
  ): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
  
  // getItemsWithQueryArrayFormatBrackets(["food", "book", "pet"])
  // GET ${ENDPOINT}/api/v1/items?categories[]=food&categories[]=book&categories[]=pet
  @GET("/items")
  @QueryArrayFormat("brackets")
  async getItemsWithQueryArrayFormatBrackets(
    @Query("categories") categories: string[]
  ): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
  
  // getItemsWithQueryArrayFormatRepeat(["food", "book", "pet"])
  // GET ${ENDPOINT}/api/v1/items?categories=food&categories=book&categories=pet
  @GET("/items")
  @QueryArrayFormat("repeat")
  async getItemsWithQueryArrayFormatRepeat(
    @Query("categories") categories: string[]
  ): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
  
  // getItemsWithQueryArrayFormatComma(["food", "book", "pet"])
  // GET ${ENDPOINT}/api/v1/items?categories=food,book,pet
  @GET("/items")
  @QueryArrayFormat("comma")
  async getItemsWithQueryArrayFormatComma(
    @Query("categories") categories: string[]
  ): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### Queries

- Position: Method

`Queries` decorator declares that what **static queries** should be added to request. 

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items?size=20
  @GET("/items")
  @Queries({
    size: 20,
  })
  async getItems(): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### Query

- Position: Method Parameter

`Query` decorator parameterizes the query in HTTP request. Client can provide a value to **one query parameter**.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items?size=20
  @GET("/items")
  async getItems(@Query('size') size: number): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### QueryMap

- Position: Method Parameter

`QueryMap` decorator parameterizes the queries in HTTP request. Client can provide values to **multi queries**.

```typescript
@BasePath("")
class SearchService extends BaseService {
  // GET ${ENDPOINT}/search?a=foo&b=bar
  @GET("/search")
  async search(@QueryMap query: SearchQuery): Promise<Response<SearchResult>> { return <Response<SearchResult>> {} };
}
```

### FormUrlEncoded

- Position: Method

`FormUrlEncoded` declares that the content type is **application/x-www-form-urlencoded;charset=utf-8** in HTTP request.

```typescript
@BasePath("")
export class AuthService extends BaseService {
  @POST("/oauth/token")
  @FormUrlEncoded
  async auth(@Body body: OAuth): Promise<Response<Token>> { return <Response<Token>>{} };
}
```

### Field

- Position: Method Parameter

`Field` decorator parameterizes the field in HTTP request. It only takes effect when method is decorated by **@FormUrlEncoded**.

```typescript
@BasePath("")
export class AuthService extends BaseService {
  @POST("/oauth/token")
  @FormUrlEncoded
  async auth(@Field("username") username: string, @Field("password") password: string): Promise<Response<Token>> { return <Response<Token>>{} };
}
```

### FieldMap

- Position: Method Parameter

`FieldMap` decorator parameterizes the field in HTTP request. It only takes effect when method is decorated by **@FormUrlEncoded**.

```typescript
@BasePath("")
export class AuthService extends BaseService {
  @POST("/oauth/token")
  @FormUrlEncoded
  async auth(@FieldMap fields: OAuth): Promise<Response<Token>> { return <Response<Token>>{} };
}
```

### Multipart

- Position: Method

`Multipart` decorator declares that the content type is **multipart/form-data** in HTTP request.

```typescript
@BasePath("/api/v1")
export class FileService extends BaseService {
  @POST("/upload")
  @Multipart
  async upload(@Part("bucket") bucket: PartDescriptor<string>, @Part("file") file: PartDescriptor<Buffer>): Promise<Response> { return <Response>{} };
}
```

### Part

- Position: Method Parameter

`Part` decorator parameterizes the part in HTTP request. It only takes effect when method is decorated by **@Multipart**.

```typescript
@BasePath("/api/v1")
export class FileService extends BaseService {
  @POST("/upload")
  @Multipart
  async upload(@Part("bucket") bucket: PartDescriptor<string>, @Part("file") file: PartDescriptor<Buffer>): Promise<Response> { return <Response>{} };
}
```

### ResponseType

- Position: Method
- Options: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

`ResponseType` decorator declares response type in axios config.

```typescript
@BasePath("/api/v1")
export class FileService extends BaseService {
  @GET("/file")
  @ResponseType("stream")
  async getFile(@Path("fileId") fileId: string): Promise<Response> { return <Response>{} };
}
```

### RequestTransformer

- Position: Method

`RequestTransformer` decorator provides a hook to handle request data before sending request to server.

```typescript
@BasePath(API_PREFIX)
export class TransformerService extends BaseService {
  @POST("/request-transformer")
  @RequestTransformer((data: any, headers?: any) => {
    data.foo = 'foo'; // add something to request data
    return JSON.stringify(data);
  })
  async createSomething(@Body body: Something): Promise<Response> { return <Response>{} };
}
```

### ResponseTransformer

- Position: Method

`ResponseTransformer` decorator provides a hook to handle response data after receiving response from server.

```typescript
@BasePath(API_PREFIX)
export class TransformerService extends BaseService {
  @POST("/request-transformer")
  @RequestTransformer((data: any, headers?: any) => {
    data.foo = 'foo';  // add something to response data
    return JSON.stringify(data);
  })
  async createSomething(@Body body: Something): Promise<Response> { return <Response>{} };
}
```

### Timeout

- Position: Method

`Timeout` decorator declares timeout in axios config.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items
  @GET("/items")
  @Timeout(3000)
  async getItems(): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### ResponseStatus

- Position: Method

`ResponseStatus` decorator declares status code for method, do nothing just a declaration.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items
  @GET("/items")
  @Timeout(3000)
  async getItems(): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### Config

- Position: Method

`Config` decorator provides a direct way to set config for a request in axios.

```typescript
@BasePath("/api/v1")
export class ConfigService extends BaseService {
  @GET("/config")
  @Config({
    maxRedirects: 1,
  })
  async getConfig(): Promise<Response> { return <Response>{} };
}
```

### GraphQL and GraphQLVariables

* Position: Method

`GraphQL` decorator declares query for a GraphQL request.

`GraphQLVariables` decorator declares variables for a GraphQL request.

```typescript
const gqlQuery =
`query ($name: String!, $owner: String!) {
  viewer {
    name
    location
  }
  repository(name: $name, owner: $owner) {
    stargazerCount
    forkCount
  }
}`;

@BasePath("")
export class GraphQLService extends BaseService {
  @POST("/graphql")
  @GraphQL(gqlQuery, "UserAndRepo")
  async graphql1(
    @GraphQLVariables variables: any,
  ): Promise<Response> { return <Response>{} };
}
```

### Deprecated

* Position: Method

`Deprecated` decorator marks a method is deprecated.

```typescript
@BasePath("/api/v1")
class ItemService extends BaseService {
  // GET ${ENDPOINT}/api/v1/items
  @GET("/items")
  @Deprecated("This method is deprecated")
  async getItems(): Promise<Response<Array<Item>>> { return <Response<Array<Item>>> {} };
}
```

### Decorators Summary

|      Category       |         Name         |                         Description                          | Decorator Position |                           Example                            |
| :-----------------: | :------------------: | :----------------------------------------------------------: | :----------------: | :----------------------------------------------------------: |
|     HTTP Method     |         @GET         |                          GET Method                          |       Method       |                        @GET("/users")                        |
|     HTTP Method     |        @POST         |                         POST Method                          |       Method       |                       @POST("/users")                        |
|     HTTP Method     |         @PUT         |                          PUT Method                          |       Method       |                   @PUT("/users/{userId}")                    |
|     HTTP Method     |        @PATCH        |                         PATCH Method                         |       Method       |                  @PATCH("/users/{userId}")                   |
|     HTTP Method     |       @DELETE        |                        DELETE Method                         |       Method       |                  @DELETE("/users/{userId}")                  |
|     HTTP Method     |        @HEAD         |                         HEAD Method                          |       Method       |                   @HEAD("/users/{userId}")                   |
|     HTTP Method     |       @OPTIONS       |                        OPTIONS Method                        |       Method       |                 @OPTIONS("/users/{userId}")                  |
|      Base Path      |      @BasePath       |    Specifying the base path of a series of API endpoints     |       Class        |                     @BasePath("/api/v1")                     |
|   Static Headers    |       @Headers       |        Specifying the static headers of API endpoint         |       Method       | @Headers({ "content-type": "application/x-www-form-urlencoded",   "Accept": "application/json" }) |
|  Header Parameter   |       @Header        |                     Parameterized header                     |  Method Parameter  |                      @Header("X-Token")                      |
|  Header Parameters  |      @HeaderMap      |                     Parameterized header                     |  Method Parameter  |                          @HeaderMap                          |
|   Path Parameter    |        @Path         |             Specifying parameter in path of API              |  Method Parameter  |                       @Path("userId")                        |
|        Body         |        @Body         |                     Specifying body data                     |  Method Parameter  |                            @Body                             |
| Query Array Format  |  @QueryArrayFormat   |                Specifying query array format                 |       Method       |                 @QueryArrayFormat('repeat')                  |
|    Static Query     |       @Queries       |                 Specifying static query data                 |       Method       | @Queries({ page: 1,   size: 20,   sort: "createdAt:desc" })  |
|   Query Parameter   |        @Query        |                     Parameterized query                      |  Method Parameter  |                       @Query("group")                        |
|  Query Parameters   |      @QueryMap       |                     Parameterized query                      |  Method Parameter  |                          @QueryMap                           |
|   Static Headers    |   @FormUrlEncoded    | Specifying "content-type" to be "application/x-www-form-urlencoded" |       Method       |                       @FormUrlEncoded                        |
|   Field Parameter   |        @Field        | Specifying field in method parameter, only takes effect when method has been decorated by @FormUrlEncoded |  Method Parameter  |                        @Field("name")                        |
|  Field Parameters   |      @FieldMap       | Specifying field map in method parameter, only takes effect when method has been decorated by @FormUrlEncoded |  Method Parameter  |                          @FieldMap                           |
|   Static Headers    |      @Multipart      |    Specifying "content-type" to be "multipart/form-data"     |       Method       |                          @Multipart                          |
|   Part Parameters   |        @Part         | Specifying field map in method parameter, only takes effect when method has been decorated by @Multipart |  Method Parameter  |                        @Part("name")                         |
|      Response       |    @ResponseType     |         Specifying the response type in axios config         |       Method       |                   @ResponseType("stream")                    |
| RequestTransformer  | @RequestTransformer  |      Specifying the request transformer in axios config      |       Method       | @RequestTransformer((data: any, headers?: any) => { data.foo = 'foo'; return JSON.stringify(data); }) |
| ResponseTransformer | @ResponseTransformer |     Specifying the response transformer in axios config      |       Method       | @ResponseTransformer((data: any, headers?: any) => { const json = JSON.parse(data); json.foo = 'foo'; return json; }) |
|       Timeout       |       @Timeout       |            Specifying the timeout in axios config            |       Method       |                        @Timeout(5000)                        |
|   ResponseStatus    |   @ResponseStatus    | Declare response status code for method, do nothing just a declaration |       Method       |                     @ResponseStatus(204)                     |
|       Config        |       @Config        |      A direct way to set config for a request in axios       |       Method       |                 @Config({ maxRedirects: 1 })                 |
|       GraphQL       |       @GraphQL       |            Declares query for a GraphQL request.             |       Method       |             @GraphQL(gqlQuery, "operationName")              |
|  GraphQLVariables   |  @GraphQLVariables   |          Declares variables for a GraphQL request.           |       Method       |                      @GraphQLVariables                       |
|     Deprecated      |     @Deprecated      |                 Marks a method is deprecated                 |       Method       |  @Deprecated()<br>@Deprecated("This method is deprecated")   |

## Test

```bash
$ npm test
```
