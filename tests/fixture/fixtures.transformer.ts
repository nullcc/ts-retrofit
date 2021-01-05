import {
  ApiResponse,
  BasePath,
  BaseService,
  Body,
  GET,
  POST,
  RequestTransformer,
  ResponseTransformer,
  STUB_RESPONSE,
} from "../../src";
import { Post, PostCreateDTO, PostsApiService } from "./fixtures";

@BasePath(PostsApiService.BASE_PATH)
export class RequestTransformerApiService extends BaseService {
  @POST("/")
  @RequestTransformer((data: Record<string, unknown>) => {
    data.title = "updated title1";
    return data;
  })
  async requestTransformer(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE<ApiResponse<Post>>(); // to test with param
  }

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
  @GET("/")
  @ResponseTransformer((data: Record<string, unknown>[], headers?: { [key: string]: unknown }) => {
    data[0].title = "transformer";
    return data;
  })
  async array(): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @ResponseTransformer((data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
    data.title = "updated title2";
    return data;
  })
  async single(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

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
  async twoTransformersAsArgument(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @ResponseTransformer((data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
    data.title = "updated title1";
    return data;
  })
  @ResponseTransformer((data: Record<string, unknown>, headers?: { [key: string]: unknown }) => {
    data.title = "updated title2";
    return data;
  })
  async twoTransformersAsDifferentDecorators(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }
}
