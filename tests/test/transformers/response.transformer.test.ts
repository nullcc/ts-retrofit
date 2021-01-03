import { ServiceBuilder } from "../../../src";
import { testServer, verifyBody, verifyRequest } from "../../testHelpers";
import { Post, PostCreateDTO, PostsApiService } from "../../fixture/fixtures";
import { ResponseTransformerApiService } from "../../fixture/fixtures.transformer";
import { AxiosResponse } from "axios";

describe("Response transformer", () => {
  let service: ResponseTransformerApiService;

  beforeAll(() => {
    service = new ServiceBuilder().baseUrl(testServer.url).build(ResponseTransformerApiService);
  });

  test("1 transformer", async () => {
    const response = await service.responseTransformer(PostsApiService.dto);

    verify(response, {
      ...PostsApiService.dto,
      title: "updated title2",
    });
  });

  test("2 transformers (passed as arguments)", async () => {
    const response = await service.twoTransformersAsArgument(PostsApiService.dto);

    verify(response, {
      ...PostsApiService.dto,
      title: "updated title2",
    });
  });

  test("2 transformers (different decorators)", async () => {
    const response = await service.twoTransformersAsDifferentDecorators(PostsApiService.dto);

    verify(response, {
      ...PostsApiService.dto,
      title: "updated title2",
    });
  });

  function verify(response: AxiosResponse<Post>, expected: PostCreateDTO) {
    verifyRequest(response, "post", "/posts/", 201);
    verifyBody(response, PostsApiService.dto, expected);
  }
});
