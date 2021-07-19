<h1>ts-retrofit 2</h1>

<p>
    <strong>Declarative and type-safe HTTP client for Node.js and Web</strong>
</p>

<p>
    <a href="https://travis-ci.com/npwork/ts-retrofit2"><img alt="build status" src="https://travis-ci.com/npwork/ts-retrofit2.svg?branch=master"></a>
    <a href="./package.json"><img alt="github package" src="https://img.shields.io/github/package-json/v/npwork/ts-retrofit2"></a>
    <a href="https://www.npmjs.com/package/ts-retrofit2"><img alt="npm package" src="https://img.shields.io/npm/v/ts-retrofit2"></a>
    <a href="https://www.npmjs.com/package/ts-retrofit2"><img alt="npm downloads" src="https://img.shields.io/npm/dt/ts-retrofit2"></a>
    <a href="./LICENSE.txt"><img alt="license" src="https://img.shields.io/github/license/npwork/ts-retrofit2"></a>
</p>

### Test coverage

| Statements                  | Branches                | Functions                 | Lines                |
| --------------------------- | ----------------------- | ------------------------- | -------------------- |
| ![Statements](https://img.shields.io/badge/statements-96.15%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/branches-89.08%25-yellow.svg) | ![Functions](https://img.shields.io/badge/functions-94.22%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/lines-97.59%25-brightgreen.svg)    |



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
  listRepos(@Path("user") user: string): ApiResponse<Repo[]> {}
}
```

Build a service:

```typescript
const service = new ServiceBuilder()
  .baseUrl("https://api.github.com/")
  .build(GitHubService);

const repose = await service.listRepos("octocat");
```

Use decorators to describe the HTTP request.

### Inlined response body
If you need only response body you can inline it
```typescript
export class GitHubService extends BaseService {
  @GET("/users/{user}/repos")
  listReposWithInlinedBody(@Path("user") user: string): ApiResponseBody<Repo[]> {}
}
```

```typescript
const service = new ServiceBuilder()
  .baseUrl("https://api.github.com/")
  .inlineResponseBody()
  .build(GitHubService);

const repose = await service.listRepos("octocat");
```

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
groupList(@Path("id") groupId: string): ApiResponse<User[]> {}
```

Query parameters can also be added using `@Query`.

```typescript
@GET("group/{id}/users")
groupList(@Path("id") groupId: string, @Query("sort") sort: string): ApiResponse<User[]> {}
```

For complex query parameter can be added using `@QueryMap`. It should be object with primitive properties.

```typescript
@GET("group/{id}/users")
groupList(@Path("id") groupId: string, @QueryMap query: SearchQuery): ApiResponse<User[]> {}
```

### REQUEST BODY
```typescript
@POST("users/new")
groupList(@Body user: User): ApiResponse<User> {}
```

### FORM ENCODED AND MULTIPART
```typescript
@POST("/user/edit")
@FormUrlEncoded
formUrlEncoded(
  @Field("first_name") first: string,
  @Field("last_name") last: string,
): ApiResponse<User> {}
```

Multipart requests are used when @Multipart is present on the method. Parts are declared using the @Part decorator.
```typescript
@PUT("user/photo")
@Multipart
updateUser(
  @Part("description") description: PartDescriptor<string>,
  @Part("photo") file: PartDescriptor<Buffer>,
): ApiResponse<User> {}
```

### HEADER MANIPULATION
You can set static headers for a method using the @Headers decorator.

```typescript
@GET("widget/list")
@Headers({
  "Cache-Control": "max-age=640000",
})
widgetList(): ApiResponse<Widget> {}
```
```typescript
@GET("users/{username}")
@Headers({
  "Accept": "application/vnd.github.v3.full+json",
  "User-Agent": "Retrofit-Sample-App"
})
getUser(@Path("username") username: string): ApiResponse<Widget> {}
```

A request Header can be updated dynamically using the `@Header` decorator. A corresponding parameter must be provided to the @Header. If the value is null, the header will be omitted. Otherwise, toString will be called on the value, and the result used.

```typescript
@GET("user")
getUser(@Header("Authorization") authorization: string): ApiResponse<User> {}
```
Similar to query parameters, for complex header combinations, a `@HeaderMap` can be used.

```typescript
@GET("user")
getUser(@HeaderMap headers: MyHeaders): ApiResponse<User> {}
```
Headers that need to be added to every request can be specified using an interceptor.

