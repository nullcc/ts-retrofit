import {
  ApiResponse,
  ApiResponseBody,
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
} from "../../src";
import { JSONPLACEHOLDER_URL } from "../testHelpers";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export const API_PREFIX = "/api/v1";
export const TOKEN = "abcdef123456";
export const TEST_HEADER = "TEST_HEADER";

export interface PostCreateDTO {
  userId: number;
  title: string;
  body: string;
}

export class PostAsClass {
  id!: number;
  userId!: number;
  title!: string;
  body!: string;

  methodInside() {
    return this.id;
  }
}

export class PostAsClassWithTransfromAndValidate {
  id = -1;
  userId = -1;
  title = "";
  @IsNotEmpty()
  body = "";

  @Type(() => Date)
  date: Date = new Date();
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
  get(): ApiResponse<Post[]> {}

  @GET("/just-string")
  getJustString(): ApiResponse<string> {}

  @GET("/posts", { ignoreBasePath: true })
  getIgnoreBasePath(): ApiResponse<Post[]> {}

  @GET(`${JSONPLACEHOLDER_URL}${PostsApiService.BASE_PATH}`)
  getAbsoluteUrl(): ApiResponse<Post[]> {}

  @GET("/{id}")
  getWithPath(@Path("id") id: string): ApiResponse<Post> {}

  @POST("/")
  post(@Body body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/body-as-array")
  bodyAsArray(@Body body: PostCreateDTO[]): ApiResponse<Post[]> {}

  @PUT("/{id}")
  put(@Path("id") id: number, @Body body: PostCreateDTO): ApiResponse<Post> {}

  @PATCH("/{id}")
  patch(@Path("id") id: number, @Body body: PostCreateDTO): ApiResponse<Post> {}

  @DELETE("/{id}")
  delete(@Path("id") id: number): ApiResponse<never> {}

  @HEAD("/{id}")
  head(@Path("id") id: number): ApiResponse {}

  @OPTIONS("/{id}")
  options(@Path("id") id: number): ApiResponse {}

  @POST("/")
  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  headers(@Body body: PostCreateDTO): ApiResponse {}

  @GET("/")
  header(@Header("Header") header: string): ApiResponse {}

  @GET("/")
  headerMap(@HeaderMap headers: { [key: string]: unknown }): ApiResponse {}

  @GET("/")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  queries(): ApiResponse {}

  @GET("/")
  query(@Query("userId") userId: number): ApiResponse {}

  @GET("/")
  queryMap(@QueryMap query: SearchQuery): ApiResponse {}

  @POST("/")
  @FormUrlEncoded
  formUrlEncoded(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): ApiResponse<Post> {}

  @POST("/")
  @FormUrlEncoded
  formUrlEncodedWithBody(@Body body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/")
  @FormUrlEncoded
  fieldMapUrlEncoded(@FieldMap body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/")
  fieldMap(@FieldMap body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/")
  field(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): ApiResponse<Post> {}

  @GET("/")
  @ResponseStatus(200)
  responseStatus(): ApiResponse<Post[]> {}

  @GET("/")
  @Config({
    maxRedirects: 3,
  })
  config(): ApiResponse<Post[]> {}

  @GET("/asdasda/sdasdasda/sdasd/asdkjajkldkasd", { ignoreBasePath: true })
  wrongUrl(): ApiResponse {}
}

@BasePath(PostsApiService.BASE_PATH)
export class ResponseBodyPostsApiService extends BaseService {
  @GET("/")
  get(): ApiResponseBody<Post[]> {}

  @GET("/posts", { ignoreBasePath: true })
  getIgnoreBasePath(): ApiResponseBody<Post[]> {}

  @GET(`${JSONPLACEHOLDER_URL}${PostsApiService.BASE_PATH}`)
  getAbsoluteUrl(): ApiResponseBody<Post[]> {}

  @GET("/{id}")
  getWithPath(@Path("id") id: string): ApiResponseBody<Post> {}

  @POST("/")
  post(@Body body: PostCreateDTO): ApiResponseBody<Post> {}

  @PUT("/{id}")
  put(@Path("id") id: number, @Body body: PostCreateDTO): ApiResponseBody<Post> {}

  @PATCH("/{id}")
  patch(@Path("id") id: number, @Body body: PostCreateDTO): ApiResponseBody<Post> {}

  @DELETE("/{id}")
  delete(@Path("id") id: number): ApiResponseBody<never> {}

  @HEAD("/{id}")
  head(@Path("id") id: number): ApiResponseBody<never> {}

  @OPTIONS("/{id}")
  options(@Path("id") id: number): ApiResponseBody<never> {}

  @POST("/")
  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  headers(@Body body: PostCreateDTO): ApiResponseBody<never> {}

  @GET("/")
  header(@Header("Header") header: string): ApiResponseBody<never> {}

  @GET("/")
  headerMap(@HeaderMap headers: { [key: string]: unknown }): ApiResponseBody<never> {}

  @GET("/")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  queries(): ApiResponseBody<never> {}

  @GET("/")
  query(@Query("userId") userId: number): ApiResponseBody<never> {}

  @GET("/")
  queryMap(@QueryMap query: SearchQuery): ApiResponseBody<never> {}

  @POST("/")
  @FormUrlEncoded
  formUrlEncoded(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): ApiResponseBody<Post> {}

  @POST("/")
  @FormUrlEncoded
  formUrlEncodedWithBody(@Body body: PostCreateDTO): ApiResponseBody<Post> {}

  @POST("/")
  @FormUrlEncoded
  fieldMapUrlEncoded(@FieldMap body: PostCreateDTO): ApiResponseBody<Post> {}

  @POST("/")
  fieldMap(@FieldMap body: PostCreateDTO): ApiResponseBody<Post> {}

  @POST("/")
  field(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): ApiResponseBody<Post> {}

  @GET("/")
  @ResponseStatus(200)
  responseStatus(): ApiResponseBody<Post[]> {}

  @GET("/")
  @Config({
    maxRedirects: 3,
  })
  config(): ApiResponseBody<Post[]> {}

  @GET("/asdasda/sdasdasda/sdasd/asdkjajkldkasd", { ignoreBasePath: true })
  wrongUrl(): ApiResponseBody<never> {}
}

export class WithHeaderService extends BaseService {
  @GET("/with-headers")
  withHeaders(): ApiResponse<string> {}

  @GET("/with-oauth")
  withOauth(): ApiResponse<string> {}
}

export class ResponseBodyWithHeaderService extends BaseService {
  @GET("/with-headers")
  withHeaders(): ApiResponseBody<unknown> {}

  @GET("/with-oauth")
  withOauth(): ApiResponseBody<string> {}
}

export class ServiceWithoutBasePath extends BaseService {
  @GET("/posts")
  get(): ApiResponse<Post[]> {}
}

export class ResponseBodyServiceWithoutBasePath extends BaseService {
  @GET("/posts")
  get(): ApiResponse<Post[]> {}
}

@BasePath(PostsApiService.BASE_PATH)
export class WithMethodsService extends BaseService {
  @GET("/")
  get(): ApiResponse<Post[]> {}

  methodCallsGet() {
    return this.get();
  }
}
