import {
  ApiResponse,
  BasePath,
  BaseService,
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
  STUB_RESPONSE,
} from "../../src";
import { API_PREFIX, Post } from "./fixtures";
import { PartDescriptor } from "../../src/constants";

export class WrongHeaderService extends BaseService {
  @GET("/")
  async wrongHeaderMap(@HeaderMap headers: { [key: string]: unknown }): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async wrongHeaderType(@Header("Header") header: unknown): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async emptyHeaderKey(@Header("") header: unknown): ApiResponse {
    return STUB_RESPONSE();
  }
}

export class WrongFieldService extends BaseService {
  @GET("/")
  async wrongFieldMap(@FieldMap param: { [key: string]: unknown }): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async emptyFieldKey(@Field("") param: unknown): ApiResponse {
    return STUB_RESPONSE();
  }
}

export class WrongQueryService extends BaseService {
  @GET("/")
  async wrongQuery(@Query("userId") userId: unknown): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async wrongQueryMap(@QueryMap query: unknown): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/")
  async emptyQueryKey(@Query("") query: unknown): ApiResponse {
    return STUB_RESPONSE();
  }
}

@BasePath(API_PREFIX)
export class WrongMultipartService extends BaseService {
  @POST("/upload")
  @Multipart
  async emptyPartKey(@Part("") bucket: PartDescriptor<string>): ApiResponse {
    return STUB_RESPONSE();
  }
}

export class NoHttpMethodService extends BaseService {
  async path(@Path("id") id: number): ApiResponse {
    return STUB_RESPONSE();
  }

  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  async headers(): ApiResponse {
    return STUB_RESPONSE();
  }

  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async queries(): ApiResponse {
    return STUB_RESPONSE();
  }

  @FormUrlEncoded
  async formUrlEncoded(): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  async field(@Field("userId") userId: number): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @ResponseStatus(200)
  async responseStatus(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  @Config({
    maxRedirects: 3,
  })
  async config(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }

  async validMethodNoParams() {
    return 100;
  }

  async validMethodWithOneParam(a: string) {
    return a;
  }

  async validMethodWithTwoParams(a: string, b: string) {
    return a + b;
  }
}
