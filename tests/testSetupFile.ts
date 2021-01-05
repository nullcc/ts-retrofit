import "reflect-metadata";
import http from "http";
import { app } from "./fixture/server";
import { testServer, testServerUrl } from "./testHelpers";

jest.setTimeout(60000);

let server: http.Server;

beforeAll(() => {
  server = app.listen(0);
  testServer.url = testServerUrl(server.address());
});

afterAll(() => {
  server.close();
});
