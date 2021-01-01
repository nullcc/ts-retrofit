import { BasePath, BaseService, GET, Response, Timeout } from "../../src";
import { API_PREFIX } from "./fixtures";

@BasePath(API_PREFIX)
export class TimeoutService extends BaseService {
  @GET("/sleep-5000")
  async sleep5000(): Promise<Response> {
    return <Response>{};
  }

  @GET("/sleep-5000")
  @Timeout(3000)
  async timeoutIn3000(): Promise<Response> {
    return <Response>{};
  }

  @GET("/sleep-5000")
  @Timeout(6000)
  async timeoutIn6000(): Promise<Response> {
    return <Response>{};
  }
}
