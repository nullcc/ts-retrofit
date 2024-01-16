import {
  ResponseType as AxiosResponseType,
   AxiosRequestTransformer, AxiosResponseTransformer, InternalAxiosRequestConfig,
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
  contentType?: string;
}

export interface HttpMethodOptions {
  ignoreBasePath?: boolean;
}

// indices:  ?foo[0]=bar&foo[1]=qux
// brackets: ?foo[]=bar&foo[]=qux
// repeat:   ?foo=bar&foo=qux
// comma:    ?foo=bar,qux
export type QueryArrayFormat = "indices" | "brackets" | "repeat" | "comma";

export interface QueryOptions {
  arrayFormat?: QueryArrayFormat; // default is brackets
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
 * @param options
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
 * GET decorator.
 * @param url
 * @param options
 * @sample @GET("/users")
 * @constructor
 */
export const GET = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("GET", url, options);
};

/**
 * POST decorator.
 * @param url
 * @param options
 * @sample @POST("/users")
 * @constructor
 */
export const POST = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("POST", url, options);
};

/**
 * PUT decorator.
 * @param url
 * @param options
 * @sample @PUT("/users/{userId}")
 * @constructor
 */
export const PUT = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("PUT", url, options);
};

/**
 * PATCH decorator.
 * @param url
 * @param options
 * @sample @PATCH("/users/{userId}")
 * @constructor
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
 * HEAD decorator.
 * @param url
 * @param options
 * @sample @HEAD("/users/{userId}")
 * @constructor
 */
export const HEAD = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("HEAD", url, options);
};

/**
 * OPTIONS decorator.
 * @param url
 * @param options
 * @sample @OPTIONS("/users/{userId}")
 * @constructor
 */
export const OPTIONS = (url: string, options?: HttpMethodOptions) => {
  return registerMethod("OPTIONS", url, options);
};

/**
 * Set base path for API service.
 * @param path
 * @sample @BasePath("/api/v1")
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
 * @sample @Path("userId") userId: number
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
 * @sample @Body user: User
 * @constructor
 */
export const Body = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].bodyIndex = paramIndex;
};

/**
 * Set static HTTP headers for API endpoint.
 * @param headers
 * @sample @Headers({
 *           "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
 *           "Accept": "application/json"
 *         })
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
 * @sample @Header("X-Token") token: string
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
 * @sample @HeaderMap headers: any
 * @constructor
 */
export const HeaderMap = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].headerMapIndex = paramIndex;
};

/**
 * Set array format for query
 * @param queryArrayFormat
 * @sample @QueryArrayFormat('repeat')
 * @constructor
 */
export const QueryArrayFormat = (queryArrayFormat: QueryArrayFormat) => {
  return (target: BaseService, methodName: string, descriptor: PropertyDescriptor) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].queryArrayFormat = queryArrayFormat;
  };
};

/**
 * Set static query for API endpoint.
 * @param query
 * @sample @Queries({
 *           page: 1,
 *           size: 20,
 *           sort: "createdAt:desc",
 *         })
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
 * @sample @Query('group') group: string
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
 * @sample @QueryMap query: SearchQuery
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
 * @sample @FormUrlEncoded
 * @constructor
 */
export const FormUrlEncoded = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  Headers({ "content-type": "application/x-www-form-urlencoded;charset=utf-8" })(target, methodName, descriptor);
};

/**
 * Set field of form for API endpoint. Only effective when method has been decorated by @FormUrlEncoded.
 * @param paramName
 * @sample @Field("title") title: string
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
 * @sample @FieldMap post: Post
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
 * @sample @Multipart
 * @constructor
 */
export const Multipart = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  Headers({ "content-type": "multipart/form-data" })(target, methodName, descriptor);
};

/**
 * Set part of form data for API endpoint. Only effective when method has been decorated by @Multipart.
 * @param paramName
 * @sample @Part("bucket") bucket: PartDescriptor<string>
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
 * @sample @ResponseType("stream")
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
 * @sample @RequestTransformer((data: any, headers?: any) => {
 *           data.foo = 'foo';
 *           return JSON.stringify(data);
 *         })
 * @constructor
 */
export const RequestTransformer = (transformer: AxiosRequestTransformer) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].requestTransformer = transformer;
  };
};

/**
 * Set response transformer for method.
 * @param transformer
 * @sample @ResponseTransformer((data: any, headers?: any) => {
 *           const json = JSON.parse(data);
 *           json.foo = 'foo';
 *           return json;
 *         })
 * @constructor
 */
export const ResponseTransformer = (transformer: AxiosResponseTransformer) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseTransformer = transformer;
  };
};

/**
 * Set timeout for method, this config will shield service timeout.
 * @param timeout
 * @sample @Timeout(5000)
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
 * @sample ResponseStatus(204)
 * @constructor
 */
export const ResponseStatus = (responseStatus: number) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].responseStatus = responseStatus;
  };
};

/**
 * A direct way to set config for a request in axios.
 * @param config
 * @sample @Config({ maxRedirects: 1 })
 * @constructor
 */
export const Config = (config: Partial<InternalAxiosRequestConfig>) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].config = config;
  };
};

/**
 * A easy way to send GraphQL query.
 * @param query
 * @param operationName
 * @sample @GraphQL(gqlQuery)
 * @constructor
 */
export const GraphQL = (query: string, operationName?: string) => {
  return (target: any, methodName: string) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].gqlQuery = query;
    target.__meta__[methodName].gqlOperationName = operationName;
  };
};

/**
 * Adds variables to GraphQL query
 * @param target
 * @param methodName
 * @param paramIndex
 * @sample @GraphQLVariables variables: any
 * @constructor
 */
export const GraphQLVariables = (target: any, methodName: string, paramIndex: number) => {
  ensureMeta(target, methodName);
  target.__meta__[methodName].gqlVariablesIndex = paramIndex;
};

/**
 * Mark method as deprecated
 * @param hint
 * @sample @Deprecated("This method is deprecated on version 2.0, please use xxx.")
 * @constructor
 */
export const Deprecated = (hint?: string) => {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    ensureMeta(target, methodName);
    target.__meta__[methodName].deprecated = true;
    target.__meta__[methodName].deprecatedHint = hint;
  };
};
