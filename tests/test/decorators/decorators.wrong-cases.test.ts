import { ServiceBuilder } from "../../../src/service.builder";
import { testServer, verifyRequest } from "../../testHelpers";
import {
  NoHttpMethodService,
  WrongFieldService,
  WrongHeaderService,
  WrongMultipartService,
  WrongQueryService,
} from "../../fixture/fixtures.wrong-cases";
import { ErrorMessages } from "../../../src";
import { Post, posts } from "../../fixture/fixtures";

describe("Decorators - wrong cases", () => {
  describe("Headers", () => {
    const service = new ServiceBuilder().baseUrl(testServer.url).build(WrongHeaderService);

    describe("@HeaderMap", () => {
      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongHeaderMap({
            "": "hello",
          });
        }, ErrorMessages.EMPTY_HEADER_KEY);
      });

      test("Wrong child property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongHeaderMap({
            H1: "hello",
            H2: {
              I1: "asd",
            },
          });
        }, ErrorMessages.WRONG_HEADERS_PROPERTY_TYPE);
      });
    });

    describe("@Header", () => {
      test("Wrong property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongHeaderType({
            a: "1",
            b: 2,
          });
        }, ErrorMessages.WRONG_HEADER_TYPE);
      });

      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.emptyHeaderKey("");
        }, ErrorMessages.EMPTY_HEADER_KEY);
      });
    });
  });

  describe("Fields", () => {
    const service = new ServiceBuilder().baseUrl(testServer.url).build(WrongFieldService);

    describe("@FieldMap", () => {
      test("Empty field key", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongFieldMap({
            "": "hello",
          });
        }, ErrorMessages.EMPTY_FIELD_KEY);
      });
    });

    describe("@Field", () => {
      test("Empty field key", async () => {
        await verifyErrorThrown(async () => {
          await service.emptyFieldKey("");
        }, ErrorMessages.EMPTY_FIELD_KEY);
      });
    });
  });

  describe("Multipart", () => {
    const service = new ServiceBuilder().baseUrl(testServer.url).build(WrongMultipartService);

    test("Empty part key", async () => {
      const bucket = {
        value: "test-bucket",
      };
      await verifyErrorThrown(async () => {
        await service.emptyPartKey(bucket);
      }, ErrorMessages.EMPTY_PART_KEY);
    });
  });

  describe("Query params", () => {
    const service = new ServiceBuilder().baseUrl(testServer.url).build(WrongQueryService);

    describe("@QueryMap", () => {
      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongQueryMap({
            "": "hello",
          });
        }, ErrorMessages.EMPTY_QUERY_KEY);
      });

      test("Wrong @QueryMap property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongQueryMap({
            H1: "hello",
            H2: {
              I1: "asd",
            },
          });
        }, ErrorMessages.WRONG_QUERY_MAP_PROPERTY_TYPE);
      });
    });

    describe("@Query", () => {
      test("Wrong property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongQuery({
            a: "1",
            b: 2,
          });
        }, ErrorMessages.WRONG_QUERY_TYPE);
      });

      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.emptyQueryKey("");
        }, ErrorMessages.EMPTY_QUERY_KEY);
      });
    });
  });

  describe("No Http decorator", () => {
    const noHttpMethodService = new ServiceBuilder().baseUrl(testServer.url).build(NoHttpMethodService);

    describe("Works fine with not decorated methods", () => {
      test("No params", async () => {
        expect(await noHttpMethodService.validMethodNoParams()).toBe(100);
      });
      test("1 param", async () => {
        expect(await noHttpMethodService.validMethodWithOneParam("abc")).toBe("abc");
      });

      test("2 params", async () => {
        expect(await noHttpMethodService.validMethodWithTwoParams("abc", "cba")).toBe("abccba");
      });
    });

    test("With @Path", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.path(1);
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Headers", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.headers();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Queries", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.queries();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @FormUrlEncoded", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.formUrlEncoded();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Field", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.field(12);
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @ResponseStatus", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.responseStatus();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Config", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.config();
      }, ErrorMessages.NO_HTTP_METHOD);
    });
  });

  test("__getLastRequest - empty", async () => {
    const anyService = new ServiceBuilder().baseUrl(testServer.url).build(NoHttpMethodService);
    await verifyErrorThrown(async () => {
      await anyService.__getLastRequest();
    }, ErrorMessages.__TEST_NO_REQUESTS_IN_HISTORY);
  });

  async function verifyErrorThrown(exec: () => void, err?: string) {
    try {
      await exec();
    } catch (e) {
      expect(e.message).toBe(err);
      return;
    }

    fail("No error");
  }
});
