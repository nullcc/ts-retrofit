import { ResponseType as AxiosResponseType, AxiosTransformer, AxiosRequestConfig } from "axios";
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

export interface HttpMethodOptions {
  ignoreBasePath?: boolean;
}

/**
 * Ensure the `__meta__` attribute is in the target object and `methodName` has been initialized.
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
 */
const registerMethod = (method: HttpMethod, url: string, options?: HttpMethodOptions) => {
  return (target: BaseService, methodName: string, descriptor: PropertyDescriptor) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].method = method;
    target.__meta__[methodName].path = url;
    target.__meta__[methodName].options = options;
  };
};

/**
 * @sample @GET("/users")
 */
export const GET = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("GET", url, options);
};

/**
 * @sample @POST("/users")
 */
export const POST = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("POST", url, options);
};

/**
 * @sample @PUT("/users/{userId}")
 */
export const PUT = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("PUT", url, options);
};

/**
 * @sample @PATCH("/users/{userId}")
 */
export const PATCH = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("PATCH", url, options);
};

/**
 * DELETE decorator.
 * @param url
 * @param options
 * @sample @DELETE("/users/{userId}")
 * @constructor
 */
export const DELETE = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("DELETE", url, options);
};

/**
 * @sample @HEAD("/users/{userId}")
 */
export const HEAD = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("HEAD", url, options);
};

/**
 * @sample @OPTIONS("/users/{userId}")
 */
export const OPTIONS = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("OPTIONS", url, options);
};

/**
 * @sample @BasePath("/api/v1")
 */
export const BasePath = (path: string) => {
  return (target: typeof BaseService) => {
    ensureMeta(target.prototype, "basePath");
    target.prototype.__meta__.basePath = path;
  };
};

/**
 * @sample @Path("userId") userId: number
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
 * @sample @Body user: User
 */
export const Body = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].bodyIndex = paramIndex;
};

/**
 * @sample @Headers({
 *           "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
 *           "Accept": "application/json"
 *         })
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
 * @sample @Header("X-Token") token: string
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
 * @sample @HeaderMap headers: any
 */
export const HeaderMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].headerMapIndex = paramIndex;
};

/**
 * @sample @Queries({
 *           page: 1,
 *           size: 20,
 *           sort: "createdAt:desc",
 *         })
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
 * @sample @Query('group') group: string
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
 * @sample @QueryMap query: SearchQuery
 */
export const QueryMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].queryMapIndex = paramIndex;
};

/**
 * 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' will be added.
 * @sample @FormUrlEncoded
 */
export const FormUrlEncoded = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  Headers({ "content-type": "application/x-www-form-urlencoded;charset=utf-8" })(target, methodName, descriptor);
};

/**
 * Set field of form for API endpoint. Only effective when method has been decorated by @FormUrlEncoded.
 * @sample @Field("title") title: string
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
 * @sample @FieldMap post: Post
 */
export const FieldMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].fieldMapIndex = paramIndex;
};

/**
 * 'content-type': 'multipart/form-data' will be added to HTTP headers.
 * @sample @Multipart
 */
export const Multipart = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  Headers({ "content-type": "multipart/form-data" })(target, methodName, descriptor);
};

/**
 * Set part of form data for API endpoint. Only effective when method has been decorated by @Multipart.
 * @sample @Part("bucket") bucket: PartDescriptor<string>
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
 * @sample @ResponseType("stream")
 */
export const ResponseType = (responseType: AxiosResponseType) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseType = responseType;
  };
};

/**
 * Set request transformer for method.
 * @sample @RequestTransformer((data: any, headers?: any) => {
 *           data.foo = 'foo';
 *           return JSON.stringify(data);
 *         })
 */
export const RequestTransformer = (transformer: AxiosTransformer) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].requestTransformer = transformer;
  };
};

/**
 * Set response transformer for method.
 * @sample @ResponseTransformer((data: any, headers?: any) => {
 *           const json = JSON.parse(data);
 *           json.foo = 'foo';
 *           return json;
 *         })
 */
export const ResponseTransformer = (transformer: AxiosTransformer) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseTransformer = transformer;
  };
};

/**
 * Set timeout for method, this config will shield service timeout.
 * @sample @Timeout(5000)
 */
export const Timeout = (timeout: number) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].timeout = timeout;
  };
};

/**
 * Declare response status code for method, do nothing just a declaration.
 * @sample ResponseStatus(204)
 */
export const ResponseStatus = (responseStatus: number) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseStatus = responseStatus;
  };
};

/**
 * A direct way to set config for a request in axios.
 * @sample @Config({ maxRedirects: 1 })
 */
export const Config = (config: Partial<AxiosRequestConfig>) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].config = config;
  };
};
