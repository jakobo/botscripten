const path = require("path");

const StaticServer = require("static-server");
const exampleServer = new StaticServer({
  rootPath: path.resolve(__dirname, "../examples/"),
  port: 3000,
  name: "Chatbook-example-server" // optional, will set "X-Powered-by" HTTP header
});

exampleServer.start(() => {
  console.log("🌎 Example Server listening to", exampleServer.port);
});

const distServer = new StaticServer({
  rootPath: path.resolve(__dirname, "../dist/Twine2/"),
  port: 3001,
  name: "Chatbook-dist-server" // optional, will set "X-Powered-by" HTTP header
});

distServer.start(() => {
  console.log("📦 Format/Dist Server listening to", distServer.port);
  console.log("Active URLs:");
  console.log(
    `  Chatbook @ http://localhost:${distServer.port}/Chatbook/format.js`
  );
  console.log(
    `    Viewer @ http://localhost:${distServer.port}/ChatbookViewer/format.js`
  );
  console.log("\nPlease remember to remove these from Twine when done testing");
});
