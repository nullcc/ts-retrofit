import * as fs from "fs";
import {
  BaseDataResolver,
  FormUrlencodedResolver,
  MultiPartResolver,
  JsonResolver,
  TextXmlResolver,
  DataResolverFactory,
} from "../src/dataResolver";

describe("Test data resolver.", () => {
  test("Test BaseDataResolver.", async () => {
    const baseDataResolver = new BaseDataResolver();
    const t = () => {
      baseDataResolver.resolve({}, {});
    };
    expect(t).toThrowError("Can not call this method in BaseDataResolver.");
  });

  test("Test FormUrlencodedResolver with flat object.", async () => {
    const formUrlencodedResolver = new FormUrlencodedResolver();
    const headers = {
      "content-type": "application/x-www-form-urlencoded",
    };
    const obj = {
      foo: 'bar',
    };
    const data = Object.create(obj);
    data.a = 1;
    data.b = "hello";
    data.c = true;
    data.d = null;
    const resolvedData = formUrlencodedResolver.resolve(headers, data);
    expect(resolvedData).toEqual("a=1&b=hello&c=true&d=null");
  });

  test("Test FormUrlencodedResolver with nested object.", async () => {
    const formUrlencodedResolver = new FormUrlencodedResolver();
    const headers = {
      "content-type": "application/x-www-form-urlencoded",
    };
    const data = {
      a: 1,
      b: "hello",
      c: true,
      d: null,
      e: ["foo", "bar"],
    };
    const resolvedData = formUrlencodedResolver.resolve(headers, data);
    expect(resolvedData).toEqual("a=1&b=hello&c=true&d=null&e=%5B%22foo%22%2C%22bar%22%5D");
  });

  test("Test MultiPartResolver.", async () => {
    const multiPartResolver = new MultiPartResolver();
    const headers = {
      "content-type": "multipart/form-data",
    };
    const bucket = {
      value: "test-bucket",
    };
    const file = {
      value: fs.readFileSync("test/fixture/pic.png"),
      filename: "pic.png",
    };
    const data = {
      bucket,
      file,
    };
    const resolvedData = multiPartResolver.resolve(headers, data);
    expect(resolvedData._streams).toContain("test-bucket");
  });

  test("Test JsonResolver.", async () => {
    const jsonResolver = new JsonResolver();
    const headers = {
      "content-type": "application/json",
    };
    const data = {
      a: 1,
      b: "b",
      c: true,
      d: null,
      e: [1,2,3],
      f: {
        f1: 1,
        f2: ["a", "b", "c"],
      },
    };
    const resolvedData = jsonResolver.resolve(headers, data);
    expect(resolvedData).toStrictEqual(resolvedData);
  });

  test("Test TextXmlResolver.", async () => {
    const textXmlResolver = new TextXmlResolver();
    const headers = {
      "content-type": "text/xml",
    };
    const xmlString = `
      <?xml version="1.0" encoding="UTF-8"?>
      <message>
        <receiver>foo@foo.com</receiver>
        <sender>bar@bar.com</sender>
        <title>Hello</title>
        <content>Hello world!</content>
      </message>`;
    const resolvedData = textXmlResolver.resolve(headers, xmlString);
    expect(resolvedData).toStrictEqual(xmlString);
  });

  test("Test DataResolverFactory.", async () => {
    const dataResolverFactory = new DataResolverFactory();
    const dataResolver = dataResolverFactory.createDataResolver('application/user-defined-content-type');
    expect(dataResolver instanceof JsonResolver).toBeTruthy();
  });
});
