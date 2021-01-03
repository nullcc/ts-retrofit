import { STUB_RESPONSE } from "../../src";

describe("Utils", () => {
  test("STUB_RESPONSE", () => {
    const s = STUB_RESPONSE<unknown>();
    expect(s).toStrictEqual({});
  });
});
