import { CONTENT_TYPE, CONTENT_TYPE_HEADER, MethodMetadata } from "../constants";
import { DataResolverFactory } from "../dataResolver";

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

  const contentType = headers[CONTENT_TYPE_HEADER] || CONTENT_TYPE.APPLICATION_JSON;
  const dataResolverFactory = new DataResolverFactory();
  const dataResolver = dataResolverFactory.createDataResolver(contentType);
  return dataResolver.resolve(headers, data);
};

// @Body
function resolveBody(bodyIndex: number | undefined, args: any[], data: {}) {
  if (bodyIndex === undefined || bodyIndex < 0) return data;

  if (Array.isArray(args[bodyIndex])) {
    data = args[bodyIndex];
  } else {
    data = { ...data, ...args[bodyIndex] };
  }
  return data;
}

const resolveField = (metadata: MethodMetadata, args: any[], data: {}) => {
  if (Object.keys(metadata.fields).length === 0) return data;

  const reqData = {};
  for (const pos in metadata.fields) {
    if (metadata.fields[pos]) {
      reqData[metadata.fields[pos]] = args[pos];
    }
  }
  return { ...data, ...reqData };
};

// @MultiPart
const resolveMultipart = (metadata: MethodMetadata, args: any[], data: {}) => {
  if (Object.keys(metadata.parts).length === 0) return data;

  const reqData = {};
  for (const pos in metadata.parts) {
    if (metadata.parts[pos]) {
      reqData[metadata.parts[pos]] = args[pos];
    }
  }
  return { ...data, ...reqData };
};

// @FieldMap
const resolveFieldMap = (fieldMapIndex: number | undefined, args: any[], data: {}) => {
  if (fieldMapIndex === undefined || fieldMapIndex < 0) return data;

  const reqData = {};
  for (const key in args[fieldMapIndex]) {
    if (args[fieldMapIndex][key]) {
      reqData[key] = args[fieldMapIndex][key];
    }
  }
  return { ...data, ...reqData };
};
