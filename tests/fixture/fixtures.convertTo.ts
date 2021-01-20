import { ApiResponse, ApiResponseBody, BasePath, BaseService, ConvertTo, GET, Path } from "../../src";
import { Post, PostAsClass, PostAsClassWithTransfromAndValidate, PostsApiService } from "./fixtures";

@BasePath(PostsApiService.BASE_PATH)
export class ConvertServiceInline extends BaseService {
  @GET("/")
  @ConvertTo(PostAsClass)
  get(): ApiResponseBody<PostAsClass[]> {}

  @GET("/", { convertTo: PostAsClass })
  getConvertInMethod(): ApiResponseBody<PostAsClass[]> {}

  @GET("/")
  getNoConvertTo(): ApiResponseBody<PostAsClass[]> {}

  @GET("/{id}")
  @ConvertTo(PostAsClass)
  getWithPath(@Path("id") id: number): ApiResponseBody<PostAsClass> {}

  @GET("/{id}", { convertTo: PostAsClass })
  getWithPathInMethod(@Path("id") id: number): ApiResponseBody<PostAsClass> {}

  @GET("/")
  getToType(): ApiResponseBody<Post[]> {}
}

@BasePath(PostsApiService.BASE_PATH)
export class ConvertToServiceRaw extends BaseService {
  @GET("/")
  @ConvertTo(PostAsClass)
  get(): ApiResponse<PostAsClass[]> {}

  @GET("/")
  getNoConvertTo(): ApiResponse<PostAsClass[]> {}

  @GET("/{id}")
  @ConvertTo(PostAsClass)
  getWithPath(@Path("id") id: number): ApiResponse<PostAsClass> {}

  @GET("/")
  getToType(): ApiResponse<Post[]> {}

  @GET("/just-string", { convertTo: PostAsClassWithTransfromAndValidate })
  wrongConvertWhenReturnIsString(): ApiResponse<string> {}
}
