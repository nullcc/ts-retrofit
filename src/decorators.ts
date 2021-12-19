import { AxiosRequestConfig, AxiosRequestHeaders, ResponseType as AxiosResponseType } from "axios";
import {
  CHARSET_UTF_8,
  CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  DataType,
  HttpMethod,
  HttpMethodOptions,
  MethodMetadata,
  QueriesParamType,
  ResponseConvertTo,
  TransformerType,
} from "./constants";
import { BaseService } from "./baseService";

/**
 * Register HTTP method and path in API method.
 */
const registerMethod = <T extends BaseService>(method: HttpMethod, url: string, options?: HttpMethodOptions) => {
  return (target: T, methodName: string, descriptor: PropertyDescriptor) => {
    if (options?.convertTo) handleConvertTo(target, methodName, options?.convertTo);

    target.__getServiceMetadata().setMetadata(methodName, (prev: MethodMetadata) => ({
      httpMethod: method,
      path: url,
      options: {
        ...prev.options,
        ...options,
      },
    }));
  };
};

export const GET = <T extends BaseService>(url: string, options?: HttpMethodOptions) =>
  registerMethod<T>("GET", url, options);

export const POST = <T extends BaseService>(url: string, options?: HttpMethodOptions) =>
  registerMethod<T>("POST", url, options);
export const PUT = <T extends BaseService>(url: string, options?: HttpMethodOptions) =>
  registerMethod<T>("PUT", url, options);
export const PATCH = <T extends BaseService>(url: string, options?: HttpMethodOptions) =>
  registerMethod<T>("PATCH", url, options);
export const DELETE = <T extends BaseService>(url: string, options?: HttpMethodOptions) =>
  registerMethod<T>("DELETE", url, options);
export const HEAD = <T extends BaseService>(url: string, options?: HttpMethodOptions) =>
  registerMethod<T>("HEAD", url, options);
export const OPTIONS = <T extends BaseService>(url: string, options?: HttpMethodOptions) =>
  registerMethod<T>("OPTIONS", url, options);

/**
 * @sample @BasePath("/api/v1")
 */
export const BasePath = (path: string) => {
  return (target: typeof BaseService) => {
    target.prototype.__getServiceMetadata().basePath = path;
  };
};

/** @sample @Path("userId") userId: number */
export const Path = <T extends BaseService>(paramName: string) => {
  return (target: T, methodName: string, paramIndex: number) => {
    target.__getServiceMetadata().setMetadata(methodName, (prev: MethodMetadata) => ({
      pathParams: {
        ...prev.pathParams,
        [paramIndex]: paramName,
      },
    }));
  };
};

/** @sample @Body user: User */
export const Body = <T extends BaseService>(target: T, methodName: string, paramIndex: number) => {
  target.__getServiceMetadata().setMetadata(methodName, { bodyIndex: paramIndex });
};

/**
 * @sample @Headers({
 *           "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
 *           "Accept": "application/json"
 *         })
 */
export const Headers = <T extends BaseService>(headers: AxiosRequestHeaders) => {
  return (target: T, methodName: string, descriptor: PropertyDescriptor) => {
    target.__getServiceMetadata().setMetadata(methodName, (prev: MethodMetadata) => ({
      headers: {
        ...prev.headers,
        ...headers,
      },
    }));
  };
};

/** @sample @Header("X-Token") token: string */
export const Header = <T extends BaseService>(paramName: string) => {
  return (target: T, methodName: string, paramIndex: number) => {
    target.__getServiceMetadata().setMetadata(methodName, (prev: MethodMetadata) => ({
      headerParams: {
        ...prev.headerParams,
        [paramIndex]: paramName,
      },
    }));
  };
};

/** @sample @HeaderMap headers: any */
export const HeaderMap = <T extends BaseService>(target: T, methodName: string, paramIndex: number) => {
  target.__getServiceMetadata().setMetadata(methodName, { headerMapIndex: paramIndex });
};

/**
 * @sample @Queries({
 *           page: 1,
 *           size: 20,
 *           sort: "createdAt:desc",
 *         })
 */
export const Queries = <T extends BaseService>(query: QueriesParamType) => {
  return (target: T, methodName: string, descriptor: PropertyDescriptor) => {
    target.__getServiceMetadata().setMetadata(methodName, { query: query });
  };
};

/** @sample @Query('group') group: string */
export const Query = <T extends BaseService>(paramName: string) => {
  return (target: T, methodName: string, paramIndex: number) => {
    target.__getServiceMetadata().setMetadata(methodName, (prev: MethodMetadata) => ({
      queryParams: {
        ...prev.queryParams,
        [paramIndex]: paramName,
      },
    }));
  };
};

/**
 * @sample @QueryMap query: SearchQuery
 */
