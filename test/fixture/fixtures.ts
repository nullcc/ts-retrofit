import {
  GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, BasePath, Header, Queries, Headers, Path, Query, QueryMap, Body,
  FormUrlEncoded, Field, FieldMap, Multipart, ResponseType, Part, PartDescriptor, BaseService, Response, HeaderMap,
  RequestTransformer, ResponseTransformer, Timeout, ResponseStatus, Config, GraphQL, GraphQLVariables, Deprecated,
  QueryArrayFormat,
} from "../../src";

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

export interface Post {
  title: string;
  content: string;
}

export interface Group {
  name: string;
  description: string;
  members: number[];
  tags: string[];
}

export interface Something {
  name: string;
}

@BasePath(API_PREFIX)
export class UserService extends BaseService {
  @GET("/users")
  async getUsers(@Header("X-Token") token: string): Promise<Response> { return <Response>{} };

  @GET(`${TEST_SERVER_ENDPOINT}/users`)
  async getUsersOther(@Header("X-Token") token: string): Promise<Response> { return <Response>{} };

  @GET("/users/{userId}")
  async getUser(@Header("X-Token") token: string, @Path("userId") userId: number): Promise<Response> { return <Response>{} };

  @GET("/users/uid-{userId}")
  async getUser1(@Header("X-Token") token: string, @Path("userId") userId: number): Promise<Response> { return <Response>{} };

  @POST("/users")
  async createUser(@Header("X-Token") token: string, @Body user: User): Promise<Response> { return <Response>{} };

  @PUT("/users/{userId}")
  async replaceUser(@Header("X-Token") token: string, @Path("userId") userId: number, @Body user: User): Promise<Response> { return <Response>{} };

  @PATCH("/users/{userId}")
  async updateUser(@Header("X-Token") token: string, @Path("userId") userId: number, @Body user: Partial<User>): Promise<Response> { return <Response>{} };

  @DELETE("/users/{userId}")
  async deleteUser(@Header("X-Token") token: string, @Path("userId") userId: number): Promise<Response> { return <Response>{} };

  @HEAD("/users/{userId}")
  async headUser(@Header("X-Token") token: string, @Path("userId") userId: number): Promise<Response> { return <Response>{} };

  @OPTIONS("/users/{userId}")
  async optionsUser(@Header("X-Token") token: string, @Path("userId") userId: number): Promise<Response> { return <Response>{} };

