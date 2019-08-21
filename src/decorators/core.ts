export const BasePath = (path: string) => {
  return (target: Function) => {
    if (!target.prototype.$meta) {
      target.prototype.$meta = {};
    }
    target.prototype.$meta.basePath = path;
  };
};

export const PathParam = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    if (!target['$meta']) {
      target['$meta'] = {};
    }
    if (!target['$meta'][methodName]) {
      target['$meta'][methodName] = {};
    }
    if (!target['$meta'][methodName].pathParams) {
      target['$meta'][methodName].pathParams = {};
    }
    target['$meta'][methodName].pathParams[paramIndex] = paramName;
  }
};

export const QueryMap = (target: any, methodName: string, paramIndex: number) => {
  if (!target['$meta']) {
    target['$meta'] = {};
  }
  if (!target['$meta'][methodName]) {
    target['$meta'][methodName] = {};
  }
  if (!target['$meta'][methodName].pathParams) {
    target['$meta'][methodName].queryMap = null;
  }
  target['$meta'][methodName].queryMap = paramIndex;
};

export const Body = (target: any, methodName: string, paramIndex: number) => {
  if (!target['$meta']) {
    target['$meta'] = {};
  }
  if (!target['$meta'][methodName]) {
    target['$meta'][methodName] = {};
  }
  if (!target['$meta'][methodName].pathParams) {
    target['$meta'][methodName].body = null;
  }
  target['$meta'][methodName].body = paramIndex;
};

export const Headers = (key: string, value: string) => {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    if (!target['$meta']) {
      target['$meta'] = {};
    }
    if (!target['$meta'][methodName]) {
      target['$meta'][methodName] = {};
    }
    if (!target['$meta'][methodName].headers) {
      target['$meta'][methodName].headers = {};
    }
    target['$meta'][methodName].headers[key] = value;
  }
};

export const Header = (paramName: string) => {
  return (target: any, methodName: string, paramIndex: number) => {
    if (!target['$meta']) {
      target['$meta'] = {};
    }
    if (!target['$meta'][methodName]) {
      target['$meta'][methodName] = {};
    }
    if (!target['$meta'][methodName].pathParams) {
      target['$meta'][methodName].headerParams = {};
    }
    target['$meta'][methodName].headerParams[paramIndex] = paramName;
  }
};
