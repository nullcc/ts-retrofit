# ts-retrofit

A retrofit implementation in TypeScript.


## Usages

```typescript
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  HEAD,
  BasePath,
  Header,
  Headers,
  PathParam,
  QueryMap,
  Body,
  BaseService,
} from 'ts-retrofit';
import { AxiosResponse } from 'axios';
const TEST_SERVER_HOST = 'http://localhost';
const TEST_SERVER_PORT = 8080;
export const TEST_SERVER_ENDPOINT = `${TEST_SERVER_HOST}:${TEST_SERVER_PORT}`;
export const API_PREFIX = 'api/v1';

export interface User {
  id?: number;
  name: string;
  age: number;
  [x: string]: any;
}

export interface SearchQuery {
  title?: string;
  author?: string;
  category?: string;
}

@BasePath(API_PREFIX)
export class UserService extends BaseService {
  @GET('users')
  @Headers('X-A', 'abc')
  async getUsers(@Header('X-Token') token: string): Promise<AxiosResponse> { return <AxiosResponse> {} };

  @POST('users')
  async createUser(@Body user: User): Promise<AxiosResponse> { return <AxiosResponse> {} };

  @PUT('users/{userId}')
  async replaceUser(@PathParam('userId') userId: number, @Body user: User): Promise<AxiosResponse> { return <AxiosResponse> {} };

  @PATCH('users/{userId}')
  async updateUser(@PathParam('userId') userId: number, @Body user: Partial<User>): Promise<AxiosResponse> { return <AxiosResponse> {} };

  @DELETE('users/{userId}')
  async deleteUser(@PathParam('userId') userId: number): Promise<AxiosResponse> { return <AxiosResponse> {} };

  @HEAD('users/{userId}')
  async headUser(@PathParam('userId') userId: number): Promise<AxiosResponse> { return <AxiosResponse> {} };
}

@BasePath(API_PREFIX)
export class SearchService extends BaseService {
  @GET('search')
  async search(@QueryMap query: SearchQuery): Promise<AxiosResponse> { return <AxiosResponse> {} };
}

(async () => {
  const testService = new ServiceBuilder()
    .setEndpoint(TEST_SERVER_ENDPOINT)
    .build(UserService);
  const token = '123456abcdef';
  let response = await testService.getUsers(token);
})()
```

