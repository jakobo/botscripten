const chatbook = require("../index");

describe("Parser Smoke Tests", () => {
  test("Parser is defined", () => {
    expect(typeof chatbook.parse).toBe("function");
  });
});
