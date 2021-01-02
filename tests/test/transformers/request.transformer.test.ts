import { ServiceBuilder } from "../../../src/service.builder";
import { testServer, verifyBody, verifyRequest } from "../../testHelpers";
import { PostsApiService } from "../../fixture/fixtures";
import { AxiosRequestConfig } from "axios";
import { TransformerApiService } from "../../fixture/fixtures.transformer";

describe("Request transformer", () => {
  test("@RequestTransformer", async () => {
    const interceptor = (config: AxiosRequestConfig) => {
      return config;
    };

    const service = new ServiceBuilder()
      .baseUrl(testServer.url)
      .setRequestInterceptors(interceptor)
      .build(TransformerApiService);

    const transformed = {
      ...PostsApiService.dto,
      title: "updated title1",
    };

    const response = await service.requestTransformer(PostsApiService.dto);

    verifyRequest(response, "post", "/posts/", 201);
    verifyBody(response, transformed, transformed);
  });
});
