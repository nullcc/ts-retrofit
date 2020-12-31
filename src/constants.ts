import { Method } from "axios";

export type HttpMethod = Method;

export enum DATA_CONTENT_TYPES {
  FORM_URL_ENCODED = "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA = "multipart/form-data",
  APPLICATION_JSON = "application/json",
  XML = "text/xml"
}

export enum HttpContentType {
  urlencoded = "application/x-www-form-urlencoded",
  multipart = "multipart/form-data",
  json = "application/json",
  xml = "text/xml"
}
