"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _jsdom = require("jsdom");

var _extractDirectives = _interopRequireDefault(require("../common/extractDirectives"));

var _extractLinks = _interopRequireDefault(require("../common/extractLinks"));

var _stripComments = _interopRequireDefault(require("../common/stripComments"));

var _lodash = _interopRequireDefault(require("lodash.unescape"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const gen$ = d => q => [...d.querySelectorAll(q)];

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
  const dom = new _jsdom.JSDOM(str);
  const doc = dom.window.document;
  const $ = gen$(doc);
  const s = $("tw-storydata")[0];
  const p = $("tw-passagedata");
  const t = $("tw-tag");
  const passages = {};
  const pIndex = {};
  p.forEach(pg => {
    const index = passages.length;
    const raw = (0, _lodash.default)(pg.innerHTML);
    const directives = (0, _extractDirectives.default)(raw);
    let content = (0, _stripComments.default)(raw);
    const linkData = (0, _extractLinks.default)(content);
    content = linkData.updated;
    content = content.trim();
    const pid = pg.getAttribute("pid");
    passages[pid] = _objectSpread({}, passageDefaults, {
      pid: pg.getAttribute("pid"),
      name: (0, _lodash.default)(pg.getAttribute("name") || ""),
      tags: (pg.getAttribute("tags") || "").split(/[\s]+/g),
      position: pg.getAttribute("position") || `${index * 10},${index * 10}`,
      size: pg.getAttribute("size") || "100,100",
      links: linkData.links,
      original: pg.innerHTML,
      directives,
      content
    });
    pIndex[pg.getAttribute("name")] = pid;
  });
  const tags = [];
  t.forEach(tg => {
    tags.push(_objectSpread({}, tagDefaults, {
      name: tg.getAttribute("name") || "",
      color: tg.getAttribute("color") || ""
    }));
  });
  const startId = s.getAttribute("startnode");

  const story = _objectSpread({}, storyDefaults, {
    startId,
    name: (0, _lodash.default)(s.getAttribute("name") || ""),
    start: (0, _lodash.default)(passages[startId].name),
    // Twine starts PIDs at
    creator: (0, _lodash.default)(s.getAttribute("creator") || ""),
    creatorVersion: s.getAttribute("creator-verson") || "",
    ifid: s.getAttribute("ifid") || "",
    zoom: s.getAttribute("zoom") || "1",
    format: s.getAttribute("format") || "",
    formatVersion: s.getAttribute("format-version") || "",
    options: (0, _lodash.default)(s.getAttribute("options") || ""),
    passageIndex: pIndex,
    tags,
    passages
  });

  return story;
};

var _default = parse;
exports.default = _default;