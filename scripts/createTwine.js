const fs = require("fs-extra");
const path = require("path");
const tmpl = require("lodash.template");
const pkg = require("../package.json");

const build = (name, outDir, { template, js, css }) => {
  // common
  const svg = path.resolve(__dirname, "../src/template/icon.svg");
  const svgOut = path.resolve(outDir, "./icon.svg");

  const targetFile = path.resolve(outDir, "./format.js");

  const storyFile = tmpl(fs.readFileSync(template).toString())({
    name: "{{STORY_NAME}}",
    passages: "{{STORY_DATA}}",
    script: js ? `<script>${fs.readFileSync(js).toString()}</script>` : "",
    stylesheet: css ? `<style>${fs.readFileSync(css).toString()}</style>` : ""
  });

  const formatData = {
    description: name,
    author: pkg.author.replace(/ <.*>/, ""),
    image: "icon.svg",
    name: name,
    url: pkg.repository,
    version: pkg.version,
    proofing: false,
    source: storyFile
  };

  fs.mkdirpSync(outDir);
  fs.copySync(svg, svgOut);
  fs.writeFileSync(
    targetFile,
    `window.storyFormat(${JSON.stringify(formatData)})`
  );
};

build(
  "ChatbookViewer",
  path.resolve(__dirname, "../dist/Twine2/ChatbookViewer"),
  {
    template: path.resolve(__dirname, "../src/template/index.html"),
    css: path.resolve(__dirname, "../src/template/chatbook.css"),
    js: path.resolve(__dirname, "../dist/chatbook.umd.js")
  }
);

build("Chatbook", path.resolve(__dirname, "../dist/Twine2/Chatbook"), {
  template: path.resolve(__dirname, "../src/template/index.min.html")
});

console.log("OK");
