import unescape from "lodash.unescape";

const TOKEN_ESCAPED_OCTO = "__TOKEN_ESCAPED_BACKSLASH_OCTO__";

const BLOCK_DIRECTIVE = /^###@([\S]+)([\s\S]*?)###/gm;
const INLINE_DIRECTIVE = /^#@([\S]+)(.*)/g;

const BLOCK_COMMENT = /###[\s\S]*?###/gm;
const INLINE_COMMENT = /^#.*$/g;

const IS_EXTERNAL_URL = /^\w+:\/\/\/?\w/i;
const LINK_PATTERN = /\[\[(.*?)\]\]/g;

const findStory = win => {
  if (win && win.story) {
    return win.story;
  }
  return { state: {} };
};

const escapeOctos = s => s.replace("\\#", TOKEN_ESCAPED_OCTO);
const restoreOctos = s => s.replace(TOKEN_ESCAPED_OCTO, "#");

const stripComments = s =>
  s.replace(BLOCK_COMMENT, "").replace(INLINE_COMMENT, "");

const extractDirectives = s => {
  const directives = [];
  s.replace(BLOCK_DIRECTIVE, (match, dir, content) => {
    directives.push({ name: `@${dir}`, content: content.trim() });
    return "";
  });
  s.replace(INLINE_DIRECTIVE, (match, dir, content) => {
    directives.push({ name: `@${dir}`, content: content.trim() });
    return "";
  });

  return directives;
};

const renderPassage = passage => {
  const source = passage.source;

  let result = source;

  result = escapeOctos(result);
  const directives = extractDirectives(result);
  result = stripComments(result);
  result = restoreOctos(result);

  // strip remaining comments
  result = result
    .replace("\\#", TOKEN_ESCAPED_OCTO)
    .replace(BLOCK_COMMENT, "")
    .replace(INLINE_COMMENT, "")
    .replace(TOKEN_ESCAPED_OCTO, "#")
    .trim();

  if (passage) {
    // remove links if set previously
    passage.links = [];
  }

  // [[links]]
  result = result.replace(LINK_PATTERN, (match, t) => {
    let display = t;
    let target = t;

    // display|target format
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

    // render an external link & stop?
    if (IS_EXTERNAL_URL.test(target)) {
      return '<a href="' + target + '" target="_blank">' + display + "</a>";
    }

    // handle passage
    if (passage) {
      passage.links.push({
        display,
        target
      });
    }

    return ""; // render nothing if it's a twee link
  });

  // before handling any tags, handle any/all directives
  directives.forEach(d => {
    if (!passage.story.directives[d.name]) return;
    passage.story.directives[d.name].forEach(run => {
      result = run(d.content, result, passage, passage.story);
    });
  });

  // if system tag, return an empty render set
  if (passage.hasTag("system")) {
    return [];
  }

  // if prompt tag is set, notify the story
  if (passage) {
    const prompts = passage.prefixTag("prompt");
    if (prompts.length) {
      passage.story.prompt(prompts[0]);
    }
  }

  // if this is a multiline item, trim, split, and mark each item
  // return the array
  if (passage.hasTag("multiline")) {
    result = result.trim();
    return result.split(/[\r\n]+/g);
  }

  // else returns an array of 1
  return [result];
};

class Passage {
  id = null;
  name = null;
  tags = null;
  tagDict = {};
  source = null;
  links = [];

  constructor(id, name, tags, source, story) {
    this.id = id;
    this.name = name;
    this.tags = tags;
    this.source = unescape(source);
    this.story = story;

    this.tags.forEach(t => (this.tagDict[t] = 1));
  }

  getSpeaker = () => {
    const speakerTag = this.tags.find(t => t.indexOf("speaker-") === 0) || "";
    const systemTag = this.hasTag("system");
    if (speakerTag) return speakerTag.replace(/^speaker-/, "");
    if (systemTag) return "system";
    return null;
  };

  prefixTag = (pfx, asDict) =>
    this.tags
      .filter(t => t.indexOf(`${pfx}-`) === 0)
      .map(t => t.replace(`${pfx}-`, ""))
      .reduce(
        (a, t) => {
          if (asDict)
            return {
              ...a,
              [t]: 1
            };

          return [...a, t];
        },
        asDict ? {} : []
      );

  hasTag = t => this.tagDict[t];

  // static and instance renders
  static render = str =>
    renderPassage(
      new Passage(null, null, null, str, findStory(window || null))
    );
  render = () => renderPassage(this);
}

export default Passage;
