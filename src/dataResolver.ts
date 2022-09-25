import * as qs from "qs";
import FormData from "form-data";
import { DATA_CONTENT_TYPES } from "./constants";

export class BaseDataResolver {
  public resolve(headers: any, data: any): any {
    throw new Error("Can not call this method in BaseDataResolver.");
  }
}

export class FormUrlencodedResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: any, data: any): any {
    const deepStringify = (obj: any) => {
      const res = {};
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
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
    return deepStringify(data);
  }
}

export class MultiPartResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: any, data: any): any {
    const formData = new FormData();
    for (const key in data) {
      if (data[key].filename) {
        formData.append(key, data[key].value, { filename: data[key].filename });
      } else if (Array.isArray(data[key])) {
        for (const element of data[key]) {
          formData.append(key, element.value, { filename: element.filename });
        }
      } else if (Array.isArray(data[key].value)) {
        for (const element of data[key].value) {
          formData.append(key, element);
        }
      } else {
        formData.append(key, data[key].value);
      }
    }
    return formData;
  }
}

export class JsonResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: any, data: any): any {
    return data;
  }
}

export class TextXmlResolver extends BaseDataResolver {
  constructor() {
    super();
  }

  public resolve(headers: any, data: any): any {
    return data;
  }
}

const dataResolverMap: Map<string, typeof BaseDataResolver> = new Map<string, typeof BaseDataResolver>();
dataResolverMap.set("application/x-www-form-urlencoded", FormUrlencodedResolver);
dataResolverMap.set("multipart/form-data", MultiPartResolver);
dataResolverMap.set("application/json", JsonResolver);
dataResolverMap.set("text/xml", TextXmlResolver);

export class DataResolverFactory {
  public createDataResolver(contentType: string): BaseDataResolver {
    const contentTypeLowCased = contentType.toLowerCase();
    for (const dataContentType of DATA_CONTENT_TYPES) {
      if (contentTypeLowCased.includes(dataContentType)) {
        const resolverCls = this._getDataResolverCls(dataContentType);
        return new resolverCls();
      }
    }
    return new (this._getDataResolverCls("application/json"))();
  }

  private _getDataResolverCls(dataContentType: string): typeof BaseDataResolver {
    return dataResolverMap.get(dataContentType) || JsonResolver;
  }
}
