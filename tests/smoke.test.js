const fs = require("fs-extra");
const path = require("path");

const EXAMPLES = path.resolve(__dirname, "../examples");

const parse = require("../index");

const getFile = name =>
  fs.readFileSync(path.resolve(EXAMPLES, `./${name}`)).toString();

describe("Parser Smoke Tests", () => {
  test("Parser is defined", () => {
    expect(typeof parse).toBe("function");
  });
});

describe("onboarding.html Parse", () => {
  let html = "";
  beforeAll(() => {
    html = getFile("sample.html");
  });

  test("parse() returns an story object with passage objects, tags, and directives", () => {
    const story = parse(html);
    expect(typeof story).toBe("object");
    expect(story.name).toBe("Test");
    expect(story.start).toBe("Start");
    expect(story.format).toMatch(/Botscripten/);
    expect(story.passages[story.passageIndex[story.start]]).toMatchObject({
      pid: story.passageIndex[story.start],
    });
  });
});
