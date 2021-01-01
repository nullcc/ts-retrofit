import { BasePath, BaseService, GET, Multipart, Part, Path, POST, Response, ResponseType } from "../../src";
import { PartDescriptor } from "../../src/constants";
import { API_PREFIX } from "./fixtures";

@BasePath(API_PREFIX)
export class FileService extends BaseService {
  @POST("/upload")
  @Multipart
  async upload(
    @Part("bucket") bucket: PartDescriptor<string>,
    @Part("file") file: PartDescriptor<Buffer>,
  ): Promise<Response> {
    return <Response>{};
  }

  @GET("/file")
  @ResponseType("stream")
  async getFile(@Path("fileId") fileId: string): Promise<Response> {
    return <Response>{};
  }
}

@BasePath(API_PREFIX)
export class MessagingService extends BaseService {
  @POST("/sms")
  @Multipart
  async createSMS(
    @Part("from") from: PartDescriptor<string>,
    @Part("to") to: PartDescriptor<string[]>,
  ): Promise<Response> {
    return <Response>{};
  }
}
