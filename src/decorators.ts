import {
  ResponseType as AxiosResponseType,
  AxiosTransformer,
} from "axios";
import { HttpMethod } from "./constants";
import { BaseService } from "./baseService";

interface Headers {
  [x: string]: string | number;
}

interface Query {
  [x: string]: string | number | boolean;
}

export interface PartDescriptor<T> {
  value: T;
  filename?: string;
}

/**
 * Ensure the `__meta__` attribute is in the target object and `methodName` has been initialized.
 * @param target
 * @param methodName
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
 * @param method
 * @param url
 */
const registerMethod = (method: HttpMethod, url: string) => {
  return (target: BaseService, methodName: string, descriptor: PropertyDescriptor) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].method = method;
    target.__meta__[methodName].path = url;
  };
};

/**
 * GET decorator.
 * @param url
 * @constructor
 */
export const GET = (url: string) => {
  return registerMethod("GET", url);
};

/**
 * POST decorator.
 * @param url
 * @constructor
 */
export const POST = (url: string) => {
  return registerMethod("POST", url);
};

/**
 * PUT decorator.
 * @param url
 * @constructor
 */
export const PUT = (url: string) => {
  return registerMethod("PUT", url);
};

/**
 * PATCH decorator.
 * @param url
 * @constructor
 */
export const PATCH = (url: string) => {
  return registerMethod("PATCH", url);
};

/**
 * DELETE decorator.
 * @param url
 * @constructor
 */
export const DELETE = (url: string) => {
  return registerMethod("DELETE", url);
};

/**
 * HEAD decorator.
 * @param url
 * @constructor
 */
export const HEAD = (url: string) => {
  return registerMethod("HEAD", url);
};

/**
 * OPTIONS decorator.
 * @param url
 * @constructor
 */
export const OPTIONS = (url: string) => {
  return registerMethod("OPTIONS", url);
};

/**
 * Set base path for API service.
 * @param path
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
 * @param paramName
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
 * @param methodName
 * @param paramIndex
 * @constructor
 */
export const Body = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].bodyIndex = paramIndex;
};

/**
 * Set static HTTP headers for API endpoint.
 * @param headers
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
 * @param paramName
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
 * @param methodName
 * @param paramIndex
 * @constructor
 */
export const HeaderMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].headerMapIndex = paramIndex;
};

/**
 * Set static query for API endpoint.
 * @param query
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
 * @param paramName
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
 * @param methodName
 * @param paramIndex
 * @constructor
 */
export const QueryMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].queryMapIndex = paramIndex;
};

/**
 * 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' will be added.
 * @param target
 * @param methodName
 * @param descriptor
 * @constructor
 */
export const FormUrlEncoded = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  Headers({ "content-type": "application/x-www-form-urlencoded;charset=utf-8" })(target, methodName, descriptor);
};

/**
 * Set field of form for API endpoint. Only effective when method has been decorated by @FormUrlEncoded.
 * @param paramName
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
 * @param methodName
 * @param paramIndex
 * @constructor
 */
export const FieldMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].fieldMapIndex = paramIndex;
};

/**
 * 'content-type': 'multipart/form-data' will be added to HTTP headers.
 * @param target
 * @param methodName
 * @param descriptor
 * @constructor
 */
export const Multipart = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  Headers({ "content-type": "multipart/form-data" })(target, methodName, descriptor);
};

/**
 * Set part of form data for API endpoint. Only effective when method has been decorated by @Multipart.
 * @param paramName
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
 * Set the response type for method.
 * @param responseType
 * @constructor
 */
export const ResponseType = (responseType: AxiosResponseType) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseType = responseType;
  };
};

/**
 * Set request transformer for method.
 * @param transformer
 * @constructor
 */
export const RequestTransformer = (transformer: AxiosTransformer) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].requestTransformer = transformer;
  };
};

/**
 * Set response transformer for method.
 * @param transformer
 * @constructor
 */
export const ResponseTransformer = (transformer: AxiosTransformer) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseTransformer = transformer;
  };
};

/**
 * Set timeout for method, this config will shield service timeout.
 * @param timeout
 * @constructor
 */
export const Timeout = (timeout: number) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].timeout = timeout;
  };
};

/**
 * Declare response status code for method, do nothing just a declaration.
 * @param responseStatus
 * @constructor
 */
export const ResponseStatus = (responseStatus: number) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseStatus = responseStatus;
  };
};