  @GET("/users/{userId}/pets")
  @Deprecated("This method is deprecated on version v2.")
  async getUserPets(@Header("X-Token") token: string, @Path("userId") userId: number): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class SearchService extends BaseService {
  @GET("/search")
  async search(@Header("X-Token") token: string, @QueryMap query: SearchQuery): Promise<Response> { return <Response>{} };
}

@BasePath("")
export class AuthService extends BaseService {
  @POST("/oauth2/authorize")
  @Headers({
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    "Accept": "application/json"
  })
  async auth(@Body body: Auth): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class PostService extends BaseService {
  @GET("/posts")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async getPosts(): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async getPosts1(@Query('group') group: string): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @QueryArrayFormat('indices')
  async getPostsWithQueryArrayFormatIndices(@Query('groups') groups: string[]): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @QueryArrayFormat('brackets')
  async getPostsWithQueryArrayFormatBrackets(@Query('groups') groups: string[]): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @QueryArrayFormat('repeat')
  async getPostsWithQueryArrayFormatRepeat(@Query('groups') groups: string[]): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @QueryArrayFormat('comma')
  async getPostsWithQueryArrayFormatComma(@Query('groups') groups: string[]): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async getPostsWithOptionalQuery(@Query('since') since?: string): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async getPostsWithOptionalQueryMap(@QueryMap filters?: SearchQuery): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @Headers({
    'Cache-Control': 'no-cache'
  })
  async getPostsWithOptionalHeader(@Header('X-Correlation-Id') correlationId?: string): Promise<Response> { return <Response>{} };

  @GET("/posts")
  @Headers({
    'Cache-Control': 'no-cache'
  })
  async getPostsWithOptionalHeaderMap(@HeaderMap headers?: any): Promise<Response> { return <Response>{} };

  @POST("/posts")
  @FormUrlEncoded
  async createPost(@Field("title") title: string, @Field("content") content: string): Promise<Response> { return <Response>{} };

  @POST("/posts")
  @FormUrlEncoded
  async createPost2(@FieldMap post: Post): Promise<Response> { return <Response>{} };

  @POST("/posts")
  @FormUrlEncoded
  async createPost3(@HeaderMap headers: any, @FieldMap post: Post): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class FileService extends BaseService {
  @POST("/upload")
  @Multipart
  async upload(
    @Part("bucket") bucket: PartDescriptor<string>,
    @Part("metadata") metadata: PartDescriptor<string>,
    @Part("file") file: PartDescriptor<Buffer>,
  ): Promise<Response> { return <Response>{} };

  @GET("/file")
  @ResponseType("stream")
  async getFile(@Path("fileId") fileId: string): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class MessagingService extends BaseService {
  @POST("/sms")
  @Multipart
  async createSMS(@Part("from") from: PartDescriptor<string>, @Part("to") to: PartDescriptor<string[]>): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class GroupService extends BaseService {
  @POST("/groups")
  @FormUrlEncoded
  async createGroup(@Body body: Group): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class InterceptorService extends BaseService {
  @GET("/interceptor")
  async getParams(): Promise<Response> { return <Response>{} };

  @POST("/interceptor")
  async createParams(@Body body: Post): Promise<Response> { return <Response>{} };
  
  @GET("/header")
  async getHeader(): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class TransformerService extends BaseService {
  @POST("/request-transformer")
  @RequestTransformer((data: any, headers?: any) => {
    data.foo = 'foo';
    return JSON.stringify(data);
  })
  async createSomething(@Body body: Something): Promise<Response> { return <Response>{} };

  @GET("/response-transformer")
  @ResponseTransformer((data: any, headers?: any) => {
    const json = JSON.parse(data);
    json.foo = 'foo';
    return json;
  })
  async getSomething(): Promise<Response<Something>> { return <Response<Something>>{} };
}

@BasePath(API_PREFIX)
export class TimeoutService extends BaseService {
  @GET("/sleep-5000")
  async sleep5000(): Promise<Response> { return <Response>{} };

  @GET("/sleep-5000")
  @Timeout(3000)
  async timeoutIn3000(): Promise<Response> { return <Response>{} };

  @GET("/sleep-5000")
  @Timeout(6000)
  async timeoutIn6000(): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class ResponseStatusService extends BaseService {
  @GET("/response-status")
  @ResponseStatus(200)
  async getSomething(): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class ConfigService extends BaseService {
  @GET("/config")
  @Config({
    maxRedirects: 1,
  })
  @ResponseStatus(200)
  async getConfig(): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class AbsoluteURLService extends BaseService {
  @GET("https://absolute-foobar.com")
  @ResponseStatus(200)
  async getSomethingAbsolute(): Promise<Response> { return <Response>{} };
}

@BasePath(API_PREFIX)
export class HealthService extends BaseService {
  @GET("/ping", { ignoreBasePath: true })
  @ResponseStatus(200)
  async ping(): Promise<Response> { return <Response>{} };

  @GET("/boom", { ignoreBasePath: true })
  async boom(): Promise<Response> { return <Response>{} };
}

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
  @GraphQL(gqlQuery)
  async graphql1(
    @GraphQLVariables variables: any,
  ): Promise<Response> { return <Response>{} };

  @POST("/graphql")
  @GraphQL(gqlQuery, "UserAndRepo")
  async graphql2(
    @GraphQLVariables variables: any,
  ): Promise<Response> { return <Response>{} };

  @POST("/graphql")
  @GraphQL(gqlQuery, "UserAndRepo")
  async graphql3(): Promise<Response> { return <Response>{} };
}
