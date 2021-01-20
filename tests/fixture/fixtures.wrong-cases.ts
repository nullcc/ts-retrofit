import {
  ApiResponse,
  BasePath,
  BaseService,
  Body,
  Config,
  Field,
  FieldMap,
  FormUrlEncoded,
  GET,
  Header,
  HeaderMap,
  Headers,
  Multipart,
  Part,
  Path,
  POST,
  Queries,
  Query,
  QueryMap,
  ResponseStatus,
} from "../../src";
import { API_PREFIX, Post, PostsApiService } from "./fixtures";
import { PartDescriptor } from "../../src/constants";

export class WrongHeaderService extends BaseService {
  @GET("/")
  wrongHeaderMap(@HeaderMap headers: { [key: string]: unknown }): ApiResponse {}

  @GET("/")
  wrongHeaderType(@Header("Header") header: unknown): ApiResponse {}

  @GET("/")
  emptyHeaderKey(@Header("") header: unknown): ApiResponse {}
}

@BasePath(PostsApiService.BASE_PATH)
export class WrongFieldService extends BaseService {
  @POST("/")
  wrongFieldMap(@FieldMap param: { [key: string]: unknown }): ApiResponse {}

  @POST("/")
  wrongFieldMapType(@FieldMap param: string[]): ApiResponse {}

  @POST("/")
  fieldMapWithBodyArray(@FieldMap param: { [key: string]: unknown }, @Body body: string[]): ApiResponse {}

  @POST("/")
  emptyFieldKey(@Field("") param: unknown): ApiResponse {}

  @POST("/")
  fieldWithBodyArray(@Field("p") param: unknown, @Body body: number[]): ApiResponse {}
}

export class WrongQueryService extends BaseService {
  @GET("/")
  wrongQuery(@Query("userId") userId: unknown): ApiResponse {}

  @GET("/")
  wrongQueryMap(@QueryMap query: unknown): ApiResponse {}

  @GET("/")
  emptyQueryKey(@Query("") query: unknown): ApiResponse {}
}

@BasePath(API_PREFIX)
export class WrongMultipartService extends BaseService {
  @POST("/upload")
  @Multipart
  emptyPartKey(@Part("") bucket: PartDescriptor<string>): ApiResponse {}

  @POST("/upload")
  @Multipart
  partAsIsNotPartDescriptor(@Part("from") from: string): ApiResponse {}

  @POST("/upload")
  @Multipart
  withBody(@Part("bucket") bucket: PartDescriptor<string>, @Body body: number[]): ApiResponse {}
}

export class NoHttpMethodService extends BaseService {
  path(@Path("id") id: number): ApiResponse {}

  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  headers(): ApiResponse {}

  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  queries(): ApiResponse {}

  @FormUrlEncoded
  formUrlEncoded(): ApiResponse<Post> {}

  field(@Field("userId") userId: number): ApiResponse<Post> {}

  @ResponseStatus(200)
  responseStatus(): ApiResponse<Post[]> {}

  @Config({
    maxRedirects: 3,
  })
  config(): ApiResponse<Post[]> {}

  validMethodNoParams() {
    return 100;
  }

  validMethodWithOneParam(a: string) {
    return a;
  }

  validMethodWithTwoParams(a: string, b: string) {
    return a + b;
  }
}
