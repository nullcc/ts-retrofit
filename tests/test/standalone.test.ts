import { ServiceBuilder } from "../../src/service.builder";
import { JSONPLACEHOLDER_URL } from "../testHelpers";
import { PostsApiService } from "../fixture/fixtures";
import axios from "axios";

describe("Standalone", () => {
  test("With instance", async () => {
    const serviceWithoutStandalone = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(PostsApiService);
    const axiosInstance = axios.create();

    axiosInstance.interceptors.response.use((value) => {
      value.config["standaloneId"] = 101;
      return value;
    });

    const serviceWithStandalone = new ServiceBuilder()
      .setEndpoint(JSONPLACEHOLDER_URL)
      .setStandalone(axiosInstance)
      .build(PostsApiService);

    expect((await serviceWithoutStandalone.get()).config["standaloneId"]).toBeUndefined();
    expect((await serviceWithStandalone.get()).config["standaloneId"]).toBe(101);
  });
});
