import { HttpMethod } from "./constants";
import { BaseService, IFilter } from "./baseService";

interface Headers {
  [x: string]: string | number;
}

interface Query {
  [x: string]: string | number | boolean;
}

/**
 * Ensure the `__meta__` attribute is in the target object and `methodName` has been initialized.
 * @param {BaseService} target
 * @param {string} methodName
 */
const ensureMeta = (target: BaseService, methodName: string) => {
  if (!target.__meta__) {
    target.__meta__ = {};
  }
  if (!target.__meta__[methodName]) {
    target.__meta__[methodName] = {};
  }
};

/**
 * Register HTTP method and path in API method.
 * @param {HttpMethod} method
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 */
const registerMethod = (method: HttpMethod, url: string) => {
  return (
    target: BaseService,
    methodName: string,
    descriptor: PropertyDescriptor
  ) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].method = method;
    target.__meta__[methodName].path = url;
  };
};

/**
 * GET decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const GET = (url: string) => {
  return registerMethod("GET", url);
};

/**
 * POST decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const POST = (url: string) => {
  return registerMethod("POST", url);
};

/**
 * PUT decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const PUT = (url: string) => {
  return registerMethod("PUT", url);
};

/**
 * PATCH decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const PATCH = (url: string) => {
  return registerMethod("PATCH", url);
};

/**
 * DELETE decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const DELETE = (url: string) => {
  return registerMethod("DELETE", url);
};

/**
 * HEAD decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const HEAD = (url: string) => {
  return registerMethod("HEAD", url);
};

/**
 * OPTIONS decorator
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const OPTIONS = (url: string) => {
  return registerMethod("OPTIONS", url);
};

/**
 * Set base path for API service.
 * @param {string} path
 * @return {(target: BaseService) => void}
 * @constructor
 */
export const BasePath = (path: string) => {
  return (target: typeof BaseService) => {
    ensureMeta(target.prototype, "basePath");
    target.prototype.__meta__.basePath = path;
  };
};

/**
 * Set path parameter for API endpoint.
 * @param {string} paramName
 * @return {(target: any, methodName: string, paramIndex: number) => void}
 * @constructor
 */
export const Path = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].pathParams) {
      target.__meta__[methodName].pathParams = {};
    }
    target.__meta__[methodName].pathParams[paramIndex] = paramName;
  };
};

/**
 * Set body for API endpoint.
 * @param target
 * @param {string} methodName
 * @param {number} paramIndex
 * @constructor
 */
export const Body = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].bodyIndex = paramIndex;
};

/**
 * Set static HTTP headers for API endpoint.
 * @param {Headers} headers
 * @return {(target: any, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const Headers = (headers: Headers) => {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].headers) {
      target.__meta__[methodName].headers = {};
    }
    target.__meta__[methodName].headers = headers;
  };
};

/**
 * Set HTTP header as variable in API method.
 * @param {string} paramName
 * @return {(target: any, methodName: string, paramIndex: number) => void}
 * @constructor
 */
export const Header = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].headerParams) {
      target.__meta__[methodName].headerParams = {};
    }
    target.__meta__[methodName].headerParams[paramIndex] = paramName;
  };
};

/**
 * Set header map for API endpoint.
 * @param target
 * @param {string} methodName
 * @param {number} paramIndex
 * @constructor
 */
export const HeaderMap = (
  target: any,
  methodName: string,
  paramIndex: number
) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].headerMapIndex = paramIndex;
};

/**
 * Set static query for API endpoint.
 * @param {Query} query
 * @return {(target: any, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const Queries = (query: Query) => {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].query) {
      target.__meta__[methodName].query = {};
    }
    target.__meta__[methodName].query = query;
  };
};

/**
 * Set query as variable in API method.
 * @param {string} paramName
 * @return {(target: any, methodName: string, paramIndex: number) => void}
 * @constructor
 */
export const Query = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].queryParams) {
      target.__meta__[methodName].queryParams = {};
    }
    target.__meta__[methodName].queryParams[paramIndex] = paramName;
  };
};

/**
 * Set query map for API endpoint.
 * @param target
 * @param {string} methodName
 * @param {number} paramIndex
 * @constructor
 */
export const QueryMap = (
  target: any,
  methodName: string,
  paramIndex: number
) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].queryMapIndex = paramIndex;
};

/**
 * 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' will be added
 * @param target
 * @param {string} methodName
 * @param {PropertyDescriptor} descriptor
 * @constructor
 */
export const FormUrlEncoded = (
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) => {
  Headers({
    "content-type": "application/x-www-form-urlencoded;charset=utf-8",
  })(target, methodName, descriptor);
};

/**
 * Set field of form for API endpoint. Only effective when method has been
 * decorated by @FormUrlEncoded.
 * @param {string} paramName
 * @return {(target: any, methodName: string, paramIndex: number) => void}
 * @constructor
 */
export const Field = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].fields) {
      target.__meta__[methodName].fields = {};
    }
    target.__meta__[methodName].fields[paramIndex] = paramName;
  };
};

/**
 * Set field map for API endpoint.
 * @param target
 * @param {string} methodName
 * @param {number} paramIndex
 * @constructor
 */
export const FieldMap = (
  target: any,
  methodName: string,
  paramIndex: number
) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].fieldMapIndex = paramIndex;
};

/**
 * 'content-type': 'multipart/form-data' will be added to HTTP headers.
 * @param target
 * @param {string} methodName
 * @param {PropertyDescriptor} descriptor
 * @constructor
 */
export const Multipart = (
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) => {
  Headers({ "content-type": "multipart/form-data" })(
    target,
    methodName,
    descriptor
  );
};

/**
 * Set part of form data for API endpoint. Only effective when method has been
 * decorated by @Multipart.
 * @param {string} paramName
 * @return {(target: any, methodName: string, paramIndex: number) => void}
 * @constructor
 */
export const Part = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].parts) {
      target.__meta__[methodName].parts = {};
    }
    target.__meta__[methodName].parts[paramIndex] = paramName;
  };
};

/**
 * Specify the response type in axios.
 * @param responseType
 * @returns {(target:any, methodName:string, paramIndex:number)=>undefined}
 * @constructor
 */
export const ResponseType = (responseType: string) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseType = responseType;
  };
};

export interface PartDescriptor<T> {
  value: T;
  filename?: string;
}

export const ActionFilter = (filter: IFilter) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    //init filters array
    !target.__meta__[methodName].Filters &&
      (target.__meta__[methodName].Filters = []);
    target.__meta__[methodName].Filters.push(filter);
  };
};
