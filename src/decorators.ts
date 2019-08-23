import { Method } from "./constants";
import { BaseService } from "./baseService";

interface IHeaders {
  [x: string]: string | number;
}

interface IQuery {
  [x: string]: string | number | boolean;
}

/**
 * Ensure the `__meta__` attribute is in the target object and
 * `methodName` has been initialized in it.
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
 * @param {string} method
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 */
const registerMethod = (method: string, url: string) => {
  return (target: BaseService, methodName: string, descriptor: PropertyDescriptor) => {
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
  return registerMethod(Method.GET, url);
};

/**
 * POST decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const POST = (url: string) => {
  return registerMethod(Method.POST, url);
};

/**
 * PUT decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const PUT = (url: string) => {
  return registerMethod(Method.PUT, url);
};

/**
 * PATCH decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const PATCH = (url: string) => {
  return registerMethod(Method.PATCH, url);
};

/**
 * DELETE decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const DELETE = (url: string) => {
  return registerMethod(Method.DELETE, url);
};

/**
 * HEAD decorator.
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const HEAD = (url: string) => {
  return registerMethod(Method.HEAD, url);
};

/**
 * OPTIONS decorator
 * @param {string} url
 * @return {(target: BaseService, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const OPTIONS = (url: string) => {
  return registerMethod(Method.OPTIONS, url);
};

/**
 * Set base path for API service.
 * @param {string} path
 * @return {(target: BaseService) => void}
 * @constructor
 */
export const BasePath = (path: string) => {
  return (target: typeof BaseService) => {
    if (!target.prototype.__meta__) {
      target.prototype.__meta__ = {};
    }
    target.prototype.__meta__.basePath = path;
  };
};

/**
 * Set path parameter for API endpoint.
 * @param {string} paramName
 * @return {(target: any, methodName: string, paramIndex: number) => void}
 * @constructor
 */
export const PathParam = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].pathParams) {
      target.__meta__[methodName].pathParams = {};
    }
    target.__meta__[methodName].pathParams[paramIndex] = paramName;
  };
};

/**
 * Set query map for API endpoint.
 * @param target
 * @param {string} methodName
 * @param {number} paramIndex
 * @constructor
 */
export const QueryMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].queryMap = paramIndex;
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
  target.__meta__[methodName].body = paramIndex;
};

/**
 * Set static HTTP headers for API endpoint.
 * @param {IHeaders} headers
 * @return {(target: any, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const Headers = (headers: IHeaders) => {
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
 * Set static query for API endpoint.
 * @param {IQuery} query
 * @return {(target: any, methodName: string, descriptor: PropertyDescriptor) => void}
 * @constructor
 */
export const Query = (query: IQuery) => {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    ensureMeta(target, methodName);
    if (!target.__meta__[methodName].headers) {
      target.__meta__[methodName].query = {};
    }
    target.__meta__[methodName].query = query;
  };
};
