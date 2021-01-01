import { ServiceBuilder } from "../../../src/service.builder";
import { JSONPLACEHOLDER_URL, verifyBody, verifyRequest } from "../../testHelpers";
import { PostsApiService, TransformerApiService } from "../../fixture/fixtures";

describe("Response transformer", () => {
  let service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(TransformerApiService);

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
