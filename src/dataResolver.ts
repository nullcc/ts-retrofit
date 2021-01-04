import * as qs from "qs";
import FormData from "form-data";
import { CONTENT_TYPE, CONTENT_TYPE_HEADER, DataType, HeadersParamType } from "./constants";
import { ErrorMessages } from "./baseService";

export class BaseDataResolver {
  public resolve(headers: HeadersParamType, data: DataType): DataType {
    throw new Error("Can not call this method in BaseDataResolver.");
  }
}

export class FormUrlencodedResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: HeadersParamType, data: DataType): DataType {
    const deepStringify = (obj: Record<string, unknown>) => {
      const res = {};
      for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        if (typeof obj[key] === "object") {
          res[key] = JSON.stringify(obj[key]);
        } else {
          res[key] = obj[key];
        }
      }
      return qs.stringify(res);
    };
    return deepStringify(data as Record<string, unknown>);
  }
}

export class MultiPartResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: HeadersParamType, data: Record<string, unknown>): FormData {
    const formData = new FormData();
    Object.entries(data).map((e) => {
      if (typeof e[1] !== "object") throw new Error(ErrorMessages.MULTIPART_PARAM_WRONG_TYPE);
      const [key] = e;
      const value = e[1] as Record<string, unknown>;

      if (value && "filename" in value) {
        formData.append(key, value.value, { filename: value.filename as string });
      } else {
        if (Array.isArray(value.value)) {
          for (const element of value.value) {
            formData.append(key, element);
          }
        } else {
          formData.append(key, value.value);
        }
      }
    });
    return formData;
  }
}

export class JsonResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: HeadersParamType, data: DataType): DataType {
    return data && typeof data === "string" ? JSON.parse(data) : data;
  }
}

export class TextXmlResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: HeadersParamType, data: DataType): DataType {
    return data;
  }
}

const dataResolverMap = new Map<string, typeof BaseDataResolver>();
dataResolverMap.set(CONTENT_TYPE.FORM_URL_ENCODED, FormUrlencodedResolver);
dataResolverMap.set(CONTENT_TYPE.MULTIPART_FORM_DATA, MultiPartResolver);
dataResolverMap.set(CONTENT_TYPE.APPLICATION_JSON, JsonResolver);
dataResolverMap.set(CONTENT_TYPE.XML, TextXmlResolver);
dataResolverMap.set(CONTENT_TYPE.HTML, TextXmlResolver);

export class DataResolverFactory {
  public static createDataResolver(contentType: string): BaseDataResolver;
  public static createDataResolver(headers: HeadersParamType): BaseDataResolver;

  public static createDataResolver(arg: string | HeadersParamType): BaseDataResolver {
    const argElement = arg[CONTENT_TYPE_HEADER] || arg[CONTENT_TYPE_HEADER.toLocaleLowerCase()];
    const contentType = typeof arg === "string" ? arg : (argElement as string);

    const contentTypeLowCased = contentType.toLowerCase();
    for (const dataContentType of Object.values(CONTENT_TYPE)) {
      if (contentTypeLowCased.includes(dataContentType)) {
        const resolverCls = this._getDataResolverCls(dataContentType);
        return new resolverCls();
      }
    }
    return new (this._getDataResolverCls(CONTENT_TYPE.APPLICATION_JSON))();
  }

  private static _getDataResolverCls(dataContentType: string): typeof BaseDataResolver {
    return dataResolverMap.get(dataContentType) || JsonResolver;
  }
}
