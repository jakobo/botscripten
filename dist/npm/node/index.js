"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _extractDirectives = _interopRequireDefault(require("../common/extractDirectives"));

var _extractLinks = _interopRequireDefault(require("../common/extractLinks"));

var _stripComments = _interopRequireDefault(require("../common/stripComments"));

var _lodash = _interopRequireDefault(require("lodash.unescape"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const storyDefaults = {
  name: "",
  start: null,
  startId: null,
  creator: "",
  creatorVersion: "",
  ifid: "",
  zoom: "",
  format: "",
  formatVersion: "",
  options: "",
  tags: [],
  passages: [],
  passageIndex: {}
};
const tagDefaults = {
  name: "",
  color: ""
};
const passageDefaults = {
  pid: null,
  name: "",
  tags: [],
  directives: [],
  links: [],
  position: "",
  size: "",
  content: ""
};

const parse = str => {
  // by default, JSDOM will not execute any JavaScript encountered
  const $ = _cheerio.default.load(str);

  const $s = $("tw-storydata").first();
  const startId = $s.attr("startnode");
  const tags = [];
  const passages = {};
  const pIndex = {};
  $("tw-passagedata").each((index, pg) => {
    const $pg = $(pg);
    const raw = $pg.text();
    const directives = (0, _extractDirectives.default)(raw);
    let content = (0, _stripComments.default)(raw);
    const linkData = (0, _extractLinks.default)(content);
    content = linkData.updated;
    content = content.trim();
    const pid = $pg.attr("pid");
    passages[pid] = _objectSpread({}, passageDefaults, {
      pid: $pg.attr("pid"),
      name: (0, _lodash.default)($pg.attr("name") || ""),
      tags: ($pg.attr("tags") || "").split(/[\s]+/g),
      position: $pg.attr("position") || `${index * 10},${index * 10}`,
      size: $pg.attr("size") || "100,100",
      links: linkData.links,
      original: pg.innerHTML,
      directives,
      content
    });
    pIndex[$pg.attr("name")] = pid;
  });
  $("tw-tag").each((index, tg) => {
    const $tg = $(tg);
    tags.push(_objectSpread({}, tagDefaults, {
      name: $tg.attr("name") || "",
      color: $tg.attr("color") || ""
    }));
  });
  return _objectSpread({}, storyDefaults, {
    startId,
    name: (0, _lodash.default)($s.attr("name") || ""),
    start: (0, _lodash.default)(passages[startId].name),
    // Twine starts PIDs at
    creator: (0, _lodash.default)($s.attr("creator") || ""),
    creatorVersion: $s.attr("creator-verson") || "",
    ifid: $s.attr("ifid") || "",
    zoom: $s.attr("zoom") || "1",
    format: $s.attr("format") || "",
    formatVersion: $s.attr("format-version") || "",
    options: (0, _lodash.default)($s.attr("options") || ""),
    passageIndex: pIndex,
    tags,
    passages
  });
};

var _default = parse;
exports.default = _default;