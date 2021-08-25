const createJoiValidationError = require("../createJoiValidationError");
const createTestJoiValidationError = createJoiValidationError("test");

describe("createJoiValidationError function", () => {
  it("should return new valid instance of Joi.ValidationError for objects", () => {
    const err = createTestJoiValidationError("example error", {
      example: "example",
    });

    const customDetails = [
      {
        message: "example error",
        path: ["test", "example"],
        type: "example error",
        context: {
          key: "example",
          label: "test.example",
          value: "example",
        },
      },
    ];

    expect(err.details).toMatchObject(customDetails);
  });

  it("should return new valid instance of Joi.ValidationError for arrays", () => {
    const arr = [];
    arr[1] = "example";
    const err = createTestJoiValidationError("example error", arr);

    const customDetails = [
      {
        message: "example error",
        path: ["test", 1],
        type: "example error",
        context: {
          key: 1,
          label: "test[1]",
          value: "example",
        },
      },
    ];

    expect(err.details).toMatchObject(customDetails);
  });
});
