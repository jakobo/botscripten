const fs = require("fs-extra");
const path = require("path");
const tmpl = require("lodash.template");
const pkg = require("../package.json");
const CleanCSS = require("clean-css");
const htmlMin = require("html-minifier").minify;

const build = (name, description, outDir, { template, js, css }) => {
  // common
  const svg = path.resolve(__dirname, "../src/template/icon.svg");
  const svgOut = path.resolve(outDir, "./icon.svg");
  const targetFile = path.resolve(outDir, "./format.js");

  const jsContent = fs.readFileSync(js, "utf8").toString();
  const cssContent = fs.readFileSync(css, "utf8").toString();
  const tmplContent = fs.readFileSync(template, "utf8").toString();
  const minCss = new CleanCSS({}).minify(cssContent.replace(/\s+/g, " "));

  const storyFile = tmpl(tmplContent)({
    name: "{{STORY_NAME}}",
    passages: "{{STORY_DATA}}",
    script: `<script>${jsContent}</script>`,
    stylesheet: `<style>${minCss.styles}</style>`,
  });

  const minStory = htmlMin(storyFile, {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    removeComments: false,
    useShortDoctype: true,
  });

  const formatData = {
    name,
    description,
    author: pkg.author.replace(/ <.*>/, ""),
    image: "icon.svg",
    url: pkg.repository,
    version: pkg.version,
    proofing: false,
    source: minStory,
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
    css: path.resolve(__dirname, "../src/template/botscripten.css"),
    js: path.resolve(__dirname, "../dist/botscripten.umd.js"),
  }
);

console.log("OK");
