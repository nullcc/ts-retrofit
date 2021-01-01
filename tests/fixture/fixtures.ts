import {
  BasePath,
  BaseService,
  Path,
  GET,
  Header,
  Response,
  POST,
  Body,
  PUT,
  DELETE,
  PATCH,
  STUB_RESPONSE,
  HEAD,
  OPTIONS,
  Headers,
  HeaderMap,
  Queries,
  Query,
  QueryMap,
  FormUrlEncoded,
  Field,
  FieldMap,
  RequestTransformer,
  ResponseTransformer,
  ResponseStatus,
  Config,
  Multipart,
  Part,
  PartDescriptor,
  ResponseType,
  Timeout,
} from "../../src";
import { JSONPLACEHOLDER_URL } from "../testHelpers";

export const TEST_SERVER_HOST = "http://localhost";
export const TEST_SERVER_PORT = 12345;
export const TEST_SERVER_ENDPOINT = `${TEST_SERVER_HOST}:${TEST_SERVER_PORT}`;
export const API_PREFIX = "/api/v1";
export const TOKEN = "abcdef123456";

export interface PostCreateDTO {
  userId: number;
  title: string;
  body: string;
}

export interface Post extends PostCreateDTO {
  id: number;
}

export interface SearchQuery {
  title?: string;
  body?: string;
  userId?: number;
}

@BasePath(PostsApiService.BASE_PATH)
export class PostsApiService extends BaseService {
  static BASE_PATH = "/posts";

  static dto = {
    body: "updatedBody",
    title: "updatedTitle",
    userId: 100,
  };

  @GET("/")
  async get(): Promise<Response<Post[]>> {
    return <Response>{};
  }

  @GET("/posts", { ignoreBasePath: true })
  async getIgnoreBasePath(): Promise<Response<Post[]>> {
    return <Response>{};
  }

  @GET(`${JSONPLACEHOLDER_URL}${PostsApiService.BASE_PATH}`)
  async getAbsoluteUrl(): Promise<Response<Post[]>> {
    return <Response>{};
  }

  @GET("/{id}")
  async getWithPath(@Path("id") id: string): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async post(@Body body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @PUT("/{id}")
  async put(@Path("id") id: number, @Body body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @PATCH("/{id}")
  async patch(@Path("id") id: number, @Body body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @DELETE("/{id}")
  async delete(@Path("id") id: number): Promise<Response<never>> {
    return STUB_RESPONSE();
  }

  @HEAD("/{id}")
  async head(@Path("id") id: number): Promise<Response> {
    return STUB_RESPONSE();
  }

  @OPTIONS("/{id}")
  async options(@Path("id") id: number): Promise<Response> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  async headers(@Body body: PostCreateDTO): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async header(@Header("Header") header: string): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async headerMap(@HeaderMap headers: { [key: string]: string }): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async queries(): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async query(@Query("userId") userId: number): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async queryMap(@QueryMap query: SearchQuery): Promise<Response> {
    return <Response>{};
  }

  @POST("/")
  @FormUrlEncoded
  async formUrlEncoded(
    @Field("userId") userId: number,
    @Field("title") title: string,
    @Field("body") body: string,
  ): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async formUrlEncodedWithBody(@Body body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @FormUrlEncoded
  async fieldMap(@FieldMap body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @GET("/")
  @ResponseStatus(200)
  async responseStatus(): Promise<Response<Post[]>> {
    return STUB_RESPONSE();
  }

  @GET("/")
  @Config({
    maxRedirects: 3,
  })
  async config(): Promise<Response<Post[]>> {
    return STUB_RESPONSE();
  }
}

@BasePath(PostsApiService.BASE_PATH)
export class TransformerApiService extends BaseService {
  @POST("/")
  @RequestTransformer((data: PostCreateDTO, headers?: { [key: string]: unknown }) => {
    data.title = "updated title1";
    return JSON.stringify(data);
  })
  async requestTransformer(@Body body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @RequestTransformer((data: PostCreateDTO, headers?: { [key: string]: unknown }) => {
    data.title = "updated title1";
    return JSON.stringify(data);
  })
  async twoRequestTransformers(@Body body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @ResponseTransformer((body: string, headers?: { [key: string]: unknown }) => {
    const data = JSON.parse(body);
    data.title = "updated title2";
    return data;
  })
  async responseTransformer(@Body body: PostCreateDTO): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }
}

@BasePath(API_PREFIX)
export class FileService extends BaseService {
  @POST("/upload")
  @Multipart
  async upload(
    @Part("bucket") bucket: PartDescriptor<string>,
    @Part("file") file: PartDescriptor<Buffer>,
  ): Promise<Response> {
    return <Response>{};
  }

  @GET("/file")
  @ResponseType("stream")
  async getFile(@Path("fileId") fileId: string): Promise<Response> {
    return <Response>{};
  }
}

@BasePath(API_PREFIX)
export class MessagingService extends BaseService {
  @POST("/sms")
  @Multipart
  async createSMS(
    @Part("from") from: PartDescriptor<string>,
    @Part("to") to: PartDescriptor<string[]>,
  ): Promise<Response> {
    return <Response>{};
  }
}

@BasePath(API_PREFIX)
export class TimeoutService extends BaseService {
  @GET("/sleep-5000")
  async sleep5000(): Promise<Response> {
    return <Response>{};
  }

  @GET("/sleep-5000")
  @Timeout(3000)
  async timeoutIn3000(): Promise<Response> {
    return <Response>{};
  }

  @GET("/sleep-5000")
  @Timeout(6000)
  async timeoutIn6000(): Promise<Response> {
    return <Response>{};
  }
}
