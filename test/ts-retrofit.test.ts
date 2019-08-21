import * as http from 'http';
import { app } from './server';
import { TEST_SERVER_ENDPOINT, API_PREFIX, UserService, SearchService, User, SearchQuery } from './fixtures';
import { ServiceBuilder } from '../src';

describe('Test ts-retrofit.', () => {

  let testServer: http.Server;

  beforeAll(() => {
    testServer = app.listen(8080);
  });

  afterAll(() => {
    testServer.close();
  });

  test('Should use GET method.', async () => {
    const testService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const token = '123456abcdef';
    let response = await testService.getUsers(token);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/${API_PREFIX}/users`);
    expect(response.config.method).toEqual('get');
    expect(response.config.headers['X-A']).toEqual('abc');
    expect(response.config.headers['X-Token']).toEqual(token);
  });

  test('Should use POST method.', async () => {
    const testService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const newUser: User = {
      name: 'Jane',
      age: 18
    };
    const response = await testService.createUser(newUser);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/${API_PREFIX}/users`);
    expect(response.config.method).toEqual('post');
    expect(response.config.data).toEqual(JSON.stringify(newUser));
  });

  test('Should use PUT method.', async () => {
    const testService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const name = 'Johnny';
    const age = 21;
    const country = 'US';
    const user = { name, age, country };
    let response = await testService.replaceUser(userId, user);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/${API_PREFIX}/users/${userId}`);
    expect(response.config.method).toEqual('put');
    expect(response.config.data).toEqual(JSON.stringify(user));
  });

  test('Should use PATCH method.', async () => {
    const testService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    const age = 21;
    const user = { age };
    let response = await testService.updateUser(userId, user);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/${API_PREFIX}/users/${userId}`);
    expect(response.config.method).toEqual('patch');
    expect(response.config.data).toEqual(JSON.stringify(user));
  });

  test('Should use DELETE method.', async () => {
    const testService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    let response = await testService.deleteUser(userId);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/${API_PREFIX}/users/${userId}`);
    expect(response.config.method).toEqual('delete');
  });

  test('Should use HEAD method.', async () => {
    const testService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(UserService);
    const userId = 1;
    let response = await testService.headUser(userId);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/${API_PREFIX}/users/${userId}`);
    expect(response.config.method).toEqual('head');
  });

  test('Should contain query.', async () => {
    const searchService = new ServiceBuilder()
      .setEndpoint(TEST_SERVER_ENDPOINT)
      .build(SearchService);
    const query = {
      title: 'TypeScript',
      author: 'John Doe',
    };
    let response = await searchService.search(query);
    expect(response.config.url).toEqual(`${TEST_SERVER_ENDPOINT}/${API_PREFIX}/search`);
    expect(response.config.params).toMatchObject(query);
    expect(response.config.method).toEqual('get');
  });
});
