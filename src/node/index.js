// node parser interface
import cheerio from "cheerio";
import extractDirectives from "../common/extractDirectives";
import extractLinks from "../common/extractLinks";
import stripComments from "../common/stripComments";
import unescape from "lodash.unescape";

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
  const $ = cheerio.load(str);
  const $s = $("tw-storydata").first();
  const startId = $s.attr("startnode");
  const tags = [];
  const passages = {};
  const pIndex = {};

  $("tw-passagedata").each((index, pg) => {
    const $pg = $(pg);
    const raw = $pg.text();
    const directives = extractDirectives(raw);
    let content = stripComments(raw);

    const linkData = extractLinks(content);
    content = linkData.updated;

    content = content.trim();
    const pid = $pg.attr("pid");

    passages[pid] = {
      ...passageDefaults,
      pid: $pg.attr("pid"),
      name: unescape($pg.attr("name") || ""),
      tags: ($pg.attr("tags") || "").split(/[\s]+/g),
      position: $pg.attr("position") || `${index * 10},${index * 10}`,
      size: $pg.attr("size") || "100,100",
      links: linkData.links,
      original: pg.innerHTML,
      directives,
      content,
    };

    pIndex[$pg.attr("name")] = pid;
  });

  $("tw-tag").each((index, tg) => {
    const $tg = $(tg);
    tags.push({
      ...tagDefaults,
      name: $tg.attr("name") || "",
      color: $tg.attr("color") || "",
    });
  });

  return {
    ...storyDefaults,
    startId,
    name: unescape($s.attr("name") || ""),
    start: unescape(passages[startId].name), // Twine starts PIDs at
    creator: unescape($s.attr("creator") || ""),
    creatorVersion: $s.attr("creator-verson") || "",
    ifid: $s.attr("ifid") || "",
    zoom: $s.attr("zoom") || "1",
    format: $s.attr("format") || "",
    formatVersion: $s.attr("format-version") || "",
    options: unescape($s.attr("options") || ""),
    passageIndex: pIndex,
    tags,
    passages,
  };
};

export default parse;
