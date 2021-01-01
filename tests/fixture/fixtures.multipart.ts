import {
  ApiResponse,
  BasePath,
  BaseService,
  GET,
  Multipart,
  Part,
  Path,
  POST,
  ResponseType,
  STUB_RESPONSE,
} from "../../src";
import { PartDescriptor } from "../../src/constants";
import { API_PREFIX } from "./fixtures";

@BasePath(API_PREFIX)
export class FileService extends BaseService {
  @POST("/upload")
  @Multipart
  async upload(
    @Part("bucket") bucket: PartDescriptor<string>,
    @Part("file") file: PartDescriptor<Buffer>,
  ): ApiResponse {
    return STUB_RESPONSE();
  }

  @GET("/file")
  @ResponseType("stream")
  async getFile(@Path("fileId") fileId: string): ApiResponse {
    return STUB_RESPONSE();
  }
}

@BasePath(API_PREFIX)
export class MessagingService extends BaseService {
  @POST("/sms")
  @Multipart
  async createSMS(@Part("from") from: PartDescriptor<string>, @Part("to") to: PartDescriptor<string[]>): ApiResponse {
    return STUB_RESPONSE();
  }
}
