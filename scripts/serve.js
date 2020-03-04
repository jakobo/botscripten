const path = require("path");
const util = require("util");
const outdent = require("outdent");

const StaticServer = require("static-server");

const servers = [
  new StaticServer({
    rootPath: path.resolve(__dirname, "../examples/"),
    port: 3000,
    name: "Botscripten-example-server", // optional, will set "X-Powered-by" HTTP header
  }),
  new StaticServer({
    rootPath: path.resolve(__dirname, "../dist/Twine2/"),
    port: 3001,
    name: "Botscripten-dist-server", // optional, will set "X-Powered-by" HTTP header
  }),
];

const allServers = servers.map(s => {
  const pvStart = util.promisify(s.start);
  return s.start();
});

Promise.all(allServers).then(() => {
  console.log(outdent`
    🌎 Example Server listening to 3000
    📦 Format/Dist Server listening to 3001
    Active URLs:
      Botscripten @ http://localhost:3001/Botscripten/format.js
      Samples @ http://localhost:3000

    Please remember to remove these from Twine when done testing`);
});
