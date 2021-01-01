import { ServiceBuilder } from "../../../src/service.builder";
import { JSONPLACEHOLDER_URL, verifyBody, verifyRequest } from "../../testHelpers";
import { PostsApiService, TransformerApiService } from "../../fixture/fixtures";

// @BUG
describe.skip("Request transformer", () => {
  let service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(TransformerApiService);

  test("@RequestTransformer", async () => {
    const transformed = {
      ...PostsApiService.dto,
      title: "updated title1",
    };

    const response = await service.requestTransformer(PostsApiService.dto);

    verifyRequest(response, "post", "/posts/", 201);
    verifyBody(response, transformed, transformed);
  });
});
