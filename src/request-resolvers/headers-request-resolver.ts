import { ErrorMessages } from "../baseService";
import { MethodMetadata } from "../constants";
import { AxiosRequestHeaders } from "axios";

export const requestHeadersResolver = (
  metadata: MethodMetadata,
  methodName: string,
  args: unknown[],
): AxiosRequestHeaders => {
  const headers = metadata.headers;

  Object.entries(metadata.headerParams).map((e) => {
    const [idx, headerKey] = e;
    if (headerKey === "") throw new Error(ErrorMessages.EMPTY_HEADER_KEY);

    const value = args[idx];
    if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
      metadata.headers[headerKey] = args[idx];
    } else {
      throw new Error(ErrorMessages.WRONG_HEADER_TYPE);
    }
  });

  const headerMapIndex = metadata.headerMapIndex;
  if (headerMapIndex === undefined) return headers;

  const headerMap = args[headerMapIndex] as Record<string, unknown>;

  Object.entries(headerMap).map((e) => {
    const [headerKey, headerValue] = e;
    if (headerKey === "") throw new Error(ErrorMessages.EMPTY_HEADER_KEY);

    if (typeof headerValue === "number" || typeof headerValue === "string" || typeof headerValue === "boolean") {
      metadata.headers[headerKey] = `${headerValue}`;
    } else {
      throw new Error(ErrorMessages.WRONG_HEADERS_PROPERTY_TYPE);
    }
  });

  return headers;
};
