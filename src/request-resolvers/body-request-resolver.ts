import { CONTENT_TYPE_HEADER, DataType, MethodMetadata } from "../constants";
import { DataResolverFactory } from "../dataResolver";
import { ErrorMessages } from "../baseService";
import { AxiosRequestHeaders } from "axios";

export const requestBodyResolver = (
  metadata: MethodMetadata,
  methodName: string,
  headers: AxiosRequestHeaders,
  args: unknown[],
): DataType => {
  const bodyIndex = metadata.bodyIndex;
  const fieldMapIndex = metadata.fieldMapIndex;
  let data: DataType | DataType[] = {};

  // @Body
  data = resolveBody(bodyIndex, args, data);

  // @Field
  data = resolveField(metadata, args, data);

  // @FieldMap
  data = resolveFieldMap(fieldMapIndex, args, data);

  // @MultiPart
  data = resolveMultipart(metadata, args, data);

  const contentType = headers[CONTENT_TYPE_HEADER] as string;
  const dataResolver = DataResolverFactory.createDataResolver(contentType);
  return dataResolver.resolve(headers, data);
};

// @Body
function resolveBody(
  bodyIndex: number | undefined,
  args: unknown[],
  data: DataType | DataType[],
): DataType | DataType[] {
  if (bodyIndex === undefined) return data;

  const argValue = args[bodyIndex];

  if (Array.isArray(argValue)) {
    data = argValue;
  } else {
    data = { ...(data as Record<string, unknown>), ...(argValue as Record<string, unknown>) };
  }
  return data;
}

// @Field
const resolveField = (
  metadata: MethodMetadata,
  args: unknown[],
  data: DataType | DataType[],
): DataType | DataType[] => {
  if (Object.keys(metadata.fields).length === 0) return data;

  const result = {};
  Object.entries(metadata.fields).map((e) => {
    const [idx, fieldKey] = e;
    if (fieldKey === "") throw new Error(ErrorMessages.EMPTY_FIELD_KEY);

    result[fieldKey] = args[idx];
  });

  if (Array.isArray(data)) {
    throw new Error(ErrorMessages.FIELD_WITH_ARRAY_BODY);
  }

  return { ...(data as Record<string, unknown>), ...result };
};

// @MultiPart
const resolveMultipart = (
  metadata: MethodMetadata,
  args: unknown[],
  data: DataType | DataType[],
): DataType | DataType[] => {
  if (Object.keys(metadata.parts).length === 0) return data;

  if (Array.isArray(data)) {
    throw new Error(ErrorMessages.MULTIPART_WITH_ARRAY_BODY);
  }

  const result = {};
  Object.entries(metadata.parts).map((e) => {
    const [idx, partKey] = e;
    if (partKey === "") throw new Error(ErrorMessages.EMPTY_PART_KEY);

    result[partKey] = args[idx];
  });

  return { ...(data as Record<string, unknown>), ...result };
};

// @FieldMap
const resolveFieldMap = (
  fieldMapIndex: number | undefined,
  args: unknown[],
  data: DataType | DataType[],
): DataType | DataType[] => {
  if (fieldMapIndex === undefined) return data;

  if (Array.isArray(data)) {
    throw new Error(ErrorMessages.FIELD_MAP_FOR_ARRAY_BODY);
  }

  const fieldMap = args[fieldMapIndex] as Record<string, unknown>;
  if (Array.isArray(fieldMap)) {
    throw new Error(ErrorMessages.FIELD_MAP_PARAM_TYPE);
  }

  const result = {};
  Object.entries(fieldMap).map((e) => {
    const [fieldKey, fieldValue] = e;
    if (fieldKey === "") throw new Error(ErrorMessages.EMPTY_FIELD_KEY);

    result[fieldKey] = fieldValue;
  });

  return { ...(data as Record<string, unknown>), ...result };
};
