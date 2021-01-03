import {
  ApiResponse,
  BasePath,
  BaseService,
  Body,
  GET,
  PATCH,
  Path,
  POST,
  PUT,
  ConvertTo,
  STUB_RESPONSE,
} from "../../src";
import { Post, PostAsClass, PostCreateDTO, PostsApiService } from "./fixtures";

@BasePath(PostsApiService.BASE_PATH)
export class ResponseAsClassService extends BaseService {
  @GET("/")
  @ConvertTo(PostAsClass)
  async get(): Promise<PostAsClass[]> {
    return STUB_RESPONSE();
  }

  @GET("/{id}")
  @ConvertTo(PostAsClass)
  async getWithPath(@Path("id") id: number): Promise<PostAsClass> {
    return STUB_RESPONSE();
  }

  @POST("/")
  async post(@Body body: PostCreateDTO): Promise<PostAsClass> {
    return STUB_RESPONSE();
  }

  @POST("/body-as-array")
  async bodyAsArray(@Body body: PostCreateDTO[]): Promise<PostAsClass[]> {
    return STUB_RESPONSE();
  }

  @PUT("/{id}")
  async put(@Path("id") id: number, @Body body: PostCreateDTO): Promise<PostAsClass> {
    return STUB_RESPONSE();
  }

  @PATCH("/{id}")
  async patch(@Path("id") id: number, @Body body: PostCreateDTO): Promise<Post> {
    return STUB_RESPONSE();
  }
}
