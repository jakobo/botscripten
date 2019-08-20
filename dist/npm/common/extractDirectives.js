"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
const TOKEN_ESCAPED_OCTO = "__TOKEN_ESCAPED_BACKSLASH_OCTO__";
const BLOCK_DIRECTIVE = /^###@([\S]+)([\s\S]*?)###/gm;
const INLINE_DIRECTIVE = /^#@([\S]+)(.*)/g;

const extractDirectives = s => {
  const directives = []; // avoid sluring escaped items

  s = s.replace("\\#", TOKEN_ESCAPED_OCTO);
  s.replace(BLOCK_DIRECTIVE, (match, dir, content) => {
    directives.push({
      name: `@${dir}`,
      content: content.trim(),
    });
    return "";
  });
  s.replace(INLINE_DIRECTIVE, (match, dir, content) => {
    directives.push({
      name: `@${dir}`,
      content: content.trim(),
    });
    return "";
  });
  return directives;
};

var _default = extractDirectives;
exports.default = _default;
