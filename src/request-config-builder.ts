import { DataType, HttpMethod, MethodMetadata, QueriesParamType } from "./constants";
import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponseHeaders } from "axios";
import { DataResolverFactory } from "./dataResolver";
import { ServiceBuilder } from "./service.builder";

export function makeConfig(
  metadata: MethodMetadata,
  serviceBuilder: ServiceBuilder,
  methodName: string,
  url: string,
  method: HttpMethod,
  headers: AxiosRequestHeaders,
  query: QueriesParamType,
  data: unknown,
): AxiosRequestConfig {
  let config: AxiosRequestConfig = {
    url,
    method,
    headers,
    params: query,
    data,
  };
  // response type
  if (metadata.responseType) {
    config.responseType = metadata.responseType;
  }

  const logger = getLoggerAfterTransformer(config, serviceBuilder);

  // request transformer
  const transformRequest = [];

  if (metadata.requestTransformer.length > 0) {
    transformRequest.push(...metadata.requestTransformer);
  }

  if (logger) transformRequest.push(logger);

  if (transformRequest.length > 0) {
    config.transformRequest = [
      ...transformRequest,
      (data: DataType) => {
        // @TODO what if not json ??? response content type?
        if (typeof data === "string") return data;
        else return JSON.stringify(data);
      },
    ];
  }

  // response transformer
  if (metadata.responseTransformer.length > 0) {
    config.transformResponse = [
      (body: string, headers?: AxiosResponseHeaders) => {
        return DataResolverFactory.createDataResolver(headers || {}).resolve(headers || {}, body);
      },
      ...metadata.responseTransformer,
    ];
  }

  // timeout
  config.timeout = metadata.timeout || serviceBuilder.timeout;

  // mix in config set by @Config
  config = {
    ...config,
    ...metadata.config,
  };
  return config;
}

function getLoggerAfterTransformer(config: AxiosRequestConfig, serviceBuilder: ServiceBuilder) {
  const loggerOptions = serviceBuilder.loggerOptions;
  if (!loggerOptions.showLogs) return undefined;

  const logLevelFn = loggerOptions.logLevel === "DEBUG" ? console.debug : console.log;

  const urlAndMethod = `[${config.method?.toUpperCase()}] ${config.url}`;

  return (data: string) => {
    let dataRow = "";
    if (Object.keys(config.data).length !== 0) {
      logLevelFn(urlAndMethod);
      if (typeof data === "object" || Array.isArray(data)) {
        dataRow += "\n" + JSON.stringify(data);
      } else {
        dataRow += "\n" + data;
      }
    }

    logLevelFn(`${urlAndMethod}${dataRow}`);
    return data;
  };
}
