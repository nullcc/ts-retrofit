const registerMethod = (method: string, url: string) => {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    if (!target['$meta']) {
      target['$meta'] = {};
    }
    if (!target['$meta'][methodName]) {
      target['$meta'][methodName] = {};
    }
    target['$meta'][methodName].method = method;
    target['$meta'][methodName].path = url;
  }
};

export const GET = (url: string) => {
  return registerMethod('GET', url);
};

export const POST = (url: string) => {
  return registerMethod('POST', url);
};

export const PUT = (url: string) => {
  return registerMethod('PUT', url);
};

export const PATCH = (url: string) => {
  return registerMethod('PATCH', url);
};

export const DELETE = (url: string) => {
  return registerMethod('DELETE', url);
};

export const HEAD = (url: string) => {
  return registerMethod('HEAD', url);
};
