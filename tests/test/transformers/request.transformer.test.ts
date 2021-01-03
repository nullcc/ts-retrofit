import { ServiceBuilder } from "../../../src";
import { testServer, verifyBody, verifyRequest } from "../../testHelpers";
import { Post, PostCreateDTO, PostsApiService } from "../../fixture/fixtures";
import { AxiosResponse } from "axios";
import { RequestTransformerApiService } from "../../fixture/fixtures.transformer";

describe("Request transformer", () => {
  let service: RequestTransformerApiService;

  beforeAll(() => {
    service = new ServiceBuilder().baseUrl(testServer.url).build(RequestTransformerApiService);
  });

  test("Single", async () => {
    const response = await service.requestTransformer(PostsApiService.dto);

    verify(response, {
      ...PostsApiService.dto,
      title: "updated title1",
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
    verifyBody(response, expected, expected);
  }
});
