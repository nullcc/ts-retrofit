import { CONTENT_TYPE, CONTENT_TYPE_HEADER, MethodMetadata } from "../constants";
import { DataResolverFactory } from "../dataResolver";
import { ErrorMessages } from "../baseService";

export const requestBodyResolver = (metadata: MethodMetadata, methodName: string, headers: any, args: any[]): any => {
  const bodyIndex = metadata.bodyIndex;
  const fieldMapIndex = metadata.fieldMapIndex;
  let data = {};

  // @Body
  data = resolveBody(bodyIndex, args, data);

  // @Field
  data = resolveField(metadata, args, data);

  // @FieldMap
  data = resolveFieldMap(fieldMapIndex, args, data);

  // @MultiPart
  data = resolveMultipart(metadata, args, data);

  const contentType = headers[CONTENT_TYPE_HEADER];
  const dataResolverFactory = new DataResolverFactory();
  const dataResolver = dataResolverFactory.createDataResolver(contentType);
  return dataResolver.resolve(headers, data);
};

// @Body
function resolveBody(bodyIndex: number | undefined, args: any[], data: {}) {
  if (bodyIndex === undefined) return data;

  const argValue = args[bodyIndex];

  if (Array.isArray(argValue)) {
    data = argValue;
  } else {
    data = { ...data, ...argValue };
  }
  return data;
}

// @Field
const resolveField = (metadata: MethodMetadata, args: any[], data: {}) => {
  if (Object.keys(metadata.fields).length === 0) return data;

  const result = {};
  Object.entries(metadata.fields).map((e) => {
    const [idx, fieldKey] = e;
    if (fieldKey === "") throw Error(ErrorMessages.EMPTY_FIELD_KEY);

    result[fieldKey] = args[idx];
  });

  return { ...data, ...result };
};

// @MultiPart
const resolveMultipart = (metadata: MethodMetadata, args: any[], data: {}) => {
  if (Object.keys(metadata.parts).length === 0) return data;

  const result = {};
  Object.entries(metadata.parts).map((e) => {
    const [idx, partKey] = e;
    if (partKey === "") throw Error(ErrorMessages.EMPTY_PART_KEY);

    result[partKey] = args[idx];
  });
  return { ...data, ...result };
};

// @FieldMap
const resolveFieldMap = (fieldMapIndex: number | undefined, args: any[], data: {}) => {
  if (fieldMapIndex === undefined) return data;

  const fieldMap = args[fieldMapIndex];

  const result = {};
  Object.entries(fieldMap).map((e) => {
    const [fieldKey, fieldValue] = e;
    if (fieldKey === "") throw Error(ErrorMessages.EMPTY_FIELD_KEY);

    result[fieldKey] = fieldValue;
  });

  return { ...data, ...result };
};
