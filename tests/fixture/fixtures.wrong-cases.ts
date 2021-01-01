import {
  BaseService,
  GET,
  Path,
  Header,
  Response,
  STUB_RESPONSE,
  Headers,
  Queries,
  FormUrlEncoded,
  Field,
  ResponseStatus,
  Config,
  HeaderMap,
  POST,
  Body,
  Query,
  QueryMap,
  FieldMap,
} from "../../src";
import { Post, PostCreateDTO, SearchQuery } from "./fixtures";

export class WrongHeaderService extends BaseService {
  @GET("/")
  async wrongHeaderMap(@HeaderMap headers: { [key: string]: unknown }): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async wrongHeaderType(@Header("Header") header: unknown): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async emptyHeaderKey(@Header("") header: unknown): Promise<Response> {
    return <Response>{};
  }
}

export class WrongFieldService extends BaseService {
  @GET("/")
  async wrongFieldMap(@FieldMap param: { [key: string]: unknown }): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async emptyFieldKey(@Field("") param: unknown): Promise<Response> {
    return <Response>{};
  }
}

export class WrongQueryService extends BaseService {
  @GET("/")
  async wrongQuery(@Query("userId") userId: unknown): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async wrongQueryMap(@QueryMap query: unknown): Promise<Response> {
    return <Response>{};
  }

  @GET("/")
  async emptyQueryKey(@Query("") query: unknown): Promise<Response> {
    return <Response>{};
  }
}

export class NoHttpMethodService extends BaseService {
  async path(@Path("id") id: number): Promise<Response> {
    return STUB_RESPONSE();
  }

  @Headers({
    Header1: "Value1",
    Header2: "Value2",
  })
  async headers(): Promise<Response> {
    return STUB_RESPONSE();
  }

  @Queries({
    page: 1,
    size: 20,
    sort: "createdAt:desc",
  })
  async queries(): Promise<Response> {
    return <Response>{};
  }

  @FormUrlEncoded
  async formUrlEncoded(): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  async field(@Field("userId") userId: number): Promise<Response<Post>> {
    return STUB_RESPONSE();
  }

  @ResponseStatus(200)
  async responseStatus(): Promise<Response<Post[]>> {
    return STUB_RESPONSE();
  }

  @Config({
    maxRedirects: 3,
  })
  async config(): Promise<Response<Post[]>> {
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
