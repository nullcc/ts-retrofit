import { ServiceBuilder } from "../../../src";
import { testServer, verifyBody, verifyRequest } from "../../testHelpers";
import { Post, PostCreateDTO, posts, PostsApiService } from "../../fixture/fixtures";
import { ResponseTransformerApiService } from "../../fixture/fixtures.transformer";
import { AxiosResponse } from "axios";

describe("Response transformer", () => {
  let service: ResponseTransformerApiService;

  beforeAll(() => {
    service = new ServiceBuilder().baseUrl(testServer.url).build(ResponseTransformerApiService);
  });

  test("1 transformer - array", async () => {
    const { data } = await service.array();

    expect(data).toHaveLength(posts.length);

    expect(data[0]).toMatchObject({
      ...posts[0],
      title: "transformer",
    });
    expect(data[1]).toMatchObject(posts[1]);
  });

  test("1 transformer", async () => {
    const response = await service.single(PostsApiService.dto);

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
