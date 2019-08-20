(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source);

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * The inverse of `_.escape`; this method converts the HTML entities
   * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to
   * their corresponding characters.
   *
   * **Note:** No other HTML entities are unescaped. To unescape additional
   * HTML entities use a third-party library like [_he_](https://mths.be/he).
   *
   * @static
   * @memberOf _
   * @since 0.6.0
   * @category String
   * @param {string} [string=''] The string to unescape.
   * @returns {string} Returns the unescaped string.
   * @example
   *
   * _.unescape('fred, barney, &amp; pebbles');
   * // => 'fred, barney, & pebbles'
   */
  function unescape(string) {
    string = toString(string);
    return (string && reHasEscapedHtml.test(string))
      ? string.replace(reEscapedHtml, unescapeHtmlChar)
      : string;
  }

  var lodash_unescape = unescape;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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

    return {
      state: {}
    };
  };

  const escapeOctos = s => s.replace("\\#", TOKEN_ESCAPED_OCTO);

  const restoreOctos = s => s.replace(TOKEN_ESCAPED_OCTO, "#");

  const stripComments = s => s.replace(BLOCK_COMMENT, "").replace(INLINE_COMMENT, "");

  const extractDirectives = s => {
    const directives = [];
    s.replace(BLOCK_DIRECTIVE, (match, dir, content) => {
      directives.push({
        name: "@".concat(dir),
        content: content.trim()
      });
      return "";
    });
    s.replace(INLINE_DIRECTIVE, (match, dir, content) => {
      directives.push({
        name: "@".concat(dir),
        content: content.trim()
      });
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
    result = restoreOctos(result); // strip remaining comments

    result = result.replace("\\#", TOKEN_ESCAPED_OCTO).replace(BLOCK_COMMENT, "").replace(INLINE_COMMENT, "").replace(TOKEN_ESCAPED_OCTO, "#").trim();

    if (passage) {
      // remove links if set previously
      passage.links = [];
    } // [[links]]


    result = result.replace(LINK_PATTERN, (match, t) => {
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
      } // render an external link & stop?


      if (IS_EXTERNAL_URL.test(target)) {
        return '<a href="' + target + '" target="_blank">' + display + "</a>";
      } // handle passage


      if (passage) {
        passage.links.push({
          display,
          target
        });
      }

      return ""; // render nothing if it's a twee link
    }); // before handling any tags, handle any/all directives

    directives.forEach(d => {
      if (!passage.story.directives[d.name]) return;
      passage.story.directives[d.name].forEach(run => {
        result = run(d.content, result, passage, passage.story);
      });
    }); // if system tag, return an empty render set

    if (passage.hasTag("system")) {
      return [];
    } // if prompt tag is set, notify the story


    if (passage) {
      const prompts = passage.prefixTag("prompt");

      if (prompts.length) {
        passage.story.prompt(prompts[0]);
      }
    } // if this is a multiline item, trim, split, and mark each item
    // return the array


    if (passage.hasTag("multiline")) {
      result = result.trim();
      return result.split(/[\r\n]+/g);
    } // else returns an array of 1


    return [result];
  };

  class Passage {
    constructor(id, name, tags, source, story) {
      defineProperty(this, "id", null);

      defineProperty(this, "name", null);

      defineProperty(this, "tags", null);

      defineProperty(this, "tagDict", {});

      defineProperty(this, "source", null);

      defineProperty(this, "links", []);

      defineProperty(this, "getSpeaker", () => {
        const speakerTag = this.tags.find(t => t.indexOf("speaker-") === 0) || "";
        const systemTag = this.hasTag("system");
        if (speakerTag) return speakerTag.replace(/^speaker-/, "");
        if (systemTag) return "system";
        return null;
      });

      defineProperty(this, "prefixTag", (pfx, asDict) => this.tags.filter(t => t.indexOf("".concat(pfx, "-")) === 0).map(t => t.replace("".concat(pfx, "-"), "")).reduce((a, t) => {
        if (asDict) return _objectSpread({}, a, {
          [t]: 1
        });
        return [...a, t];
      }, asDict ? {} : []));

      defineProperty(this, "hasTag", t => this.tagDict[t]);

      defineProperty(this, "render", () => renderPassage(this));

      this.id = id;
      this.name = name;
      this.tags = tags;
      this.source = lodash_unescape(source);
      this.story = story;
      this.tags.forEach(t => this.tagDict[t] = 1);
    }

  }

  defineProperty(Passage, "render", str => renderPassage(new Passage(null, null, null, str, findStory(window || null))));

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag$1 = '[object Symbol]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"'`]/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf$1(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf$1(htmlEscapes);

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString$1 = objectProto$1.toString;

  /** Built-in value references. */
  var Symbol$1 = root$1.Symbol;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolToString$1 = symbolProto$1 ? symbolProto$1.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString$1(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol$1(value)) {
      return symbolToString$1 ? symbolToString$1.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike$1(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol$1(value) {
    return typeof value == 'symbol' ||
      (isObjectLike$1(value) && objectToString$1.call(value) == symbolTag$1);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString$1(value) {
    return value == null ? '' : baseToString$1(value);
  }

  /**
   * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
   * their corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in IE < 9, they can break out of
   * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the
   * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString$1(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var lodash_escape = escape;

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


  const USER_PASSAGE_TMPL = ({
    id,
    text
  }) => "\n  <div class=\"chat-passage-wrapper\" data-speaker=\"you\">\n    <div class=\"chat-passage phistory\" data-speaker=\"you\" data-upassage=\"".concat(id, "\">\n      ").concat(text, "\n    </div>\n  </div>\n");
  /**
   * Format a message from a non-user
   */


  const OTHER_PASSAGE_TMPL = ({
    speaker,
    tags,
    text
  }) => "\n  <div data-speaker=\"".concat(speaker, "\" class=\"chat-passage-wrapper ").concat(tags.join(" "), "\">\n    <div data-speaker=\"").concat(speaker, "\" class=\"chat-passage\">\n      ").concat(text, "\n    </div>\n  </div>\n");
  /**
   * Forces a delay via promises in order to spread out messages
   */


  const delay = async (t = 0) => new Promise(resolve => setTimeout(resolve, t)); // Find one/many nodes within a context. We [...findAll] to ensure we're cast as an array
  // not as a node list


  const find = (ctx, s) => ctx.querySelector(s);

  const findAll = (ctx, s) => [...ctx.querySelectorAll(s)] || [];
  /**
   * Standard Twine Format Story Object
   */


  class Story {
    // Twine v2
    constructor(win, src) {
      defineProperty(this, "version", 2);

      defineProperty(this, "document", null);

      defineProperty(this, "story", null);

      defineProperty(this, "name", "");

      defineProperty(this, "startsAt", 0);

      defineProperty(this, "current", 0);

      defineProperty(this, "history", []);

      defineProperty(this, "passages", {});

      defineProperty(this, "showPrompt", false);

      defineProperty(this, "errorMessage", "\u26a0 %s");

      defineProperty(this, "directives", {});

      defineProperty(this, "elements", {});

      defineProperty(this, "userScripts", []);

      defineProperty(this, "userStyles", []);

      defineProperty(this, "start", () => {
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
        }); // when you click on a[data-passage] (response link)...

        this.document.body.addEventListener("click", e => {
          if (!e.target.matches(selectActiveLink)) {
            return;
          }

          this.advance(this.findPassage(e.target.getAttribute("data-passage")), e.target.innerHTML);
        }); // when you click on button[data-passage] (response input)...

        this.document.body.addEventListener("click", e => {
          if (!e.target.matches(selectActiveButton)) {
            return;
          } // capture and disable showPrompt feature


          const value = find(this.document, selectActiveInput).value;
          this.showPrompt = false;
          this.advance(this.findPassage(e.target.getAttribute("data-passage")), value);
        });
        this.advance(this.findPassage(this.startsAt));
      });

      defineProperty(this, "findPassage", idOrName => {
        if (isNumeric(idOrName)) {
          return this.passages[idOrName];
        } else {
          // handle passages with ' and " (can't use a css selector consistently)
          const p = findAll(this.story, "tw-passagedata").filter(p => p.getAttribute("name") === idOrName)[0];
          if (!p) return null;
          return this.passages[p.getAttribute("pid")];
        }
      });

      defineProperty(this, "advance", async (passage, userText = null) => {
        this.history.push(passage.id);
        const last = this.current; // .active is captured & cleared

        const existing = this.elements.active.innerHTML;
        this.elements.active.innerHTML = ""; // whatever was in active is moved up into history

        this.elements.history.innerHTML += existing; // if there is userText, it is added to .history

        if (userText) {
          this.renderUserMessage(last, userText, s => this.elements.history.innerHTML += s);
        } // The new passage is rendered and placed in .active
        // after all renders, user options are displayed


        await this.renderPassage(passage, s => this.elements.active.innerHTML += s);

        if (passage.hasTag("auto")) {
          // auto advance if the auto tag is set, skipping anything that
          // could pause our operation
          this.advance(this.findPassage(passage.links[0].target));
          return;
        } // if prompt is set from the current node, enable freetext


        if (this.showPrompt) {
          this.renderTextInput(passage);
        } else {
          this.renderChoices(passage);
        }
      });

      defineProperty(this, "renderUserMessage", async (pid, text, renderer) => {
        await renderer(USER_PASSAGE_TMPL({
          pid,
          text
        }));
        this.scrollToBottom();
        return Promise.resolve();
      });

      defineProperty(this, "renderPassage", async (passage, renderer) => {
        const speaker = passage.getSpeaker();
        let statements = passage.render();
        let next = statements.shift();
        this.showTyping();

        while (next) {
          const content = OTHER_PASSAGE_TMPL({
            speaker,
            tags: passage.tags,
            text: next
          });
          await delay(this.calculateDelay(next)); // todo

          await renderer(content);
          next = statements.shift();
        }

        this.hideTyping();
        this.scrollToBottom();
        return Promise.resolve();
      });

      defineProperty(this, "calculateDelay", txt => {
        const typingDelayRatio = 0.3;
        const rate = 20; // ms

        return txt.length * rate * typingDelayRatio;
      });

      defineProperty(this, "showTyping", () => {
        find(this.document, typingIndicator).style.visibility = "visible";
      });

      defineProperty(this, "hideTyping", () => {
        find(this.document, typingIndicator).style.visibility = "hidden";
      });

      defineProperty(this, "scrollToBottom", () => {
        const hist = find(this.document, "#phistory");
        document.scrollingElement.scrollTop = hist.offsetHeight;
      });

      defineProperty(this, "removeChoices", () => {
        const panel = find(this.document, selectResponses);
        panel.innerHTML = "";
      });

      defineProperty(this, "renderChoices", passage => {
        this.removeChoices();
        const panel = find(this.document, selectResponses);
        passage.links.forEach(l => {
          panel.innerHTML += "<a href=\"javascript:void(0)\" class=\"user-response\" data-passage=\"".concat(lodash_escape(l.target), "\">").concat(l.display, "</a>");
        });
      });

      defineProperty(this, "renderTextInput", passage => {
        this.removeChoices();
        const panel = find(this.document, selectResponses);
        panel.innerHTML = "<input type=\"text\" id=\"user-input\" placeholder=\"".concat(this.showPrompt.placeholder, "\" /><button data-passage=\"").concat(lodash_escape(passage.links[0].target), "\">&gt;</button>");
      });

      defineProperty(this, "prompt", (saveAs, placeholder) => this.showPrompt = {
        saveAs,
        placeholder
      });

      defineProperty(this, "directive", (id, cb) => {
        if (!this.directives[id]) {
          this.directives[id] = [];
        }

        this.directives[id].push(cb);
      });

      this.window = win;

      if (src) {
        this.document = document.implementation.createHTMLDocument("Chatbook Injected Content");
      } else {
        this.document = document;
      }

      this.story = find(this.document, "tw-storydata"); // elements

      this.elements = {
        active: find(this.document, selectActive),
        history: find(this.document, selectHistory)
      }; // properties of story node

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
      this.userScripts = (findAll(this.document, selectJs) || []).map(el => el.innerHTML);
      this.userStyles = (findAll(this.document, selectCss) || []).map(el => el.innerHTML);
    }
    /**
     * Starts the story by setting up listeners and then advancing
     * to the first item in the stack
     */


  }

  (win => {
    if (typeof win !== "undefined") {
      win.document.addEventListener("DOMContentLoaded", function (event) {
        window.globalEval = eval;
        window.story = new Story(win);
        window.story.start();
      });
    }
  })(window || undefined);

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdGJvb2sudW1kLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gudW5lc2NhcGUvaW5kZXguanMiLCIuLi9zcmMvdHdpbmUvUGFzc2FnZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2guZXNjYXBlL2luZGV4LmpzIiwiLi4vc3JjL3R3aW5lL1N0b3J5LmpzIiwiLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2RlZmluZVByb3BlcnR5OyIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbnZhciByZUVzY2FwZWRIdG1sID0gLyYoPzphbXB8bHR8Z3R8cXVvdHwjMzl8Izk2KTsvZyxcbiAgICByZUhhc0VzY2FwZWRIdG1sID0gUmVnRXhwKHJlRXNjYXBlZEh0bWwuc291cmNlKTtcblxuLyoqIFVzZWQgdG8gbWFwIEhUTUwgZW50aXRpZXMgdG8gY2hhcmFjdGVycy4gKi9cbnZhciBodG1sVW5lc2NhcGVzID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnLFxuICAnJmd0Oyc6ICc+JyxcbiAgJyZxdW90Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiLFxuICAnJiM5NjsnOiAnYCdcbn07XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eU9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlPZihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYF8udW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBjaGFyYWN0ZXIuXG4gKi9cbnZhciB1bmVzY2FwZUh0bWxDaGFyID0gYmFzZVByb3BlcnR5T2YoaHRtbFVuZXNjYXBlcyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiBgXy5lc2NhcGVgOyB0aGlzIG1ldGhvZCBjb252ZXJ0cyB0aGUgSFRNTCBlbnRpdGllc1xuICogYCZhbXA7YCwgYCZsdDtgLCBgJmd0O2AsIGAmcXVvdDtgLCBgJiMzOTtgLCBhbmQgYCYjOTY7YCBpbiBgc3RyaW5nYCB0b1xuICogdGhlaXIgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzLlxuICpcbiAqICoqTm90ZToqKiBObyBvdGhlciBIVE1MIGVudGl0aWVzIGFyZSB1bmVzY2FwZWQuIFRvIHVuZXNjYXBlIGFkZGl0aW9uYWxcbiAqIEhUTUwgZW50aXRpZXMgdXNlIGEgdGhpcmQtcGFydHkgbGlicmFyeSBsaWtlIFtfaGVfXShodHRwczovL210aHMuYmUvaGUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC42LjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc0VzY2FwZWRIdG1sLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlZEh0bWwsIHVuZXNjYXBlSHRtbENoYXIpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5lc2NhcGU7XG4iLCJpbXBvcnQgdW5lc2NhcGUgZnJvbSBcImxvZGFzaC51bmVzY2FwZVwiO1xuXG5jb25zdCBUT0tFTl9FU0NBUEVEX09DVE8gPSBcIl9fVE9LRU5fRVNDQVBFRF9CQUNLU0xBU0hfT0NUT19fXCI7XG5cbmNvbnN0IEJMT0NLX0RJUkVDVElWRSA9IC9eIyMjQChbXFxTXSspKFtcXHNcXFNdKj8pIyMjL2dtO1xuY29uc3QgSU5MSU5FX0RJUkVDVElWRSA9IC9eI0AoW1xcU10rKSguKikvZztcblxuY29uc3QgQkxPQ0tfQ09NTUVOVCA9IC8jIyNbXFxzXFxTXSo/IyMjL2dtO1xuY29uc3QgSU5MSU5FX0NPTU1FTlQgPSAvXiMuKiQvZztcblxuY29uc3QgSVNfRVhURVJOQUxfVVJMID0gL15cXHcrOlxcL1xcL1xcLz9cXHcvaTtcbmNvbnN0IExJTktfUEFUVEVSTiA9IC9cXFtcXFsoLio/KVxcXVxcXS9nO1xuXG5jb25zdCBmaW5kU3RvcnkgPSB3aW4gPT4ge1xuICBpZiAod2luICYmIHdpbi5zdG9yeSkge1xuICAgIHJldHVybiB3aW4uc3Rvcnk7XG4gIH1cbiAgcmV0dXJuIHsgc3RhdGU6IHt9IH07XG59O1xuXG5jb25zdCBlc2NhcGVPY3RvcyA9IHMgPT4gcy5yZXBsYWNlKFwiXFxcXCNcIiwgVE9LRU5fRVNDQVBFRF9PQ1RPKTtcbmNvbnN0IHJlc3RvcmVPY3RvcyA9IHMgPT4gcy5yZXBsYWNlKFRPS0VOX0VTQ0FQRURfT0NUTywgXCIjXCIpO1xuXG5jb25zdCBzdHJpcENvbW1lbnRzID0gcyA9PlxuICBzLnJlcGxhY2UoQkxPQ0tfQ09NTUVOVCwgXCJcIikucmVwbGFjZShJTkxJTkVfQ09NTUVOVCwgXCJcIik7XG5cbmNvbnN0IGV4dHJhY3REaXJlY3RpdmVzID0gcyA9PiB7XG4gIGNvbnN0IGRpcmVjdGl2ZXMgPSBbXTtcbiAgcy5yZXBsYWNlKEJMT0NLX0RJUkVDVElWRSwgKG1hdGNoLCBkaXIsIGNvbnRlbnQpID0+IHtcbiAgICBkaXJlY3RpdmVzLnB1c2goeyBuYW1lOiBgQCR7ZGlyfWAsIGNvbnRlbnQ6IGNvbnRlbnQudHJpbSgpIH0pO1xuICAgIHJldHVybiBcIlwiO1xuICB9KTtcbiAgcy5yZXBsYWNlKElOTElORV9ESVJFQ1RJVkUsIChtYXRjaCwgZGlyLCBjb250ZW50KSA9PiB7XG4gICAgZGlyZWN0aXZlcy5wdXNoKHsgbmFtZTogYEAke2Rpcn1gLCBjb250ZW50OiBjb250ZW50LnRyaW0oKSB9KTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSk7XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZXM7XG59O1xuXG5jb25zdCByZW5kZXJQYXNzYWdlID0gcGFzc2FnZSA9PiB7XG4gIGNvbnN0IHNvdXJjZSA9IHBhc3NhZ2Uuc291cmNlO1xuXG4gIGxldCByZXN1bHQgPSBzb3VyY2U7XG5cbiAgcmVzdWx0ID0gZXNjYXBlT2N0b3MocmVzdWx0KTtcbiAgY29uc3QgZGlyZWN0aXZlcyA9IGV4dHJhY3REaXJlY3RpdmVzKHJlc3VsdCk7XG4gIHJlc3VsdCA9IHN0cmlwQ29tbWVudHMocmVzdWx0KTtcbiAgcmVzdWx0ID0gcmVzdG9yZU9jdG9zKHJlc3VsdCk7XG5cbiAgLy8gc3RyaXAgcmVtYWluaW5nIGNvbW1lbnRzXG4gIHJlc3VsdCA9IHJlc3VsdFxuICAgIC5yZXBsYWNlKFwiXFxcXCNcIiwgVE9LRU5fRVNDQVBFRF9PQ1RPKVxuICAgIC5yZXBsYWNlKEJMT0NLX0NPTU1FTlQsIFwiXCIpXG4gICAgLnJlcGxhY2UoSU5MSU5FX0NPTU1FTlQsIFwiXCIpXG4gICAgLnJlcGxhY2UoVE9LRU5fRVNDQVBFRF9PQ1RPLCBcIiNcIilcbiAgICAudHJpbSgpO1xuXG4gIGlmIChwYXNzYWdlKSB7XG4gICAgLy8gcmVtb3ZlIGxpbmtzIGlmIHNldCBwcmV2aW91c2x5XG4gICAgcGFzc2FnZS5saW5rcyA9IFtdO1xuICB9XG5cbiAgLy8gW1tsaW5rc11dXG4gIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKExJTktfUEFUVEVSTiwgKG1hdGNoLCB0KSA9PiB7XG4gICAgbGV0IGRpc3BsYXkgPSB0O1xuICAgIGxldCB0YXJnZXQgPSB0O1xuXG4gICAgLy8gZGlzcGxheXx0YXJnZXQgZm9ybWF0XG4gICAgY29uc3QgYmFySW5kZXggPSB0LmluZGV4T2YoXCJ8XCIpO1xuICAgIGNvbnN0IHJpZ2h0QXJySW5kZXggPSB0LmluZGV4T2YoXCItPlwiKTtcbiAgICBjb25zdCBsZWZ0QXJySW5kZXggPSB0LmluZGV4T2YoXCI8LVwiKTtcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgY2FzZSBiYXJJbmRleCA+PSAwOlxuICAgICAgICBkaXNwbGF5ID0gdC5zdWJzdHIoMCwgYmFySW5kZXgpO1xuICAgICAgICB0YXJnZXQgPSB0LnN1YnN0cihiYXJJbmRleCArIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgcmlnaHRBcnJJbmRleCA+PSAwOlxuICAgICAgICBkaXNwbGF5ID0gdC5zdWJzdHIoMCwgcmlnaHRBcnJJbmRleCk7XG4gICAgICAgIHRhcmdldCA9IHQuc3Vic3RyKHJpZ2h0QXJySW5kZXggKyAyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGxlZnRBcnJJbmRleCA+PSAwOlxuICAgICAgICBkaXNwbGF5ID0gdC5zdWJzdHIobGVmdEFyckluZGV4ICsgMik7XG4gICAgICAgIHRhcmdldCA9IHQuc3Vic3RyKDAsIGxlZnRBcnJJbmRleCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIHJlbmRlciBhbiBleHRlcm5hbCBsaW5rICYgc3RvcD9cbiAgICBpZiAoSVNfRVhURVJOQUxfVVJMLnRlc3QodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuICc8YSBocmVmPVwiJyArIHRhcmdldCArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgZGlzcGxheSArIFwiPC9hPlwiO1xuICAgIH1cblxuICAgIC8vIGhhbmRsZSBwYXNzYWdlXG4gICAgaWYgKHBhc3NhZ2UpIHtcbiAgICAgIHBhc3NhZ2UubGlua3MucHVzaCh7XG4gICAgICAgIGRpc3BsYXksXG4gICAgICAgIHRhcmdldFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7IC8vIHJlbmRlciBub3RoaW5nIGlmIGl0J3MgYSB0d2VlIGxpbmtcbiAgfSk7XG5cbiAgLy8gYmVmb3JlIGhhbmRsaW5nIGFueSB0YWdzLCBoYW5kbGUgYW55L2FsbCBkaXJlY3RpdmVzXG4gIGRpcmVjdGl2ZXMuZm9yRWFjaChkID0+IHtcbiAgICBpZiAoIXBhc3NhZ2Uuc3RvcnkuZGlyZWN0aXZlc1tkLm5hbWVdKSByZXR1cm47XG4gICAgcGFzc2FnZS5zdG9yeS5kaXJlY3RpdmVzW2QubmFtZV0uZm9yRWFjaChydW4gPT4ge1xuICAgICAgcmVzdWx0ID0gcnVuKGQuY29udGVudCwgcmVzdWx0LCBwYXNzYWdlLCBwYXNzYWdlLnN0b3J5KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gaWYgc3lzdGVtIHRhZywgcmV0dXJuIGFuIGVtcHR5IHJlbmRlciBzZXRcbiAgaWYgKHBhc3NhZ2UuaGFzVGFnKFwic3lzdGVtXCIpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gaWYgcHJvbXB0IHRhZyBpcyBzZXQsIG5vdGlmeSB0aGUgc3RvcnlcbiAgaWYgKHBhc3NhZ2UpIHtcbiAgICBjb25zdCBwcm9tcHRzID0gcGFzc2FnZS5wcmVmaXhUYWcoXCJwcm9tcHRcIik7XG4gICAgaWYgKHByb21wdHMubGVuZ3RoKSB7XG4gICAgICBwYXNzYWdlLnN0b3J5LnByb21wdChwcm9tcHRzWzBdKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGlzIGlzIGEgbXVsdGlsaW5lIGl0ZW0sIHRyaW0sIHNwbGl0LCBhbmQgbWFyayBlYWNoIGl0ZW1cbiAgLy8gcmV0dXJuIHRoZSBhcnJheVxuICBpZiAocGFzc2FnZS5oYXNUYWcoXCJtdWx0aWxpbmVcIikpIHtcbiAgICByZXN1bHQgPSByZXN1bHQudHJpbSgpO1xuICAgIHJldHVybiByZXN1bHQuc3BsaXQoL1tcXHJcXG5dKy9nKTtcbiAgfVxuXG4gIC8vIGVsc2UgcmV0dXJucyBhbiBhcnJheSBvZiAxXG4gIHJldHVybiBbcmVzdWx0XTtcbn07XG5cbmNsYXNzIFBhc3NhZ2Uge1xuICBpZCA9IG51bGw7XG4gIG5hbWUgPSBudWxsO1xuICB0YWdzID0gbnVsbDtcbiAgdGFnRGljdCA9IHt9O1xuICBzb3VyY2UgPSBudWxsO1xuICBsaW5rcyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGlkLCBuYW1lLCB0YWdzLCBzb3VyY2UsIHN0b3J5KSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy50YWdzID0gdGFncztcbiAgICB0aGlzLnNvdXJjZSA9IHVuZXNjYXBlKHNvdXJjZSk7XG4gICAgdGhpcy5zdG9yeSA9IHN0b3J5O1xuXG4gICAgdGhpcy50YWdzLmZvckVhY2godCA9PiAodGhpcy50YWdEaWN0W3RdID0gMSkpO1xuICB9XG5cbiAgZ2V0U3BlYWtlciA9ICgpID0+IHtcbiAgICBjb25zdCBzcGVha2VyVGFnID0gdGhpcy50YWdzLmZpbmQodCA9PiB0LmluZGV4T2YoXCJzcGVha2VyLVwiKSA9PT0gMCkgfHwgXCJcIjtcbiAgICBjb25zdCBzeXN0ZW1UYWcgPSB0aGlzLmhhc1RhZyhcInN5c3RlbVwiKTtcbiAgICBpZiAoc3BlYWtlclRhZykgcmV0dXJuIHNwZWFrZXJUYWcucmVwbGFjZSgvXnNwZWFrZXItLywgXCJcIik7XG4gICAgaWYgKHN5c3RlbVRhZykgcmV0dXJuIFwic3lzdGVtXCI7XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG5cbiAgcHJlZml4VGFnID0gKHBmeCwgYXNEaWN0KSA9PlxuICAgIHRoaXMudGFnc1xuICAgICAgLmZpbHRlcih0ID0+IHQuaW5kZXhPZihgJHtwZnh9LWApID09PSAwKVxuICAgICAgLm1hcCh0ID0+IHQucmVwbGFjZShgJHtwZnh9LWAsIFwiXCIpKVxuICAgICAgLnJlZHVjZShcbiAgICAgICAgKGEsIHQpID0+IHtcbiAgICAgICAgICBpZiAoYXNEaWN0KVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4uYSxcbiAgICAgICAgICAgICAgW3RdOiAxXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIFsuLi5hLCB0XTtcbiAgICAgICAgfSxcbiAgICAgICAgYXNEaWN0ID8ge30gOiBbXVxuICAgICAgKTtcblxuICBoYXNUYWcgPSB0ID0+IHRoaXMudGFnRGljdFt0XTtcblxuICAvLyBzdGF0aWMgYW5kIGluc3RhbmNlIHJlbmRlcnNcbiAgc3RhdGljIHJlbmRlciA9IHN0ciA9PlxuICAgIHJlbmRlclBhc3NhZ2UoXG4gICAgICBuZXcgUGFzc2FnZShudWxsLCBudWxsLCBudWxsLCBzdHIsIGZpbmRTdG9yeSh3aW5kb3cgfHwgbnVsbCkpXG4gICAgKTtcbiAgcmVuZGVyID0gKCkgPT4gcmVuZGVyUGFzc2FnZSh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFzc2FnZTtcbiIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIEhUTUwgZW50aXRpZXMgYW5kIEhUTUwgY2hhcmFjdGVycy4gKi9cbnZhciByZVVuZXNjYXBlZEh0bWwgPSAvWyY8PlwiJ2BdL2csXG4gICAgcmVIYXNVbmVzY2FwZWRIdG1sID0gUmVnRXhwKHJlVW5lc2NhcGVkSHRtbC5zb3VyY2UpO1xuXG4vKiogVXNlZCB0byBtYXAgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLiAqL1xudmFyIGh0bWxFc2NhcGVzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJiMzOTsnLFxuICAnYCc6ICcmIzk2Oydcbn07XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eU9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlPZihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG4vKipcbiAqIFVzZWQgYnkgYF8uZXNjYXBlYCB0byBjb252ZXJ0IGNoYXJhY3RlcnMgdG8gSFRNTCBlbnRpdGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGNociBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gKi9cbnZhciBlc2NhcGVIdG1sQ2hhciA9IGJhc2VQcm9wZXJ0eU9mKGh0bWxFc2NhcGVzKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnRvU3RyaW5nIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBjaGFyYWN0ZXJzIFwiJlwiLCBcIjxcIiwgXCI+XCIsICdcIicsIFwiJ1wiLCBhbmQgXCJcXGBcIiBpbiBgc3RyaW5nYCB0b1xuICogdGhlaXIgY29ycmVzcG9uZGluZyBIVE1MIGVudGl0aWVzLlxuICpcbiAqICoqTm90ZToqKiBObyBvdGhlciBjaGFyYWN0ZXJzIGFyZSBlc2NhcGVkLiBUbyBlc2NhcGUgYWRkaXRpb25hbFxuICogY2hhcmFjdGVycyB1c2UgYSB0aGlyZC1wYXJ0eSBsaWJyYXJ5IGxpa2UgW19oZV9dKGh0dHBzOi8vbXRocy5iZS9oZSkuXG4gKlxuICogVGhvdWdoIHRoZSBcIj5cIiBjaGFyYWN0ZXIgaXMgZXNjYXBlZCBmb3Igc3ltbWV0cnksIGNoYXJhY3RlcnMgbGlrZVxuICogXCI+XCIgYW5kIFwiL1wiIGRvbid0IG5lZWQgZXNjYXBpbmcgaW4gSFRNTCBhbmQgaGF2ZSBubyBzcGVjaWFsIG1lYW5pbmdcbiAqIHVubGVzcyB0aGV5J3JlIHBhcnQgb2YgYSB0YWcgb3IgdW5xdW90ZWQgYXR0cmlidXRlIHZhbHVlLiBTZWVcbiAqIFtNYXRoaWFzIEJ5bmVucydzIGFydGljbGVdKGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9hbWJpZ3VvdXMtYW1wZXJzYW5kcylcbiAqICh1bmRlciBcInNlbWktcmVsYXRlZCBmdW4gZmFjdFwiKSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEJhY2t0aWNrcyBhcmUgZXNjYXBlZCBiZWNhdXNlIGluIElFIDwgOSwgdGhleSBjYW4gYnJlYWsgb3V0IG9mXG4gKiBhdHRyaWJ1dGUgdmFsdWVzIG9yIEhUTUwgY29tbWVudHMuIFNlZSBbIzU5XShodHRwczovL2h0bWw1c2VjLm9yZy8jNTkpLFxuICogWyMxMDJdKGh0dHBzOi8vaHRtbDVzZWMub3JnLyMxMDIpLCBbIzEwOF0oaHR0cHM6Ly9odG1sNXNlYy5vcmcvIzEwOCksIGFuZFxuICogWyMxMzNdKGh0dHBzOi8vaHRtbDVzZWMub3JnLyMxMzMpIG9mIHRoZVxuICogW0hUTUw1IFNlY3VyaXR5IENoZWF0c2hlZXRdKGh0dHBzOi8vaHRtbDVzZWMub3JnLykgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBXaGVuIHdvcmtpbmcgd2l0aCBIVE1MIHlvdSBzaG91bGQgYWx3YXlzXG4gKiBbcXVvdGUgYXR0cmlidXRlIHZhbHVlc10oaHR0cDovL3dvbmtvLmNvbS9wb3N0L2h0bWwtZXNjYXBpbmcpIHRvIHJlZHVjZVxuICogWFNTIHZlY3RvcnMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlKCdmcmVkLCBiYXJuZXksICYgcGViYmxlcycpO1xuICogLy8gPT4gJ2ZyZWQsIGJhcm5leSwgJmFtcDsgcGViYmxlcydcbiAqL1xuZnVuY3Rpb24gZXNjYXBlKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1VuZXNjYXBlZEh0bWwudGVzdChzdHJpbmcpKVxuICAgID8gc3RyaW5nLnJlcGxhY2UocmVVbmVzY2FwZWRIdG1sLCBlc2NhcGVIdG1sQ2hhcilcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlc2NhcGU7XG4iLCJpbXBvcnQgUGFzc2FnZSBmcm9tIFwiLi9QYXNzYWdlXCI7XG5pbXBvcnQgZXNjYXBlIGZyb20gXCJsb2Rhc2guZXNjYXBlXCI7XG5cbmNvbnN0IHNlbGVjdFBhc3NhZ2VzID0gXCJ0dy1wYXNzYWdlZGF0YVwiO1xuY29uc3Qgc2VsZWN0Q3NzID0gJypbdHlwZT1cInRleHQvdHdpbmUtY3NzXCJdJztcbmNvbnN0IHNlbGVjdEpzID0gJypbdHlwZT1cInRleHQvdHdpbmUtamF2YXNjcmlwdFwiXSc7XG5jb25zdCBzZWxlY3RBY3RpdmVMaW5rID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbCBhW2RhdGEtcGFzc2FnZV1cIjtcbmNvbnN0IHNlbGVjdEFjdGl2ZUJ1dHRvbiA9IFwiI3VzZXItcmVzcG9uc2UtcGFuZWwgYnV0dG9uW2RhdGEtcGFzc2FnZV1cIjtcbmNvbnN0IHNlbGVjdEFjdGl2ZUlucHV0ID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbCBpbnB1dFwiO1xuY29uc3Qgc2VsZWN0QWN0aXZlID0gXCIuY2hhdC1wYW5lbCAuYWN0aXZlXCI7XG5jb25zdCBzZWxlY3RIaXN0b3J5ID0gXCIuY2hhdC1wYW5lbCAuaGlzdG9yeVwiO1xuY29uc3Qgc2VsZWN0UmVzcG9uc2VzID0gXCIjdXNlci1yZXNwb25zZS1wYW5lbFwiO1xuY29uc3QgdHlwaW5nSW5kaWNhdG9yID0gXCIjYW5pbWF0aW9uLWNvbnRhaW5lclwiO1xuXG5jb25zdCBJU19OVU1FUklDID0gL15bXFxkXSskLztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBwcm92aWRlZCBzdHJpbmcgY29udGFpbnMgb25seSBudW1iZXJzXG4gKiBJbiB0aGUgY2FzZSBvZiBgcGlkYCB2YWx1ZXMgZm9yIHBhc3NhZ2VzLCB0aGlzIGlzIHRydWVcbiAqL1xuY29uc3QgaXNOdW1lcmljID0gZCA9PiBJU19OVU1FUklDLnRlc3QoZCk7XG5cbi8qKlxuICogRm9ybWF0IGEgdXNlciBwYXNzYWdlIChzdWNoIGFzIGEgcmVzcG9uc2UpXG4gKi9cbmNvbnN0IFVTRVJfUEFTU0FHRV9UTVBMID0gKHsgaWQsIHRleHQgfSkgPT4gYFxuICA8ZGl2IGNsYXNzPVwiY2hhdC1wYXNzYWdlLXdyYXBwZXJcIiBkYXRhLXNwZWFrZXI9XCJ5b3VcIj5cbiAgICA8ZGl2IGNsYXNzPVwiY2hhdC1wYXNzYWdlIHBoaXN0b3J5XCIgZGF0YS1zcGVha2VyPVwieW91XCIgZGF0YS11cGFzc2FnZT1cIiR7aWR9XCI+XG4gICAgICAke3RleHR9XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuLyoqXG4gKiBGb3JtYXQgYSBtZXNzYWdlIGZyb20gYSBub24tdXNlclxuICovXG5jb25zdCBPVEhFUl9QQVNTQUdFX1RNUEwgPSAoeyBzcGVha2VyLCB0YWdzLCB0ZXh0IH0pID0+IGBcbiAgPGRpdiBkYXRhLXNwZWFrZXI9XCIke3NwZWFrZXJ9XCIgY2xhc3M9XCJjaGF0LXBhc3NhZ2Utd3JhcHBlciAke3RhZ3Muam9pbihcIiBcIil9XCI+XG4gICAgPGRpdiBkYXRhLXNwZWFrZXI9XCIke3NwZWFrZXJ9XCIgY2xhc3M9XCJjaGF0LXBhc3NhZ2VcIj5cbiAgICAgICR7dGV4dH1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG4vKipcbiAqIEZvcmNlcyBhIGRlbGF5IHZpYSBwcm9taXNlcyBpbiBvcmRlciB0byBzcHJlYWQgb3V0IG1lc3NhZ2VzXG4gKi9cbmNvbnN0IGRlbGF5ID0gYXN5bmMgKHQgPSAwKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdCkpO1xuXG4vLyBGaW5kIG9uZS9tYW55IG5vZGVzIHdpdGhpbiBhIGNvbnRleHQuIFdlIFsuLi5maW5kQWxsXSB0byBlbnN1cmUgd2UncmUgY2FzdCBhcyBhbiBhcnJheVxuLy8gbm90IGFzIGEgbm9kZSBsaXN0XG5jb25zdCBmaW5kID0gKGN0eCwgcykgPT4gY3R4LnF1ZXJ5U2VsZWN0b3Iocyk7XG5jb25zdCBmaW5kQWxsID0gKGN0eCwgcykgPT4gWy4uLmN0eC5xdWVyeVNlbGVjdG9yQWxsKHMpXSB8fCBbXTtcblxuLyoqXG4gKiBTdGFuZGFyZCBUd2luZSBGb3JtYXQgU3RvcnkgT2JqZWN0XG4gKi9cbmNsYXNzIFN0b3J5IHtcbiAgdmVyc2lvbiA9IDI7IC8vIFR3aW5lIHYyXG5cbiAgZG9jdW1lbnQgPSBudWxsO1xuICBzdG9yeSA9IG51bGw7XG4gIG5hbWUgPSBcIlwiO1xuICBzdGFydHNBdCA9IDA7XG4gIGN1cnJlbnQgPSAwO1xuICBoaXN0b3J5ID0gW107XG4gIHBhc3NhZ2VzID0ge307XG4gIHNob3dQcm9tcHQgPSBmYWxzZTtcbiAgZXJyb3JNZXNzYWdlID0gXCJcXHUyNmEwICVzXCI7XG5cbiAgZGlyZWN0aXZlcyA9IHt9O1xuICBlbGVtZW50cyA9IHt9O1xuXG4gIHVzZXJTY3JpcHRzID0gW107XG4gIHVzZXJTdHlsZXMgPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih3aW4sIHNyYykge1xuICAgIHRoaXMud2luZG93ID0gd2luO1xuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhpcy5kb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcbiAgICAgICAgXCJDaGF0Ym9vayBJbmplY3RlZCBDb250ZW50XCJcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3J5ID0gZmluZCh0aGlzLmRvY3VtZW50LCBcInR3LXN0b3J5ZGF0YVwiKTtcblxuICAgIC8vIGVsZW1lbnRzXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcbiAgICAgIGFjdGl2ZTogZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RBY3RpdmUpLFxuICAgICAgaGlzdG9yeTogZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RIaXN0b3J5KVxuICAgIH07XG5cbiAgICAvLyBwcm9wZXJ0aWVzIG9mIHN0b3J5IG5vZGVcbiAgICB0aGlzLm5hbWUgPSB0aGlzLnN0b3J5LmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgXCJcIjtcbiAgICB0aGlzLnN0YXJ0c0F0ID0gdGhpcy5zdG9yeS5nZXRBdHRyaWJ1dGUoXCJzdGFydG5vZGVcIikgfHwgMDtcblxuICAgIGZpbmRBbGwodGhpcy5zdG9yeSwgc2VsZWN0UGFzc2FnZXMpLmZvckVhY2gocCA9PiB7XG4gICAgICBjb25zdCBpZCA9IHBhcnNlSW50KHAuZ2V0QXR0cmlidXRlKFwicGlkXCIpKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBwLmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgICBjb25zdCB0YWdzID0gKHAuZ2V0QXR0cmlidXRlKFwidGFnc1wiKSB8fCBcIlwiKS5zcGxpdCgvXFxzKy9nKTtcbiAgICAgIGNvbnN0IHBhc3NhZ2UgPSBwLmlubmVySFRNTCB8fCBcIlwiO1xuXG4gICAgICB0aGlzLnBhc3NhZ2VzW2lkXSA9IG5ldyBQYXNzYWdlKGlkLCBuYW1lLCB0YWdzLCBwYXNzYWdlLCB0aGlzKTtcbiAgICB9KTtcblxuICAgIGZpbmQodGhpcy5kb2N1bWVudCwgXCJ0aXRsZVwiKS5pbm5lckhUTUwgPSB0aGlzLm5hbWU7XG4gICAgZmluZCh0aGlzLmRvY3VtZW50LCBcIiNwdGl0bGVcIikuaW5uZXJIVE1MID0gdGhpcy5uYW1lO1xuXG4gICAgdGhpcy51c2VyU2NyaXB0cyA9IChmaW5kQWxsKHRoaXMuZG9jdW1lbnQsIHNlbGVjdEpzKSB8fCBbXSkubWFwKFxuICAgICAgZWwgPT4gZWwuaW5uZXJIVE1MXG4gICAgKTtcbiAgICB0aGlzLnVzZXJTdHlsZXMgPSAoZmluZEFsbCh0aGlzLmRvY3VtZW50LCBzZWxlY3RDc3MpIHx8IFtdKS5tYXAoXG4gICAgICBlbCA9PiBlbC5pbm5lckhUTUxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgc3RvcnkgYnkgc2V0dGluZyB1cCBsaXN0ZW5lcnMgYW5kIHRoZW4gYWR2YW5jaW5nXG4gICAqIHRvIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBzdGFja1xuICAgKi9cbiAgc3RhcnQgPSAoKSA9PiB7XG4gICAgLy8gYWN0aXZhdGUgdXNlcnNjcmlwdHMgYW5kIHN0eWxlc1xuICAgIHRoaXMudXNlclN0eWxlcy5mb3JFYWNoKHMgPT4ge1xuICAgICAgY29uc3QgdCA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgdC5pbm5lckhUTUwgPSBzO1xuICAgICAgdGhpcy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQpO1xuICAgIH0pO1xuICAgIHRoaXMudXNlclNjcmlwdHMuZm9yRWFjaChzID0+IHtcbiAgICAgIC8vIGV2YWwgaXMgZXZpbCwgYnV0IHRoaXMgaXMgc2ltcGx5IGhvdyBUd2luZSB3b3Jrc1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgZ2xvYmFsRXZhbChzKTtcbiAgICB9KTtcblxuICAgIC8vIHdoZW4geW91IGNsaWNrIG9uIGFbZGF0YS1wYXNzYWdlXSAocmVzcG9uc2UgbGluaykuLi5cbiAgICB0aGlzLmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5tYXRjaGVzKHNlbGVjdEFjdGl2ZUxpbmspKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hZHZhbmNlKFxuICAgICAgICB0aGlzLmZpbmRQYXNzYWdlKGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtcGFzc2FnZVwiKSksXG4gICAgICAgIGUudGFyZ2V0LmlubmVySFRNTFxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIC8vIHdoZW4geW91IGNsaWNrIG9uIGJ1dHRvbltkYXRhLXBhc3NhZ2VdIChyZXNwb25zZSBpbnB1dCkuLi5cbiAgICB0aGlzLmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgaWYgKCFlLnRhcmdldC5tYXRjaGVzKHNlbGVjdEFjdGl2ZUJ1dHRvbikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBjYXB0dXJlIGFuZCBkaXNhYmxlIHNob3dQcm9tcHQgZmVhdHVyZVxuICAgICAgY29uc3QgdmFsdWUgPSBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdEFjdGl2ZUlucHV0KS52YWx1ZTtcbiAgICAgIHRoaXMuc2hvd1Byb21wdCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLmFkdmFuY2UoXG4gICAgICAgIHRoaXMuZmluZFBhc3NhZ2UoZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXNzYWdlXCIpKSxcbiAgICAgICAgdmFsdWVcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmFkdmFuY2UodGhpcy5maW5kUGFzc2FnZSh0aGlzLnN0YXJ0c0F0KSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZpbmQgYSBwYXNzYWdlIGJhc2VkIG9uIGl0cyBpZCBvciBuYW1lXG4gICAqL1xuICBmaW5kUGFzc2FnZSA9IGlkT3JOYW1lID0+IHtcbiAgICBpZiAoaXNOdW1lcmljKGlkT3JOYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFzc2FnZXNbaWRPck5hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBoYW5kbGUgcGFzc2FnZXMgd2l0aCAnIGFuZCBcIiAoY2FuJ3QgdXNlIGEgY3NzIHNlbGVjdG9yIGNvbnNpc3RlbnRseSlcbiAgICAgIGNvbnN0IHAgPSBmaW5kQWxsKHRoaXMuc3RvcnksIFwidHctcGFzc2FnZWRhdGFcIikuZmlsdGVyKFxuICAgICAgICBwID0+IHAuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSA9PT0gaWRPck5hbWVcbiAgICAgIClbMF07XG4gICAgICBpZiAoIXApIHJldHVybiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMucGFzc2FnZXNbcC5nZXRBdHRyaWJ1dGUoXCJwaWRcIildO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQWR2YW5jZSB0aGUgc3RvcnkgdG8gdGhlIHBhc3NhZ2Ugc3BlY2lmaWVkLCBvcHRpb25hbGx5IGFkZGluZyB1c2VyVGV4dFxuICAgKi9cbiAgYWR2YW5jZSA9IGFzeW5jIChwYXNzYWdlLCB1c2VyVGV4dCA9IG51bGwpID0+IHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaChwYXNzYWdlLmlkKTtcbiAgICBjb25zdCBsYXN0ID0gdGhpcy5jdXJyZW50O1xuXG4gICAgLy8gLmFjdGl2ZSBpcyBjYXB0dXJlZCAmIGNsZWFyZWRcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuZWxlbWVudHMuYWN0aXZlLmlubmVySFRNTDtcbiAgICB0aGlzLmVsZW1lbnRzLmFjdGl2ZS5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgLy8gd2hhdGV2ZXIgd2FzIGluIGFjdGl2ZSBpcyBtb3ZlZCB1cCBpbnRvIGhpc3RvcnlcbiAgICB0aGlzLmVsZW1lbnRzLmhpc3RvcnkuaW5uZXJIVE1MICs9IGV4aXN0aW5nO1xuXG4gICAgLy8gaWYgdGhlcmUgaXMgdXNlclRleHQsIGl0IGlzIGFkZGVkIHRvIC5oaXN0b3J5XG4gICAgaWYgKHVzZXJUZXh0KSB7XG4gICAgICB0aGlzLnJlbmRlclVzZXJNZXNzYWdlKFxuICAgICAgICBsYXN0LFxuICAgICAgICB1c2VyVGV4dCxcbiAgICAgICAgcyA9PiAodGhpcy5lbGVtZW50cy5oaXN0b3J5LmlubmVySFRNTCArPSBzKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBUaGUgbmV3IHBhc3NhZ2UgaXMgcmVuZGVyZWQgYW5kIHBsYWNlZCBpbiAuYWN0aXZlXG4gICAgLy8gYWZ0ZXIgYWxsIHJlbmRlcnMsIHVzZXIgb3B0aW9ucyBhcmUgZGlzcGxheWVkXG4gICAgYXdhaXQgdGhpcy5yZW5kZXJQYXNzYWdlKFxuICAgICAgcGFzc2FnZSxcbiAgICAgIHMgPT4gKHRoaXMuZWxlbWVudHMuYWN0aXZlLmlubmVySFRNTCArPSBzKVxuICAgICk7XG4gICAgaWYgKHBhc3NhZ2UuaGFzVGFnKFwiYXV0b1wiKSkge1xuICAgICAgLy8gYXV0byBhZHZhbmNlIGlmIHRoZSBhdXRvIHRhZyBpcyBzZXQsIHNraXBwaW5nIGFueXRoaW5nIHRoYXRcbiAgICAgIC8vIGNvdWxkIHBhdXNlIG91ciBvcGVyYXRpb25cbiAgICAgIHRoaXMuYWR2YW5jZSh0aGlzLmZpbmRQYXNzYWdlKHBhc3NhZ2UubGlua3NbMF0udGFyZ2V0KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaWYgcHJvbXB0IGlzIHNldCBmcm9tIHRoZSBjdXJyZW50IG5vZGUsIGVuYWJsZSBmcmVldGV4dFxuICAgIGlmICh0aGlzLnNob3dQcm9tcHQpIHtcbiAgICAgIHRoaXMucmVuZGVyVGV4dElucHV0KHBhc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlckNob2ljZXMocGFzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGV4dCBhcyBpZiBpdCBjYW1lIGZyb20gdGhlIHVzZXJcbiAgICovXG4gIHJlbmRlclVzZXJNZXNzYWdlID0gYXN5bmMgKHBpZCwgdGV4dCwgcmVuZGVyZXIpID0+IHtcbiAgICBhd2FpdCByZW5kZXJlcihcbiAgICAgIFVTRVJfUEFTU0FHRV9UTVBMKHtcbiAgICAgICAgcGlkLFxuICAgICAgICB0ZXh0XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmVuZGVyIGEgVHdpbmUrQ2hhdGJvb2sgcGFzc2FnZSBvYmplY3RcbiAgICovXG4gIHJlbmRlclBhc3NhZ2UgPSBhc3luYyAocGFzc2FnZSwgcmVuZGVyZXIpID0+IHtcbiAgICBjb25zdCBzcGVha2VyID0gcGFzc2FnZS5nZXRTcGVha2VyKCk7XG4gICAgbGV0IHN0YXRlbWVudHMgPSBwYXNzYWdlLnJlbmRlcigpO1xuICAgIGxldCBuZXh0ID0gc3RhdGVtZW50cy5zaGlmdCgpO1xuICAgIHRoaXMuc2hvd1R5cGluZygpO1xuICAgIHdoaWxlIChuZXh0KSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gT1RIRVJfUEFTU0FHRV9UTVBMKHtcbiAgICAgICAgc3BlYWtlcixcbiAgICAgICAgdGFnczogcGFzc2FnZS50YWdzLFxuICAgICAgICB0ZXh0OiBuZXh0XG4gICAgICB9KTtcbiAgICAgIGF3YWl0IGRlbGF5KHRoaXMuY2FsY3VsYXRlRGVsYXkobmV4dCkpOyAvLyB0b2RvXG4gICAgICBhd2FpdCByZW5kZXJlcihjb250ZW50KTtcbiAgICAgIG5leHQgPSBzdGF0ZW1lbnRzLnNoaWZ0KCk7XG4gICAgfVxuICAgIHRoaXMuaGlkZVR5cGluZygpO1xuICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfTtcblxuICAvKipcbiAgICogQSByb3VnaCBmdW5jdGlvbiBmb3IgZGV0ZXJtaW5pbmcgYSB3YWl0aW5nIHBlcmlvZCBiYXNlZCBvbiBzdHJpbmcgbGVuZ3RoXG4gICAqL1xuICBjYWxjdWxhdGVEZWxheSA9IHR4dCA9PiB7XG4gICAgY29uc3QgdHlwaW5nRGVsYXlSYXRpbyA9IDAuMztcbiAgICBjb25zdCByYXRlID0gMjA7IC8vIG1zXG4gICAgcmV0dXJuIHR4dC5sZW5ndGggKiByYXRlICogdHlwaW5nRGVsYXlSYXRpbztcbiAgfTtcblxuICAvKipcbiAgICogU2hvd3MgdGhlIHR5cGluZyBpbmRpY2F0b3JcbiAgICovXG4gIHNob3dUeXBpbmcgPSAoKSA9PiB7XG4gICAgZmluZCh0aGlzLmRvY3VtZW50LCB0eXBpbmdJbmRpY2F0b3IpLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgfTtcblxuICAvKipcbiAgICogSGlkZXMgdGhlIHR5cGluZyBpbmRpY2F0b3JcbiAgICovXG4gIGhpZGVUeXBpbmcgPSAoKSA9PiB7XG4gICAgZmluZCh0aGlzLmRvY3VtZW50LCB0eXBpbmdJbmRpY2F0b3IpLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTY3JvbGxzIHRoZSBkb2N1bWVudCBhcyBmYXIgYXMgcG9zc2libGUgKGJhc2VkIG9uIGhpc3RvcnkgY29udGFpbmVyJ3MgaGVpZ2h0KVxuICAgKi9cbiAgc2Nyb2xsVG9Cb3R0b20gPSAoKSA9PiB7XG4gICAgY29uc3QgaGlzdCA9IGZpbmQodGhpcy5kb2N1bWVudCwgXCIjcGhpc3RvcnlcIik7XG4gICAgZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxUb3AgPSBoaXN0Lm9mZnNldEhlaWdodDtcbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBjaG9pY2VzIHBhbmVsXG4gICAqL1xuICByZW1vdmVDaG9pY2VzID0gKCkgPT4ge1xuICAgIGNvbnN0IHBhbmVsID0gZmluZCh0aGlzLmRvY3VtZW50LCBzZWxlY3RSZXNwb25zZXMpO1xuICAgIHBhbmVsLmlubmVySFRNTCA9IFwiXCI7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgdGhlIGNob2ljZXMgcGFuZWwgd2l0aCBhIHNldCBvZiBvcHRpb25zIGJhc2VkIG9uIHBhc3NhZ2UgbGlua3NcbiAgICovXG4gIHJlbmRlckNob2ljZXMgPSBwYXNzYWdlID0+IHtcbiAgICB0aGlzLnJlbW92ZUNob2ljZXMoKTtcbiAgICBjb25zdCBwYW5lbCA9IGZpbmQodGhpcy5kb2N1bWVudCwgc2VsZWN0UmVzcG9uc2VzKTtcbiAgICBwYXNzYWdlLmxpbmtzLmZvckVhY2gobCA9PiB7XG4gICAgICBwYW5lbC5pbm5lckhUTUwgKz0gYDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBjbGFzcz1cInVzZXItcmVzcG9uc2VcIiBkYXRhLXBhc3NhZ2U9XCIke2VzY2FwZShcbiAgICAgICAgbC50YXJnZXRcbiAgICAgICl9XCI+JHtsLmRpc3BsYXl9PC9hPmA7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbmRlcnMgYSBmcmVlLXRleHQgaW5wdXQgYmFzZWQgb24gc2hvd1Byb21wdCBzZXR0aW5nc1xuICAgKi9cbiAgcmVuZGVyVGV4dElucHV0ID0gcGFzc2FnZSA9PiB7XG4gICAgdGhpcy5yZW1vdmVDaG9pY2VzKCk7XG4gICAgY29uc3QgcGFuZWwgPSBmaW5kKHRoaXMuZG9jdW1lbnQsIHNlbGVjdFJlc3BvbnNlcyk7XG4gICAgcGFuZWwuaW5uZXJIVE1MID0gYDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidXNlci1pbnB1dFwiIHBsYWNlaG9sZGVyPVwiJHtcbiAgICAgIHRoaXMuc2hvd1Byb21wdC5wbGFjZWhvbGRlclxuICAgIH1cIiAvPjxidXR0b24gZGF0YS1wYXNzYWdlPVwiJHtlc2NhcGUoXG4gICAgICBwYXNzYWdlLmxpbmtzWzBdLnRhcmdldFxuICAgICl9XCI+Jmd0OzwvYnV0dG9uPmA7XG4gIH07XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIHRleHQtaW5wdXQgaW5zdGVhZCBvZiBzdGFuZGFyZCBjaG9pY2VzXG4gICAqL1xuICBwcm9tcHQgPSAoc2F2ZUFzLCBwbGFjZWhvbGRlcikgPT4gKHRoaXMuc2hvd1Byb21wdCA9IHsgc2F2ZUFzLCBwbGFjZWhvbGRlciB9KTtcblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY3VzdG9tIGRpcmVjdGl2ZSBmb3IgdGhpcyBzdG9yeVxuICAgKiBTaWduYXR1cmUgb2YgKGRpcmVjdGl2ZUNvbnRlbnQsIG91dHB1dFRleHQsIHN0b3J5LCBwYXNzYWdlLCBuZXh0KVxuICAgKi9cbiAgZGlyZWN0aXZlID0gKGlkLCBjYikgPT4ge1xuICAgIGlmICghdGhpcy5kaXJlY3RpdmVzW2lkXSkge1xuICAgICAgdGhpcy5kaXJlY3RpdmVzW2lkXSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmRpcmVjdGl2ZXNbaWRdLnB1c2goY2IpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBTdG9yeTtcbiIsImltcG9ydCBTdG9yeSBmcm9tIFwiLi90d2luZS9TdG9yeVwiO1xuXG4od2luID0+IHtcbiAgaWYgKHR5cGVvZiB3aW4gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW4uZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHdpbmRvdy5nbG9iYWxFdmFsID0gZXZhbDtcbiAgICAgIHdpbmRvdy5zdG9yeSA9IG5ldyBTdG9yeSh3aW4pO1xuICAgICAgd2luZG93LnN0b3J5LnN0YXJ0KCk7XG4gICAgfSk7XG4gIH1cbn0pKHdpbmRvdyB8fCB1bmRlZmluZWQpO1xuIl0sIm5hbWVzIjpbImdsb2JhbCIsIlRPS0VOX0VTQ0FQRURfT0NUTyIsIkJMT0NLX0RJUkVDVElWRSIsIklOTElORV9ESVJFQ1RJVkUiLCJCTE9DS19DT01NRU5UIiwiSU5MSU5FX0NPTU1FTlQiLCJJU19FWFRFUk5BTF9VUkwiLCJMSU5LX1BBVFRFUk4iLCJmaW5kU3RvcnkiLCJ3aW4iLCJzdG9yeSIsInN0YXRlIiwiZXNjYXBlT2N0b3MiLCJzIiwicmVwbGFjZSIsInJlc3RvcmVPY3RvcyIsInN0cmlwQ29tbWVudHMiLCJleHRyYWN0RGlyZWN0aXZlcyIsImRpcmVjdGl2ZXMiLCJtYXRjaCIsImRpciIsImNvbnRlbnQiLCJwdXNoIiwibmFtZSIsInRyaW0iLCJyZW5kZXJQYXNzYWdlIiwicGFzc2FnZSIsInNvdXJjZSIsInJlc3VsdCIsImxpbmtzIiwidCIsImRpc3BsYXkiLCJ0YXJnZXQiLCJiYXJJbmRleCIsImluZGV4T2YiLCJyaWdodEFyckluZGV4IiwibGVmdEFyckluZGV4Iiwic3Vic3RyIiwidGVzdCIsImZvckVhY2giLCJkIiwicnVuIiwiaGFzVGFnIiwicHJvbXB0cyIsInByZWZpeFRhZyIsImxlbmd0aCIsInByb21wdCIsInNwbGl0IiwiUGFzc2FnZSIsImNvbnN0cnVjdG9yIiwiaWQiLCJ0YWdzIiwic3BlYWtlclRhZyIsImZpbmQiLCJzeXN0ZW1UYWciLCJwZngiLCJhc0RpY3QiLCJmaWx0ZXIiLCJtYXAiLCJyZWR1Y2UiLCJhIiwidGFnRGljdCIsInVuZXNjYXBlIiwic3RyIiwid2luZG93IiwiSU5GSU5JVFkiLCJzeW1ib2xUYWciLCJmcmVlR2xvYmFsIiwiZnJlZVNlbGYiLCJyb290IiwiYmFzZVByb3BlcnR5T2YiLCJvYmplY3RQcm90byIsIm9iamVjdFRvU3RyaW5nIiwiU3ltYm9sIiwic3ltYm9sUHJvdG8iLCJzeW1ib2xUb1N0cmluZyIsImJhc2VUb1N0cmluZyIsImlzU3ltYm9sIiwiaXNPYmplY3RMaWtlIiwidG9TdHJpbmciLCJzZWxlY3RQYXNzYWdlcyIsInNlbGVjdENzcyIsInNlbGVjdEpzIiwic2VsZWN0QWN0aXZlTGluayIsInNlbGVjdEFjdGl2ZUJ1dHRvbiIsInNlbGVjdEFjdGl2ZUlucHV0Iiwic2VsZWN0QWN0aXZlIiwic2VsZWN0SGlzdG9yeSIsInNlbGVjdFJlc3BvbnNlcyIsInR5cGluZ0luZGljYXRvciIsIklTX05VTUVSSUMiLCJpc051bWVyaWMiLCJVU0VSX1BBU1NBR0VfVE1QTCIsInRleHQiLCJPVEhFUl9QQVNTQUdFX1RNUEwiLCJzcGVha2VyIiwiam9pbiIsImRlbGF5IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiY3R4IiwicXVlcnlTZWxlY3RvciIsImZpbmRBbGwiLCJxdWVyeVNlbGVjdG9yQWxsIiwiU3RvcnkiLCJzcmMiLCJ1c2VyU3R5bGVzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiYm9keSIsImFwcGVuZENoaWxkIiwidXNlclNjcmlwdHMiLCJnbG9iYWxFdmFsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJtYXRjaGVzIiwiYWR2YW5jZSIsImZpbmRQYXNzYWdlIiwiZ2V0QXR0cmlidXRlIiwidmFsdWUiLCJzaG93UHJvbXB0Iiwic3RhcnRzQXQiLCJpZE9yTmFtZSIsInBhc3NhZ2VzIiwicCIsInVzZXJUZXh0IiwiaGlzdG9yeSIsImxhc3QiLCJjdXJyZW50IiwiZXhpc3RpbmciLCJlbGVtZW50cyIsImFjdGl2ZSIsInJlbmRlclVzZXJNZXNzYWdlIiwicmVuZGVyVGV4dElucHV0IiwicmVuZGVyQ2hvaWNlcyIsInBpZCIsInJlbmRlcmVyIiwic2Nyb2xsVG9Cb3R0b20iLCJnZXRTcGVha2VyIiwic3RhdGVtZW50cyIsInJlbmRlciIsIm5leHQiLCJzaGlmdCIsInNob3dUeXBpbmciLCJjYWxjdWxhdGVEZWxheSIsImhpZGVUeXBpbmciLCJ0eHQiLCJ0eXBpbmdEZWxheVJhdGlvIiwicmF0ZSIsInN0eWxlIiwidmlzaWJpbGl0eSIsImhpc3QiLCJzY3JvbGxpbmdFbGVtZW50Iiwic2Nyb2xsVG9wIiwib2Zmc2V0SGVpZ2h0IiwicGFuZWwiLCJyZW1vdmVDaG9pY2VzIiwibCIsImVzY2FwZSIsInBsYWNlaG9sZGVyIiwic2F2ZUFzIiwiY2IiLCJpbXBsZW1lbnRhdGlvbiIsImNyZWF0ZUhUTUxEb2N1bWVudCIsInBhcnNlSW50IiwiZWwiLCJldmVudCIsImV2YWwiLCJzdGFydCIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7RUFBQSxTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtJQUN4QyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7TUFDZCxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7UUFDOUIsS0FBSyxFQUFFLEtBQUs7UUFDWixVQUFVLEVBQUUsSUFBSTtRQUNoQixZQUFZLEVBQUUsSUFBSTtRQUNsQixRQUFRLEVBQUUsSUFBSTtPQUNmLENBQUMsQ0FBQztLQUNKLE1BQU07TUFDTCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ2xCOztJQUVELE9BQU8sR0FBRyxDQUFDO0dBQ1o7O0VBRUQsa0JBQWMsR0FBRyxlQUFlOzs7O0VDZmhDOzs7Ozs7Ozs7O0VBVUEsSUFBSSxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMs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
