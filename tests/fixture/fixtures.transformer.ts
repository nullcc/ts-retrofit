import {
  ApiResponse,
  BasePath,
  BaseService,
  Body,
  POST,
  RequestTransformer,
  ResponseTransformer,
  STUB_RESPONSE,
} from "../../src";
import { Post, PostCreateDTO, PostsApiService } from "./fixtures";

@BasePath(PostsApiService.BASE_PATH)
export class RequestTransformerApiService extends BaseService {
  @POST("/")
  @RequestTransformer((data: PostCreateDTO) => {
    data.title = "updated title1";
    return data;
  })
  async requestTransformer(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE<ApiResponse<Post>>(); // to test with param
  }

  @POST("/")
  @RequestTransformer(
    (data: PostCreateDTO) => {
      data.title = "updated title1";
      return data;
    },
    (data: PostCreateDTO) => {
      data.title = "updated title2";
      return data;
    },
  )
  async twoTransformersAsArgument(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

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
  async twoTransformersAsDifferentDecorators(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }
}

@BasePath(PostsApiService.BASE_PATH)
export class ResponseTransformerApiService extends BaseService {
  @POST("/")
  @ResponseTransformer((data: any, headers?: { [key: string]: unknown }) => {
    data.title = "updated title2";
    return data;
  })
  async responseTransformer(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @ResponseTransformer(
    (data: any, headers?: { [key: string]: unknown }) => {
      data.title = "updated title1";
      return data;
    },
    (data: Post, headers?: { [key: string]: unknown }) => {
      data.title = "updated title2";
      return data;
    },
  )
  async twoTransformersAsArgument(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @ResponseTransformer((data: any, headers?: { [key: string]: unknown }) => {
    data.title = "updated title1";
    return data;
  })
  @ResponseTransformer((data: any, headers?: { [key: string]: unknown }) => {
    data.title = "updated title2";
    return data;
  })
  async twoTransformersAsDifferentDecorators(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }
}
