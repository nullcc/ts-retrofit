import { CONTENT_TYPE, CONTENT_TYPE_HEADER, MethodMetadata } from "./constants";
import { BaseService } from "./baseService";

export class ServiceMetaData<T extends BaseService> {
  public methodMetadata: Map<string, MethodMetadata> = new Map();
  public basePath?: string;

  setMetadata(
    method: string,
    valueOrFn: Partial<MethodMetadata> | ((oldValue: MethodMetadata) => Partial<MethodMetadata>),
  ) {
    const oldValue = this.getMetaOrSetEmptyObject(method);

    if (typeof valueOrFn === "function") {
      this.methodMetadata.set(method, { ...oldValue, ...valueOrFn(oldValue) });
    } else {
      this.methodMetadata.set(method, { ...oldValue, ...valueOrFn });
    }
  }

  getMetadata(method: string): MethodMetadata;
  getMetadata(method: keyof T): MethodMetadata;
  getMetadata(method: string | keyof T): MethodMetadata {
    const metadata = this.methodMetadata.get(method as string);
    if (!metadata) throw new Error(`Method ${method} does not exist`);
    return metadata;
  }

  private getMetaOrSetEmptyObject(method: string): MethodMetadata {
    const meta = this.methodMetadata.get(method);
    if (meta) return meta;

    const initial: MethodMetadata = {
      query: {},
      fields: {},
      queryParams: {},
      parts: {},
      headers: {
        [CONTENT_TYPE_HEADER]: CONTENT_TYPE.APPLICATION_JSON,
      },
      pathParams: {},
      headerParams: {},
      requestTransformer: [],
      responseTransformer: [],
    };

    this.methodMetadata.set(method, initial);
    return initial;
  }
}
