import { ApiResponse, BasePath, BaseService, GET, Path, ConvertTo, ApiResponseBody } from "../../src";
import { PostsApiService } from "./fixtures";
import { IsNegative, IsPositive, MinLength } from "class-validator";

export class ValidationPass {
  @IsPositive()
  id!: number;

  @MinLength(1)
  body!: string;

  @IsPositive()
  userId!: number;

  methodInside() {
    return this.id;
  }
}

export class ValidationFailsOneField {
  id!: number;

  @MinLength(100)
  body!: string;

  userId!: number;

  methodInside() {
    return this.id;
  }
}

export class ValidationFailsTwoFields {
  id!: number;

  @MinLength(100)
  body!: string;

  @IsNegative()
  userId!: number;

  methodInside() {
    return this.id;
  }
}

@BasePath(PostsApiService.BASE_PATH)
export class ValidationPassService extends BaseService {
  @GET("/")
  @ConvertTo(ValidationPass)
  getAll(): ApiResponse<ValidationPass[]> {}

  @GET("/{id}")
  @ConvertTo(ValidationPass)
  single(@Path("id") id: number): ApiResponse<ValidationPass> {}
}

@BasePath(PostsApiService.BASE_PATH)
export class ValidationPassServiceInlinedResponse extends BaseService {
  @GET("/")
  @ConvertTo(ValidationPass)
  getAll(): ApiResponseBody<ValidationPass[]> {}

  @GET("/{id}")
  @ConvertTo(ValidationPass)
  single(@Path("id") id: number): ApiResponseBody<ValidationPass> {}
}

@BasePath(PostsApiService.BASE_PATH)
export class ValidationFailService extends BaseService {
  @GET("/not-found2222", { ignoreBasePath: true, convertTo: ValidationFailsOneField })
  wrongUrlAndOneField(): ApiResponse<ValidationFailsOneField[]> {}

  @GET("/")
  @ConvertTo(ValidationFailsOneField)
  array(): ApiResponse<ValidationFailsOneField[]> {}

  @GET("/")
  @ConvertTo(ValidationFailsTwoFields)
  arrayTwoFields(): ApiResponse<ValidationFailsTwoFields[]> {}

  @GET("/{id}")
  @ConvertTo(ValidationFailsOneField)
  singleOneField(@Path("id") id: number): ApiResponse<ValidationFailsOneField> {}

  @GET("/{id}")
  @ConvertTo(ValidationFailsTwoFields)
  singleTwoFields(@Path("id") id: number): ApiResponse<ValidationFailsTwoFields> {}
}

@BasePath(PostsApiService.BASE_PATH)
export class ValidationFailServiceInlinedBody extends BaseService {
  @GET("/")
  @ConvertTo(ValidationFailsOneField)
  array(): ApiResponseBody<ValidationFailsOneField[]> {}

  @GET("/")
  @ConvertTo(ValidationFailsTwoFields)
  arrayTwoFields(): ApiResponseBody<ValidationFailsTwoFields[]> {}

  @GET("/{id}")
  @ConvertTo(ValidationFailsOneField)
  singleOneField(@Path("id") id: number): ApiResponseBody<ValidationFailsOneField> {}

  @GET("/{id}")
  @ConvertTo(ValidationFailsTwoFields)
  singleTwoFields(@Path("id") id: number): ApiResponseBody<ValidationFailsTwoFields> {}
}
