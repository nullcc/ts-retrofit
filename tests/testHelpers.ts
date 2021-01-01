import { Response } from "../src";
import { Method } from "axios";
import { AddressInfo } from "net";

export const JSONPLACEHOLDER_URL = "https://jsonplaceholder.typicode.com";
export const testServerUrl = (address: AddressInfo | string | null) =>
  `http://localhost:${(address as AddressInfo).port}`;

export function verifyRequest<T>(response: Response, method: Method, path: string = "/posts/", status = 200) {
  expect(response.request.method).toBe(method.toUpperCase());
  expect(response.request.path).toBe(path);

  expect(response.status).toEqual(status);
  expect(response.config.method).toEqual(method.toLowerCase());
}

export function verifyBody<T>(response: Response, expectedRequestBody: T, expectedResponseBody = expectedRequestBody) {
  if (!expectedRequestBody) return;

  expect(response.config.data).toBe(JSON.stringify(expectedRequestBody));
  expect(response.data).toMatchObject(expectedResponseBody);
}

// @TODO
describe.skip("TMP", () => {
  test.skip("t", () => {});
});

export let testServer = {
  url: "",
};
