import { AxiosRequestConfig, AxiosTransformer, Method, ResponseType as AxiosResponseType } from "axios";
import { ValidationError } from "class-validator";

export enum ValidationMethod {
  CLASS_VALIDATOR = "CLASS_VALIDATOR",
}

export class ValidationErrors extends Error {
  constructor(public errors: ValidationError[], public response: string) {
    super(`Response:\n${response}\n\nHas validation errors: ${errors.length}\n${errors.map((e) => e.toString())}`);
  }
}

export type ResponseConvertTo = new () => void;
export type DataType = Record<string, unknown> | unknown;

export type HttpMethod = Method;

export const CONTENT_TYPE_HEADER = "Content-Type";
export const CHARSET_UTF_8 = "charset=utf-8";
export type Primitive = string | number | boolean;

export enum CONTENT_TYPE {
  FORM_URL_ENCODED = "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA = "multipart/form-data",
  APPLICATION_JSON = "application/json",
  XML = "text/xml",
  HTML = "text/html",
}

export type HeadersParamType = {
  [x: string]: Primitive;
};

export type QueriesParamType = {
  [x: string]: Primitive;
};

export interface TransformerType<T extends DataType = DataType> {
  (data: T, headers?: HeadersParamType): T;
}

export type MethodMetadata = {
  config?: Partial<AxiosRequestConfig>;
  responseType?: AxiosResponseType;
  requestTransformer: AxiosTransformer[];
  responseTransformer: AxiosTransformer[];
  timeout?: number;
  convertTo?: ResponseConvertTo;
  path?: string;
  pathParams: { [key: number]: string };
  //basePath?: string;
  options?: HttpMethodOptions;
  httpMethod?: HttpMethod;
  bodyIndex?: number;
  fields: { [key: number]: string };
  parts: { [key: number]: string };
  fieldMapIndex?: number;

  headers: HeadersParamType;
  headerParams: { [key: number]: string };
  headerMapIndex?: number;
  query: QueriesParamType;
  queryMapIndex?: number;
  queryParams: { [key: number]: string | number };
  responseStatus?: number;
};

export type HttpMethodOptions = {
  ignoreBasePath?: boolean;
  convertTo?: ResponseConvertTo;
};

export interface PartDescriptor<T> {
  value: T;
  filename?: string;
}
