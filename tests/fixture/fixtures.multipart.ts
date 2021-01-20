import { BasePath, BaseService, GET, Multipart, Part, Path, POST, ResponseType, ApiResponse } from "../../src";
import { PartDescriptor } from "../../src/constants";
import { API_PREFIX } from "./fixtures";

@BasePath(API_PREFIX)
export class FileService extends BaseService {
  @POST("/upload")
  @Multipart
  upload(@Part("bucket") bucket: PartDescriptor<string>, @Part("file") file: PartDescriptor<Buffer>): ApiResponse {}

  @GET("/file")
  @ResponseType("stream")
  getFile(@Path("fileId") fileId: string): ApiResponse {}
}

@BasePath(API_PREFIX)
export class MessagingService extends BaseService {
  @POST("/sms")
  @Multipart
  createSMS(@Part("from") from: PartDescriptor<string>, @Part("to") to: PartDescriptor<string[]>): ApiResponse {}
}
