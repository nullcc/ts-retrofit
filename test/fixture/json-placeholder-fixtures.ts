import {
    BasePath,
    BaseService,
    GET,
    Path,
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
    public async getAll(): Promise<Todo[]> { return STUB_RESPONSE(); }

    @GET("/{id}")
    public async getSingle(@Path("id") id: number): Promise<Todo> { return STUB_RESPONSE(); }

    @GET(URL_DOES_NOT_EXIST)
    public async getForError(): Promise<never> { return STUB_RESPONSE(); }
}
