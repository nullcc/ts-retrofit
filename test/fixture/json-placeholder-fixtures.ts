import {
    BasePath,
    BaseService,
    GET,
    Path,
    InlinedResponse,
    ApiResponse,
    STUB_RESPONSE,
} from "../../src";
export const JSON_PLACEHOLDER_ENDPOINT = `https://jsonplaceholder.typicode.com`;
export const URL_DOES_NOT_EXIST = `/does-not-exist`;

export interface Todo {
    "userId": number;
    "id": number;
    "title": string;
    "completed": boolean;
}

@BasePath("/todos")
export class TodosService extends BaseService {
    @GET("/")
    public async getAll(): ApiResponse<Todo[]> { return STUB_RESPONSE(); }

    @GET("/{id}")
    public async getSingle(@Path("id") id: number): ApiResponse<Todo> { return STUB_RESPONSE(); }

    @GET(URL_DOES_NOT_EXIST)
    public async getForError(): ApiResponse<never> { return STUB_RESPONSE(); }
}
