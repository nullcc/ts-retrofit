import { ApiResponse, BasePath, BaseService, GET, Path, ConvertTo, STUB_RESPONSE } from "../../src";
import { Post, PostAsClass, PostsApiService } from "./fixtures";

@BasePath(PostsApiService.BASE_PATH)
export class ConvertServiceInline extends BaseService {
  @GET("/")
  @ConvertTo(PostAsClass)
  async get(): Promise<PostAsClass[]> {
    return STUB_RESPONSE();
  }

  @GET("/", PostAsClass)
  async getConvertInMethod(): Promise<PostAsClass[]> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async getNoConvertTo(): Promise<PostAsClass[]> {
    return STUB_RESPONSE();
  }

  @GET("/{id}")
  @ConvertTo(PostAsClass)
  async getWithPath(@Path("id") id: number): Promise<PostAsClass> {
    return STUB_RESPONSE();
  }

  @GET("/{id}", PostAsClass)
  async getWithPathInMethod(@Path("id") id: number): Promise<PostAsClass> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async getToType(): Promise<Post[]> {
    return STUB_RESPONSE();
  }
}

@BasePath(PostsApiService.BASE_PATH)
export class ConvertToServiceRaw extends BaseService {
  @GET("/")
  @ConvertTo(PostAsClass)
  async get(): ApiResponse<PostAsClass[]> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async getNoConvertTo(): ApiResponse<PostAsClass[]> {
    return STUB_RESPONSE();
  }

  @GET("/{id}")
  @ConvertTo(PostAsClass)
  async getWithPath(@Path("id") id: number): ApiResponse<PostAsClass> {
    return STUB_RESPONSE();
  }

  @GET("/")
  async getToType(): ApiResponse<Post[]> {
    return STUB_RESPONSE();
  }
}
