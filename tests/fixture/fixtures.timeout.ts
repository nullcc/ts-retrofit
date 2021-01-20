import { BasePath, BaseService, GET, Timeout, ApiResponse } from "../../src";
import { API_PREFIX } from "./fixtures";

@BasePath(API_PREFIX)
export class TimeoutService extends BaseService {
  @GET("/sleep-5000")
  sleep5000(): ApiResponse {}

  @GET("/sleep-5000")
  @Timeout(3000)
  timeoutIn3000(): ApiResponse {}

  @GET("/sleep-5000")
  @Timeout(6000)
  timeoutIn6000(): ApiResponse {}
}
