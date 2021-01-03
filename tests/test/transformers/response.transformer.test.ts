import { ServiceBuilder } from "../../../src";
import { testServer, verifyBody, verifyRequest } from "../../testHelpers";
import { PostsApiService } from "../../fixture/fixtures";
import { TransformerApiService } from "../../fixture/fixtures.transformer";

describe("Response transformer", () => {
  let service: TransformerApiService;

  beforeAll(() => {
    service = new ServiceBuilder().baseUrl(testServer.url).build(TransformerApiService);
  });

  test("@ResponseTransformer", async () => {
    const transformed = {
      ...PostsApiService.dto,
      title: "updated title2",
    };

    const response = await service.responseTransformer(PostsApiService.dto);

    verifyRequest(response, "post", "/posts/", 201);
    verifyBody(response, PostsApiService.dto, transformed);
  });
});
