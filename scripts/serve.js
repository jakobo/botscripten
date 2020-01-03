const path = require("path");

const StaticServer = require("static-server");
const exampleServer = new StaticServer({
  rootPath: path.resolve(__dirname, "../examples/"),
  port: 3000,
  name: "Botscripten-example-server", // optional, will set "X-Powered-by" HTTP header
});

exampleServer.start(() => {
  console.log("🌎 Example Server listening to", exampleServer.port);
});

const distServer = new StaticServer({
  rootPath: path.resolve(__dirname, "../dist/Twine2/"),
  port: 3001,
  name: "Botscripten-dist-server", // optional, will set "X-Powered-by" HTTP header
});

const devServer = new StaticServer({
  rootPath: path.resolve(__dirname, "../"),
  port: 3002,
  name: "Botscripten-raw-server", // optional, will set "X-Powered-by" HTTP header
});

devServer.start(() =>
  distServer.start(() => {
    console.log("📦 Format/Dist Server listening to", distServer.port);
    console.log("   mock cdn.jsdelivr.net on port", devServer.port);
    console.log("Active URLs:");
    console.log(
      `  Botscripten @ http://localhost:${
        distServer.port
      }/Botscripten/format.js`
    );
    console.log(
      "\nPlease remember to remove these from Twine when done testing"
    );
  })
);
