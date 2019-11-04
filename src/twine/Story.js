import Passage from "./Passage";
import escape from "lodash.escape";
import unescape from "lodash.unescape";

const selectPassages = "tw-passagedata";
const selectCss = '*[type="text/twine-css"]';
const selectJs = '*[type="text/twine-javascript"]';
const selectActiveLink = "#user-response-panel a[data-passage]";
const selectActiveButton = "#user-response-panel button[data-passage]";
const selectActiveInput = "#user-response-panel input";
const selectActive = ".chat-panel .active";
const selectHistory = ".chat-panel .history";
const selectResponses = "#user-response-panel";
const typingIndicator = "#animation-container";

const IS_NUMERIC = /^[\d]+$/;

/**
 * Determine if a provided string contains only numbers
 * In the case of `pid` values for passages, this is true
 */
const isNumeric = d => IS_NUMERIC.test(d);

/**
 * Format a user passage (such as a response)
 */
const USER_PASSAGE_TMPL = ({ id, text }) => `
  <div class="chat-passage-wrapper" data-speaker="you">
    <div class="chat-passage phistory" data-speaker="you" data-upassage="${id}">
      ${text}
    </div>
  </div>
`;

/**
 * Format a message from a non-user
 */
const OTHER_PASSAGE_TMPL = ({ speaker, tags, text }) => `
  <div data-speaker="${speaker}" class="chat-passage-wrapper ${tags.join(" ")}">
    <div data-speaker="${speaker}" class="chat-passage">
      ${text}
    </div>
  </div>
`;

const DIRECTIVES_TMPL = directives => `
  <div class="directives">
    ${directives
      .map(
        ({ name, content }) =>
          `<div class="directive" name="${name}">${content.trim()}</div>`
      )
      .join("")}
  </div>
`;

/**
 * Forces a delay via promises in order to spread out messages
 */
const delay = async (t = 0) => new Promise(resolve => setTimeout(resolve, t));

// Find one/many nodes within a context. We [...findAll] to ensure we're cast as an array
// not as a node list
const find = (ctx, s) => ctx.querySelector(s);
const findAll = (ctx, s) => [...ctx.querySelectorAll(s)] || [];

/**
 * Standard Twine Format Story Object
 */
class Story {
  version = 2; // Twine v2

  document = null;
  story = null;
  name = "";
  startsAt = 0;
  current = 0;
  history = [];
  passages = {};
  showPrompt = false;
  errorMessage = "\u26a0 %s";

  directives = {};
  elements = {};

  userScripts = [];
  userStyles = [];

  constructor(win, src) {
    this.window = win;

    if (src) {
      this.document = document.implementation.createHTMLDocument(
        "Botscripten Injected Content"
      );
    } else {
      this.document = document;
    }

    this.story = find(this.document, "tw-storydata");

    // elements
    this.elements = {
      active: find(this.document, selectActive),
      history: find(this.document, selectHistory),
    };

    // properties of story node
    this.name = this.story.getAttribute("name") || "";
    this.startsAt = this.story.getAttribute("startnode") || 0;

    findAll(this.story, selectPassages).forEach(p => {
      const id = parseInt(p.getAttribute("pid"));
      const name = p.getAttribute("name");
      const tags = (p.getAttribute("tags") || "").split(/\s+/g);
      const passage = p.innerHTML || "";

      this.passages[id] = new Passage(id, name, tags, passage, this);
    });

    find(this.document, "title").innerHTML = this.name;
    find(this.document, "#ptitle").innerHTML = this.name;

    this.userScripts = (findAll(this.document, selectJs) || []).map(
      el => el.innerHTML
    );
    this.userStyles = (findAll(this.document, selectCss) || []).map(
      el => el.innerHTML
    );
  }

  /**
   * Starts the story by setting up listeners and then advancing
   * to the first item in the stack
   */
  start = () => {
    // activate userscripts and styles
    this.userStyles.forEach(s => {
      const t = this.document.createElement("style");
      t.innerHTML = s;
      this.document.body.appendChild(t);
    });
    this.userScripts.forEach(s => {
      // eval is evil, but this is simply how Twine works
      // eslint-disable-line
      globalEval(s);
    });

    // when you click on a[data-passage] (response link)...
    this.document.body.addEventListener("click", e => {
      if (!e.target.matches(selectActiveLink)) {
        return;
      }

      this.advance(
        this.findPassage(e.target.getAttribute("data-passage")),
        e.target.innerHTML
      );
    });

    // when you click on button[data-passage] (response input)...
    this.document.body.addEventListener("click", e => {
      if (!e.target.matches(selectActiveButton)) {
        return;
      }

      // capture and disable showPrompt feature
      const value = find(this.document, selectActiveInput).value;
      this.showPrompt = false;

      this.advance(
        this.findPassage(e.target.getAttribute("data-passage")),
        value
      );
    });

    this.advance(this.findPassage(this.startsAt));
  };

