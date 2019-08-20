import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/twine/index.js",
    output: {
      name: "chatbook",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [
      json(),
      resolve(),
      babel({
        runtimeHelpers: true,
        exclude: ["node_modules/**"],
        presets: ["@babel/preset-env"], // override node target for browser UMD
      }),
      commonjs(),
    ],
  },
];
