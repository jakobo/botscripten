import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/main.js",
    output: {
      name: "chatbook",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      json(),
      resolve(), // so Rollup can find `ms`
      babel({
        runtimeHelpers: true,
        exclude: ["node_modules/**"],
        presets: ["@babel/preset-env"],
        plugins: [
          "@babel/plugin-transform-runtime",
          "@babel/plugin-proposal-object-rest-spread",
          "@babel/plugin-proposal-class-properties"
        ]
      }),
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  }
];
