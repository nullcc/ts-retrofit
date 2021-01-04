import { AxiosResponse, Method } from "axios";
import { AddressInfo } from "net";

export const JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com";
export const testServerUrl = (address: AddressInfo | string | null) =>
  `http://localhost:${(address as AddressInfo).port}`;

export function verifyRequest<T>(response: AxiosResponse<T>, method: Method, path = "/posts/", status = 200) {
  expect(response.request.method).toBe(method.toUpperCase());
  expect(response.request.path).toBe(path);

  expect(response.status).toEqual(status);
  expect(response.config.method).toEqual(method.toLowerCase());
}

export function verifyBody<T>(
  response: AxiosResponse<T>,
  expectedRequestBody: T,
  expectedResponseBody = expectedRequestBody,
) {
  if (!expectedRequestBody) return;

  expect(response.config.data).toBe(JSON.stringify(expectedRequestBody));
  expect(response.data).toMatchObject(expectedResponseBody);
}

export async function validateThrows<T extends Error = Error, R = unknown>(
  fn: () => Promise<R>,
  catchChecks: (error: T) => void = () => {
    // do nothing
  },
) {
  try {
    await fn();
    fail("Expected exception");
  } catch (e) {
    catchChecks(e as T);
  }
}

// @TODO
describe.skip("TMP", () => {
  test.skip("t", () => {
    return 10;
  });
});

export const testServer = {
  url: "",
};
