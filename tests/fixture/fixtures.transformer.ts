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
export class TransformerApiService extends BaseService {
  @POST("/")
  @RequestTransformer((data: PostCreateDTO) => {
    data.title = "updated title1";
    return JSON.stringify(data);
  })
  async requestTransformer(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE<ApiResponse<Post>>(); // to test with param
  }

  @POST("/")
  @RequestTransformer((data: PostCreateDTO) => {
    data.title = "updated title1";
    return JSON.stringify(data);
  })
  async twoRequestTransformers(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }

  @POST("/")
  @ResponseTransformer((body: string, headers?: { [key: string]: unknown }) => {
    const data = JSON.parse(body);
    data.title = "updated title2";
    return data;
  })
  async responseTransformer(@Body body: PostCreateDTO): ApiResponse<Post> {
    return STUB_RESPONSE();
  }
}