export const QueryMap = <T extends BaseService>(target: T, methodName: string, paramIndex: number) => {
  target.__getServiceMetadata().setMetadata(methodName, { queryMapIndex: paramIndex });
};

/**
 * 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' will be added.
 * @sample @FormUrlEncoded
 */
export const FormUrlEncoded = <T extends BaseService>(
  target: T,
  methodName: string,
  descriptor: PropertyDescriptor,
) => {
  Headers({ [CONTENT_TYPE_HEADER]: `${CONTENT_TYPE.FORM_URL_ENCODED};${CHARSET_UTF_8}` })(
    target,
    methodName,
    descriptor,
  );
};

/**
 * Set field of form for API endpoint. Only effective when method has been decorated by @FormUrlEncoded.
 * @sample @Field("title") title: string
 */
export const Field = <T extends BaseService>(paramName: string) => {
  return (target: T, methodName: string, paramIndex: number) => {
    target.__getServiceMetadata().setMetadata(methodName, (prev: MethodMetadata) => ({
      fields: {
        ...prev.fields,
        [paramIndex]: paramName,
      },
    }));
  };
};

/**
 * @sample @FieldMap post: Post
 */
export const FieldMap = <T extends BaseService>(target: T, methodName: string, paramIndex: number) => {
  target.__getServiceMetadata().setMetadata(methodName, { fieldMapIndex: paramIndex });
};

/**
 * 'content-type': 'multipart/form-data' will be added to HTTP headers.
 * @sample @Multipart
 */
export const Multipart = <T extends BaseService>(target: T, methodName: string, descriptor: PropertyDescriptor) => {
  Headers({ [CONTENT_TYPE_HEADER]: CONTENT_TYPE.MULTIPART_FORM_DATA })(target, methodName, descriptor);
};

/**
 * Set part of form data for API endpoint. Only effective when method has been decorated by @Multipart.
 * @sample @Part("bucket") bucket: PartDescriptor<string>
 */
export const Part = <T extends BaseService>(paramName: string) => {
  return (target: T, methodName: string, paramIndex: number) => {
    target.__getServiceMetadata().setMetadata(methodName, (old: MethodMetadata) => ({
      parts: {
        ...old.parts,
        [paramIndex]: paramName,
      },
    }));
  };
};

/**
 * Set the response type for method.
 * @sample @ResponseType("stream")
 */
export const ResponseType = <T extends BaseService>(responseType: AxiosResponseType) => {
  return (target: T, methodName: string) => {
    target.__getServiceMetadata().setMetadata(methodName, { responseType: responseType });
  };
};

/**
 * Set request transformer for method.
 * @sample @RequestTransformer((data: any, headers?: any) => {
 *           data.foo = 'foo';
 *           return JSON.stringify(data);
 *         })
 */
export const RequestTransformer = <T extends BaseService, P1 extends DataType>(
  ...transformers: TransformerType<P1>[]
) => {
  return (target: T, methodName: string) => {
    target.__getServiceMetadata().setMetadata(methodName, (prev) => ({
      ...prev,
      requestTransformer: [...transformers, ...prev.requestTransformer],
    }));
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
export const ResponseTransformer = <T extends BaseService, P1 extends DataType | DataType[]>(
  ...transformers: TransformerType<P1>[]
) => {
  return (target: T, methodName: string) => {
    target.__getServiceMetadata().setMetadata(methodName, (prev) => ({
      ...prev,
      responseTransformer: [...transformers, ...prev.responseTransformer],
    }));
  };
};

// public id: number, public userId: number, public title: string, public body: string
// ...args: object[]
export const ConvertTo = <T extends BaseService>(returnClass: new () => void) => {
  return (target: T, methodName: string) => {
    handleConvertTo(target, methodName, returnClass);
  };
};

function handleConvertTo<T extends BaseService>(target: T, methodName: string, returnClass: ResponseConvertTo) {
  target.__getServiceMetadata().setMetadata(methodName, { convertTo: returnClass });
}

/**
 * Set timeout for method, this config will shield service timeout.
 * @sample @Timeout(5000)
 */
export const Timeout = <T extends BaseService>(timeout: number) => {
  return (target: T, methodName: string) => {
    target.__getServiceMetadata().setMetadata(methodName, { timeout: timeout });
  };
};

/**
 * Declare response status code for method, do nothing just a declaration.
 * @sample ResponseStatus(204)
 */
export const ResponseStatus = <T extends BaseService>(responseStatus: number) => {
  return (target: T, methodName: string) => {
    target.__getServiceMetadata().setMetadata(methodName, { responseStatus: responseStatus });
  };
};

/**
 * A direct way to set config for a request in axios.
 * @sample @Config({ maxRedirects: 1 })
 */
export const Config = <T extends BaseService>(config: Partial<AxiosRequestConfig>) => {
  return (target: T, methodName: string) => {
    target.__getServiceMetadata().setMetadata(methodName, { config: config });
  };
};
