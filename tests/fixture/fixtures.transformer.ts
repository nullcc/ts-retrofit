import {
  BasePath,
  BaseService,
  Body,
  GET,
  POST,
  RequestTransformer,
  ResponseTransformer,
  ApiResponse,
} from "../../src";
import { Post, PostCreateDTO, PostsApiService } from "./fixtures";

@BasePath(PostsApiService.BASE_PATH)
export class RequestTransformerApiService extends BaseService {
  @POST("/")
  @RequestTransformer((data: Record<string, unknown>) => {
    data.title = "updated title1";
    return data;
  })
  requestTransformer(@Body body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/")
  @RequestTransformer(
    (data: Record<string, unknown>) => {
      data.title = "updated title1";
      return data;
    },
    (data: Record<string, unknown>) => {
      data.title = "updated title2";
      return data;
    },
  )
  twoTransformersAsArgument(@Body body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/")
  @RequestTransformer((data: PostCreateDTO) => {
    data.title = "updated title1";
    return data;
  })
  @POST("/")
  @RequestTransformer((data: PostCreateDTO) => {
    data.title = "updated title2";
    return data;
  })
  twoTransformersAsDifferentDecorators(@Body body: PostCreateDTO): ApiResponse<Post> {}
}

@BasePath(PostsApiService.BASE_PATH)
export class ResponseTransformerApiService extends BaseService {
  @GET("/")
  @ResponseTransformer((data: Record<string, unknown>[], headers?: { [key: string]: unknown }) => {
    data[0].title = "transformer";
    return data;
  })
  array(): ApiResponse<Post> {}

  @POST("/")
  @ResponseTransformer((data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
    data.title = "updated title2";
    return data;
  })
  single(@Body body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/")
  @ResponseTransformer(
    (data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
      data.title = "updated title1";
      return data;
    },
    (data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
      data.title = "updated title2";
      return data;
    },
  )
  twoTransformersAsArgument(@Body body: PostCreateDTO): ApiResponse<Post> {}

  @POST("/")
  @ResponseTransformer((data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
    data.title = "updated title1";
    return data;
  })
  @ResponseTransformer((data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
    data.title = "updated title2";
    return data;
  })
  twoTransformersAsDifferentDecorators(@Body body: PostCreateDTO): ApiResponse<Post> {}
}
