import {
  ApiResponse,
  BasePath,
  BaseService,
  Body,
  Config,
  DELETE,
  Field,
  FieldMap,
  FormUrlEncoded,
  GET,
  HEAD,
  Header,
  HeaderMap,
  Headers,
  OPTIONS,
  PATCH,
  Path,
  POST,
  PUT,
  Queries,
  Query,
  QueryMap,
  ResponseStatus,
  STUB_RESPONSE,
} from "../../src";
import { JSONPLACEHOLDER_URL } from "../testHelpers";

export const API_PREFIX = "/api/v1";
export const TOKEN = "abcdef123456";

export interface PostCreateDTO {
  userId: number;
  title: string;
  body: string;
}

export class PostAsClass {
  constructor(public id: number, public userId: number, public title: string, public body: string) {}

  methodInside() {
    return this.id;
  }
}

export interface Post extends PostCreateDTO {
  id: number;
}

export interface SearchQuery {
  title?: string;
  body?: string;
  userId?: number;
}

export const posts: Post[] = [
  {
    id: 1,
    userId: 1,
    body: "body1",
    title: "title1",
  },
  {
    id: 2,
    userId: 2,
    body: "body2",
    title: "title2",
  },
];

@BasePath(PostsApiService.BASE_PATH)
export class PostsApiService extends BaseService {
  static BASE_PATH = "/posts";

  static dto = {
    body: "updatedBody",
    title: "updatedTitle",
    userId: 100,
  };

  @GET("/")
  async get(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/posts", { ignoreBasePath: true })
  async getIgnoreBasePath(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  @GET(`${JSONPLACEHOLDER_URL}${PostsApiService.BASE_PATH}`)
  async getAbsoluteUrl(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/{id}")
  async getWithPath(@Path("id") id: string): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async post(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/body-as-array")
  async bodyAsArray(@Body body: PostCreateDTO[]): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  @PUT("/{id}")
  async put(@Path("id") id: number, @Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE<ApiResponse<Post>>();
  }

  @PATCH("/{id}")
  async patch(@Path("id") id: number, @Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @DELETE("/{id}")
  async delete(@Path("id") id: number): ApiResponse<never> {
    return STUB_RESPONSE();
  }

  @HEAD("/{id}")
  async head(@Path("id") id: number): ApiResponse {
    return STUB_RESPONSE();
  }

  @OPTIONS("/{id}")
  async options(@Path("id") id: number): ApiResponse {
    return STUB_RESPONSE();
  }

  @POST("/")
  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  async headers(@Body body: PostCreateDTO): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async header(@Header("Header") header: string): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async headerMap(@HeaderMap headers: { [key: string]: unknown }): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async queries(): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async query(@Query("userId") userId: number): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async queryMap(@QueryMap query: SearchQuery): ApiResponse {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async formUrlEncoded(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async formUrlEncodedWithBody(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async fieldMapUrlEncoded(@FieldMap body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async fieldMap(@FieldMap body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async field(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @GET("/")
  @ResponseStatus(200)
  async responseStatus(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/")
  @Config({
    maxRedirects: 3,
  })
  async config(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/asdasda/sdasdasda/sdasd/asdkjajkldkasd", { ignoreBasePath: true })
  async wrongUrl(): ApiResponse {
    return STUB_RESPONSE();
  }
}

@BasePath(PostsApiService.BASE_PATH)
export class ResponseBodyPostsApiService extends BaseService {
  @GET("/")
  async get(): Promise<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/posts", { ignoreBasePath: true })
  async getIgnoreBasePath(): Promise<Post[]> {
    return STUB_RESPONSE();
  }

  @GET(`${JSONPLACEHOLDER_URL}${PostsApiService.BASE_PATH}`)
  async getAbsoluteUrl(): Promise<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/{id}")
  async getWithPath(@Path("id") id: string): Promise<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async post(@Body body: PostCreateDTO): Promise<Post> {
    return STUB_RESPONSE();
  }

  @PUT("/{id}")
  async put(@Path("id") id: number, @Body body: PostCreateDTO): Promise<Post> {
    return STUB_RESPONSE();
  }

  @PATCH("/{id}")
  async patch(@Path("id") id: number, @Body body: PostCreateDTO): Promise<Post> {
    return STUB_RESPONSE();
  }

  @DELETE("/{id}")
  async delete(@Path("id") id: number): Promise<never> {
    return STUB_RESPONSE();
  }

  @HEAD("/{id}")
  async head(@Path("id") id: number): Promise<any> {
    return STUB_RESPONSE();
  }

  @OPTIONS("/{id}")
  async options(@Path("id") id: number): Promise<any> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  async headers(@Body body: PostCreateDTO): Promise<any> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async header(@Header("Header") header: string): Promise<any> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async headerMap(@HeaderMap headers: { [key: string]: unknown }): Promise<any> {
    return STUB_RESPONSE();
  }

  @GET("/")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async queries(): Promise<any> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async query(@Query("userId") userId: number): Promise<any> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async queryMap(@QueryMap query: SearchQuery): Promise<any> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async formUrlEncoded(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): Promise<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async formUrlEncodedWithBody(@Body body: PostCreateDTO): Promise<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async fieldMapUrlEncoded(@FieldMap body: PostCreateDTO): Promise<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async fieldMap(@FieldMap body: PostCreateDTO): Promise<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async field(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): Promise<Post> {
    return STUB_RESPONSE();
  }

  @GET("/")
  @ResponseStatus(200)
  async responseStatus(): Promise<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/")
  @Config({
    maxRedirects: 3,
  })
  async config(): Promise<Post[]> {
    return STUB_RESPONSE();
  }

  @GET("/asdasda/sdasdasda/sdasd/asdkjajkldkasd", { ignoreBasePath: true })
  async wrongUrl(): Promise<any> {
    return STUB_RESPONSE();
  }
}

export class ServiceWithoutBasePath extends BaseService {
  @GET("/posts")
  async get(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }
}

export class ResponseBodyServiceWithoutBasePath extends BaseService {
  @GET("/posts")
  async get(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }
}

@BasePath(PostsApiService.BASE_PATH)
export class WithMethodsService extends BaseService {
  @GET("/")
  async get(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  async methodCallsGet() {
    return this.get();
  }
}
