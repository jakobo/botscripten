// node parser interface
import { JSDOM } from "jsdom";

const parse = str => {
  // by default, JSDOM will not execute any JavaScript encountered
  const dom = new JSDOM(str);
  const doc = dom.window.document;
  console.log(doc);
};

export default parse;
