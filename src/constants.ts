import { Method } from "axios";

export type HttpMethod = Method;

export const DATA_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "application/json",
  "text/xml",
];
