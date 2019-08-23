// node parser interface
import { JSDOM } from "jsdom";
import extractDirectives from "../common/extractDirectives";
import extractLinks from "../common/extractLinks";
import stripComments from "../common/stripComments";
import unescape from "lodash.unescape";

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
  passageIndex: {},
};

const tagDefaults = {
  name: "",
  color: "",
};

const passageDefaults = {
  pid: null,
  name: "",
  tags: [],
  directives: [],
  links: [],
  position: "",
  size: "",
  content: "",
};

const parse = str => {
  // by default, JSDOM will not execute any JavaScript encountered
  const dom = new JSDOM(str);
  const doc = dom.window.document;
  const $ = gen$(doc);

  const s = $("tw-storydata")[0];
  const p = $("tw-passagedata");
  const t = $("tw-tag");

  const passages = [];
  const pIndex = {};
  p.forEach(pg => {
    const index = passages.length;
    const raw = unescape(pg.innerHTML);
    const directives = extractDirectives(raw);
    let content = stripComments(raw);

    const linkData = extractLinks(content);
    content = linkData.updated;

    content = content.trim();
    const pid = pg.getAttribute("pid");

    passages[pid] = {
      ...passageDefaults,
      pid: pg.getAttribute("pid"),
      name: unescape(pg.getAttribute("name") || ""),
      tags: (pg.getAttribute("tags") || "").split(/[\s]+/g),
      position: pg.getAttribute("position") || `${index * 10},${index * 10}`,
      size: pg.getAttribute("size") || "100,100",
      links: linkData.links,
      original: pg.innerHTML,
      directives,
      content,
    };

    pIndex[pg.getAttribute("name")] = pid;
  });

  const tags = [];
  t.forEach(tg => {
    tags.push({
      ...tagDefaults,
      name: tg.getAttribute("name") || "",
      color: tg.getAttribute("color") || "",
    });
  });

  const startId = s.getAttribute("startnode");
  const story = {
    ...storyDefaults,
    startId,
    name: unescape(s.getAttribute("name") || ""),
    start: unescape(passages[startId].name), // Twine starts PIDs at
    creator: unescape(s.getAttribute("creator") || ""),
    creatorVersion: s.getAttribute("creator-verson") || "",
    ifid: s.getAttribute("ifid") || "",
    zoom: s.getAttribute("zoom") || "1",
    format: s.getAttribute("format") || "",
    formatVersion: s.getAttribute("format-version") || "",
    options: unescape(s.getAttribute("options") || ""),
    passageIndex: pIndex,
    tags,
    passages,
  };

  return story;
};

export default parse;
