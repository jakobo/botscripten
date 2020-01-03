const fs = require("fs-extra");
const path = require("path");
const tmpl = require("lodash.template");
const pkg = require("../package.json");

const IS_DEV = process.env.NODE_ENV === "development";
const PREFIX = IS_DEV ? "TEST_" : "";
const URL_BASE = IS_DEV
  ? "http://localhost:3002"
  : `https://cdn.jsdelivr.net/gh/aibexhq/botscripten@${pkg.version}`;

const build = (name, description, outDir, { template, js, css }) => {
  // common
  const svg = path.resolve(__dirname, "../src/template/icon.svg");
  const svgOut = path.resolve(outDir, "./icon.svg");

  const targetFile = path.resolve(outDir, "./format.js");

  const storyFile = tmpl(fs.readFileSync(template).toString())({
    name: "{{STORY_NAME}}",
    passages: "{{STORY_DATA}}",
    script: `<script src="${URL_BASE}/${js}"></script>`,
    stylesheet: `<link rel="stylesheet" href="${URL_BASE}/${css}" />`,
  });

  const formatData = {
    name: `${PREFIX}${name}`,
    description,
    author: pkg.author.replace(/ <.*>/, ""),
    image: "icon.svg",
    url: pkg.repository,
    version: pkg.version,
    proofing: false,
    source: storyFile,
  };

  fs.mkdirpSync(outDir);
  fs.copySync(svg, svgOut);
  fs.writeFileSync(
    targetFile,
    `window.storyFormat(${JSON.stringify(formatData)})`
  );
};

build(
  "Botscripten",
  "An interactive chat viewer",
  path.resolve(__dirname, "../dist/Twine2/Botscripten"),
  {
    template: path.resolve(__dirname, "../src/template/index.html"),
    css: "src/template/botscripten.css",
    js: "dist/botscripten.umd.js",
  }
);

console.log("OK");