  /**
   * Find a passage based on its id or name
   */
  findPassage = idOrName => {
    if (isNumeric(idOrName)) {
      return this.passages[idOrName];
    } else {
      // handle passages with ' and " (can't use a css selector consistently)
      const p = findAll(this.story, "tw-passagedata").filter(
        p => unescape(p.getAttribute("name")) === idOrName
      )[0];
      if (!p) return null;
      return this.passages[p.getAttribute("pid")];
    }
  };

  /**
   * Advance the story to the passage specified, optionally adding userText
   */
  advance = async (passage, userText = null) => {
    this.history.push(passage.id);
    const last = this.current;

    // .active is captured & cleared
    const existing = this.elements.active.innerHTML;
    this.elements.active.innerHTML = "";

    // whatever was in active is moved up into history
    this.elements.history.innerHTML += existing;

    // if there is userText, it is added to .history
    if (userText) {
      this.renderUserMessage(
        last,
        userText,
        s => (this.elements.history.innerHTML += s)
      );
    }

    // The new passage is rendered and placed in .active
    // after all renders, user options are displayed
    await this.renderPassage(
      passage,
      s => (this.elements.active.innerHTML += s)
    );

    if (!passage.hasTag("wait") && passage.links.length === 1) {
      // auto advance if the wait tag is not set and there is exactly
      // 1 link found in our pssage.
      this.advance(this.findPassage(passage.links[0].target));
      return;
    }

    this.renderChoices(passage);
  };

  /**
   * Render text as if it came from the user
   */
  renderUserMessage = async (pid, text, renderer) => {
    await renderer(
      USER_PASSAGE_TMPL({
        pid,
        text,
      })
    );
    this.scrollToBottom();
    return Promise.resolve();
  };

  /**
   * Render a Twine passage object
   */
  renderPassage = async (passage, renderer) => {
    const speaker = passage.getSpeaker();
    let statements = passage.render();
    console.log(statements.directives);

    await renderer(DIRECTIVES_TMPL(statements.directives));

    let next = statements.text.shift();
    this.showTyping();
    while (next) {
      const content = OTHER_PASSAGE_TMPL({
        speaker,
        tags: passage.tags,
        text: next,
      });
      await delay(this.calculateDelay(next)); // todo
      await renderer(content);
      next = statements.text.shift();
    }
    this.hideTyping();
    this.scrollToBottom();

    return Promise.resolve();
  };

  /**
   * A rough function for determining a waiting period based on string length
   */
  calculateDelay = txt => {
    const typingDelayRatio = 0.3;
    const rate = 20; // ms
    return txt.length * rate * typingDelayRatio;
  };

  /**
   * Shows the typing indicator
   */
  showTyping = () => {
    find(this.document, typingIndicator).style.visibility = "visible";
  };

  /**
   * Hides the typing indicator
   */
  hideTyping = () => {
    find(this.document, typingIndicator).style.visibility = "hidden";
  };

  /**
   * Scrolls the document as far as possible (based on history container's height)
   */
  scrollToBottom = () => {
    const hist = find(this.document, "#phistory");
    document.scrollingElement.scrollTop = hist.offsetHeight;
  };

  /**
   * Clears the choices panel
   */
  removeChoices = () => {
    const panel = find(this.document, selectResponses);
    panel.innerHTML = "";
  };

  /**
   * Renders the choices panel with a set of options based on passage links
   */
  renderChoices = passage => {
    this.removeChoices();
    const panel = find(this.document, selectResponses);
    passage.links.forEach(l => {
      panel.innerHTML += `<a href="javascript:void(0)" class="user-response" data-passage="${escape(
        l.target
      )}">${l.display}</a>`;
    });
  };

  /**
   * Registers a custom directive for this story
   * Signature of (directiveContent, outputText, story, passage, next)
   */
  directive = (id, cb) => {
    if (!this.directives[id]) {
      this.directives[id] = [];
    }
    this.directives[id].push(cb);
  };
}

export default Story;
