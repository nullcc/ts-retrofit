<h1>ts-retrofit 2</h1>

<p>
    <strong>Declarative and type-safe HTTP client for Node.js and Web</strong>
</p>

<p>
    <a href="https://travis-ci.com/npwork/ts-retrofit2"><img alt="build status" src="https://travis-ci.com/npwork/ts-retrofit2.svg?branch=master"></a>
    <a href="./package.json"><img alt="github package" src="https://img.shields.io/github/package-json/v/npwork/ts-retrofit2"></a>
    <a href="https://www.npmjs.com/package/ts-retrofit2"><img alt="npm package" src="https://img.shields.io/npm/v/ts-retrofit2"></a>
    <a href="https://www.npmjs.com/package/retroxios"><img alt="npm downloads" src="https://img.shields.io/npm/dt/ts-retrofit2"></a>
    <a href="./LICENSE.txt"><img alt="license" src="https://img.shields.io/github/license/tnychn/retroxios"></a>
</p>

### Test coverage

| Statements                  | Branches                | Functions                 | Lines                |
| --------------------------- | ----------------------- | ------------------------- | -------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-99.77%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-99.15%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-99.17%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)    |



## Installing

Using npm:

```bash
$ npm install ts-retrofit2
```

Using yarn:

```bash
$ yarn add ts-retrofit2
```

## Introduction
Automatically turn your decorated methods into axios HTTP requests.

```typescript
export class GitHubService extends BaseService {
  @GET("/users/{user}/repos")
  async listRepos(@Path("user") user: string): Promise<Repo[]> {
    return STUB_RESPONSE();
  }
}
```

Build a service:

```typescript
const service = new ServiceBuilder()
  .baseUrl("https://api.github.com/")
  .inlineResponseBody()
  .build(GitHubService);

const repose = await service.listRepos("octocat");
```
Use decorators to describe the HTTP request.

## API Declaration
Decorators on the methods and its parameters indicate how a request will be handled.

### REQUEST METHOD
Every method must have an HTTP decorator that provides the request method and relative URL. There are built-in decorators: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` and `HEAD`. The relative URL of the resource is specified in the decorator param.

```typescript
@GET("users/list")
```
You can also specify query parameters in the URL.
```typescript
@GET("users/list?sort=desc")
```
### URL MANIPULATION
A request URL can be updated dynamically using replacement blocks and parameters on the method. A replacement block is an alphanumeric string surrounded by { and }. A corresponding parameter must be decorated with `@Path` using the same string.
```typescript
@GET("group/{id}/users")
async groupList(@Path("id") groupId: string): Promise<User[]> {
  return STUB_RESPONSE();
}
```

Query parameters can also be added using `@Query`.

```typescript
@GET("group/{id}/users")
async groupList(@Path("id") groupId: string, @Query("sort") sort: string): Promise<User[]> {
  return STUB_RESPONSE();
}
```

For complex query parameter can be added using `@QueryMap`. It should be object with primitive properties.

```typescript
@GET("group/{id}/users")
async groupList(@Path("id") groupId: string, @QueryMap query: SearchQuery): Promise<User[]> {
  return STUB_RESPONSE();
}
```

### REQUEST BODY
```typescript
@POST("users/new")
async groupList(@Body user: User): Promise<User> {
  return STUB_RESPONSE();
}
```

### FORM ENCODED AND MULTIPART
```typescript
@POST("/user/edit")
@FormUrlEncoded
async formUrlEncoded(
  @Field("first_name") first: string,
  @Field("last_name") last: string,
): Promise<User> {
  return STUB_RESPONSE();
}
```

Multipart requests are used when @Multipart is present on the method. Parts are declared using the @Part decorator.
```typescript
@PUT("user/photo")
@Multipart
async updateUser(
  @Part("description") description: PartDescriptor<string>,
  @Part("photo") file: PartDescriptor<Buffer>,
): Promise<User> {
return STUB_RESPONSE();
}
```

### HEADER MANIPULATION
You can set static headers for a method using the @Headers decorator.

```typescript
@GET("widget/list")
@Headers({
  "Cache-Control": "max-age=640000",
})
async widgetList(): Promise<Widget> {
  return STUB_RESPONSE();
}
```
```typescript
@GET("users/{username}")
@Headers({
  "Accept": "application/vnd.github.v3.full+json",
  "User-Agent": "Retrofit-Sample-App"
})
async getUser(@Path("username") username: string): Promise<Widget> {
  return STUB_RESPONSE();
}
```

A request Header can be updated dynamically using the `@Header` decorator. A corresponding parameter must be provided to the @Header. If the value is null, the header will be omitted. Otherwise, toString will be called on the value, and the result used.

```typescript
@GET("user")
async getUser(@Header("Authorization") authorization: string): Promise<User> {
  return STUB_RESPONSE();
}
```
Similar to query parameters, for complex header combinations, a `@HeaderMap` can be used.

```typescript
@GET("user")
async getUser(@HeaderMap headers: MyHeaders): Promise<User> {
  return STUB_RESPONSE();
}
```
Headers that need to be added to every request can be specified using an interceptor.

