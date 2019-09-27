import * as qs from "qs";

class BaseDataResolver {
  public resolve(data: any): any {}
}

class JsonResolver extends BaseDataResolver {
  public resolve(data: any): any {
    return data;
  }
}

class FormUrlencodedResolver extends BaseDataResolver {
  public resolve(data: any): any {
    return qs.stringify(data);
  }
}

const dataResolverMap: Map<string, typeof BaseDataResolver> = new Map<string, typeof BaseDataResolver>();
dataResolverMap.set("application/x-www-form-urlencoded", FormUrlencodedResolver);
dataResolverMap.set("application/json", JsonResolver);

export class DataResolverFactory {
  static createDataResolver(contentType: string): BaseDataResolver {
    const resolverCls = dataResolverMap.get(contentType.toLowerCase()) || JsonResolver;
    return new resolverCls();
  }
}

