import * as qs from "qs";
import FormData, { AppendOptions } from "form-data";
import { DATA_CONTENT_TYPES } from "./constants";
import {PartDescriptor} from "./decorators";

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
      if (Array.isArray(data[key])) {
        for (const element of data[key]) {
          const options = this.getFormDataAppendOptions(element);
          formData.append(key, element.value, options);
        }
      } else if (Array.isArray(data[key].value)) {
        for (const element of data[key].value) {
          const options = this.getFormDataAppendOptions(data[key]);
          formData.append(key, element, options);
        }
      } else {
        const options = this.getFormDataAppendOptions(data[key]);
        formData.append(key, data[key].value, options);
      }
    }
    return formData;
  }

  private getFormDataAppendOptions<T>(partDescriptor: PartDescriptor<T>): AppendOptions {
    const options = {};
    Object.keys(partDescriptor).forEach((key) => {
      if (key !== "value") {
        options[key] = partDescriptor[key];
      }
    });
    return options;
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
