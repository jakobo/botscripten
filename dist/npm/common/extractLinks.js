"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const LINK_PATTERN = /\[\[(.*?)\]\]/gm;

const extractLinks = str => {
  const links = [];
  const original = str;

  while (str.match(LINK_PATTERN)) {
    str = str.replace(LINK_PATTERN, (match, t) => {
      let display = t;
      let target = t; // display|target format

      const barIndex = t.indexOf("|");
      const rightArrIndex = t.indexOf("->");
      const leftArrIndex = t.indexOf("<-");

      switch (true) {
        case barIndex >= 0:
          display = t.substr(0, barIndex);
          target = t.substr(barIndex + 1);
          break;

        case rightArrIndex >= 0:
          display = t.substr(0, rightArrIndex);
          target = t.substr(rightArrIndex + 2);
          break;

        case leftArrIndex >= 0:
          display = t.substr(leftArrIndex + 2);
          target = t.substr(0, leftArrIndex);
          break;
      }

      links.push({
        display,
        target
      });
      return ""; // render nothing if it's a twee link
    });
  }

  return {
    links,
    updated: str,
    original
  };
};

var _default = extractLinks;
exports.default = _default;