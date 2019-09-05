import unescape from "lodash.unescape";
import extractDirectives from "../common/extractDirectives";
import extractLinks from "../common/extractLinks";
import stripComments from "../common/stripComments";

const findStory = win => {
  if (win && win.story) {
    return win.story;
  }
  return { state: {} };
};

const renderPassage = passage => {
  const source = passage.source;

  const directives = extractDirectives(source);
  let result = stripComments(source);

  if (passage) {
    // remove links if set previously
    passage.links = [];
  }

  // [[links]]
  const linkData = extractLinks(result);
  result = linkData.updated;
  if (passage) {
    passage.links = linkData.links;
  }

  // before handling any tags, handle any/all directives
  directives.forEach(d => {
    if (!passage.story.directives[d.name]) return;
    passage.story.directives[d.name].forEach(run => {
      result = run(d.content, result, passage, passage.story);
    });
  });

  // if no speaker tag, return an empty render set
  if (!passage.getSpeaker()) {
    return {
      directives,
      text: [],
    };
  }

  // if prompt tag is set, notify the story
  if (passage) {
    const prompts = passage.prefixTag("prompt");
    if (prompts.length) {
      passage.story.prompt(prompts[0]);
    }
  }

  if (passage.hasTag("oneline")) {
    return {
      directives,
      text: [result],
    };
  }

  // if this is a multiline item, trim, split, and mark each item
  // return the array
  result = result.trim();
  return {
    directives,
    text: result.split(/[\r\n]+/g),
  };
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
    if (speakerTag) return speakerTag.replace(/^speaker-/, "");
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
              [t]: 1,
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
