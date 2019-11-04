const fs = require("fs-extra");
const path = require("path");
const tmpl = require("lodash.template");
const pkg = require("../package.json");

const PREFIX = process.env.NODE_ENV === "development" ? "TEST_" : "";

const build = (name, description, outDir, { template, js, css }) => {
  // common
  const svg = path.resolve(__dirname, "../src/template/icon.svg");
  const svgOut = path.resolve(outDir, "./icon.svg");

  const targetFile = path.resolve(outDir, "./format.js");

  const storyFile = tmpl(fs.readFileSync(template).toString())({
    name: "{{STORY_NAME}}",
    passages: "{{STORY_DATA}}",
    script: js ? `<script>${fs.readFileSync(js).toString()}</script>` : "",
    stylesheet: css ? `<style>${fs.readFileSync(css).toString()}</style>` : "",
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
  "BotscriptenViewer",
  "An interactive chat viewer for Botscripten",
  path.resolve(__dirname, "../dist/Twine2/BotscriptenViewer"),
  {
    template: path.resolve(__dirname, "../src/template/index.html"),
    css: path.resolve(__dirname, "../src/template/botscripten.css"),
  }
);

build(
  "Botscripten",
  "An export friendly version of a chat bot script in Twine",
  path.resolve(__dirname, "../dist/Twine2/Botscripten"),
  {
    template: path.resolve(__dirname, "../src/template/index.min.html"),
  }
);

console.log("OK");
