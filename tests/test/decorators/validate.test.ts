import { ServiceBuilder, ValidationErrors } from "../../../src";
import { testServer } from "../../testHelpers";
import {
  ValidationFailService,
  ValidationFailServiceInlinedBody,
  ValidationPassService,
  ValidationPassServiceInlinedResponse,
} from "../../fixture/fixtures.validate";
import { posts } from "../../fixture/fixtures";

describe("Validate", () => {
  describe("Pass", () => {
    describe("Raw response", () => {
      let service: ValidationPassService;

      beforeAll(() => {
        service = new ServiceBuilder().baseUrl(testServer.url).validateResponse().build(ValidationPassService);
      });

      test("Get all", async () => {
        const result = await service.getAll();
        expect(result.data).toHaveLength(2);
        expect(result.data[0].id).toBe(1);
        expect(result.data[1].id).toBe(2);
      });

      test("Get single", async () => {
        const result = await service.single(1);
        expect(result.data.id).toBe(1);
      });
    });

    describe("Inlined response", () => {
      let service: ValidationPassServiceInlinedResponse;

      beforeAll(() => {
        service = new ServiceBuilder()
          .baseUrl(testServer.url)
          .inlineResponseBody()
          .validateResponse()
          .build(ValidationPassServiceInlinedResponse);
      });

      test("Get all", async () => {
        const result = await service.getAll();
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
      });

      test("Get single", async () => {
        const result = await service.single(1);
        expect(result.id).toBe(1);
      });
    });
  });

  describe("Fail", () => {
    describe("Raw response", () => {
      let service: ValidationFailService;

      beforeAll(() => {
        service = new ServiceBuilder().baseUrl(testServer.url).validateResponse().build(ValidationFailService);
      });

      test.each([
        ["Array", "1 field", validateSingleFieldInArray],
        ["Array", "2 fields", validateTwoFieldsInArray],
        ["Single", "1 field", validateSingleFieldIsInvalid],
        ["Single", "2 fields", validateTwoFieldAreInvalid],
      ])(
        "[%s] - %s",
        async (
          msg1: string,
          msg2: string,
          fn: (s: ValidationFailServiceInlinedBody | ValidationFailService) => void,
        ) => {
          await fn(service);
        },
      );
    });

    describe("Inlined body", () => {
      let service: ValidationFailServiceInlinedBody;

      beforeAll(() => {
        service = new ServiceBuilder()
          .baseUrl(testServer.url)
          .inlineResponseBody()
          .validateResponse()
          .build(ValidationFailServiceInlinedBody);
      });

      test.each([
        ["Array", "1 field", validateSingleFieldInArray],
        ["Array", "2 fields", validateTwoFieldsInArray],
        ["Single", "1 field", validateSingleFieldIsInvalid],
        ["Single", "2 fields", validateTwoFieldAreInvalid],
      ])(
        "[%s] - %s",
        async (
          msg1: string,
          msg2: string,
          fn: (s: ValidationFailServiceInlinedBody | ValidationFailService) => void,
        ) => {
          await fn(service);
        },
      );
    });

    async function validateTwoFieldsInArray(service: ValidationFailServiceInlinedBody | ValidationFailService) {
      await validateThrowsValidationErrors(service.arrayTwoFields, (er) => {
        validateErrorsByTwoFields(posts.length, er, posts.length * 2);
      });
    }

    function validateErrorsByTwoFields(len: number, er: ValidationErrors, expectedLength = len) {
      expect(er.errors).toHaveLength(expectedLength);

      for (let i = 0; i < len - 1; i += 2) {
        expect(er.errors[i].property).toBe("body");
        expect(er.errors[i + 1].property).toBe("userId");
      }
    }

    async function validateSingleFieldInArray(service: ValidationFailServiceInlinedBody | ValidationFailService) {
      await validateThrowsValidationErrors(service.array, (er) => {
        expect(er.errors).toHaveLength(posts.length);
        er.errors.forEach((o) => {
          expect(o.property).toBe("body");
        });
      });
    }

    async function validateSingleFieldIsInvalid(service: ValidationFailServiceInlinedBody | ValidationFailService) {
      await validateThrowsValidationErrors(
        () => service.singleOneField(1),
        (er) => {
          expect(er.errors).toHaveLength(1);
          er.errors.forEach((o) => {
            expect(o.property).toBe("body");
          });
        },
      );
    }

    async function validateTwoFieldAreInvalid(service: ValidationFailServiceInlinedBody | ValidationFailService) {
      await validateThrowsValidationErrors(
        () => service.singleTwoFields(1),
        (er) => {
          validateErrorsByTwoFields(posts.length, er);
        },
      );
    }

    async function validateThrowsValidationErrors(fn: () => void, catchChecks: (errors: ValidationErrors) => void) {
      try {
        await fn();
      } catch (e) {
        catchChecks(e as ValidationErrors);
        return;
      }
      fail("Expected exception");
    }
  });
});
