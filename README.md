# Botscripten

**A modified Trialogue/Twine engine specifically for Building, Testing, and Exporting conversations as Minimal HTML5**

![Botscripten logo](dist/Twine2/Botscripten/icon.svg)

[![Story Format Version](https://img.shields.io/badge/StoryFormat-0.5.1-blue)](/dist/Twine2)
[![npm](https://img.shields.io/npm/v/@aibex/botscripten)](https://www.npmjs.com/package/@aibex/botscripten)
[![Twine Version](https://img.shields.io/badge/Twine-2.2.0+-blueviolet)](http://twinery.org/)
[![CircleCI](https://circleci.com/gh/aibexhq/botscripten/tree/master.svg?style=shield)](https://circleci.com/gh/aibexhq/botscripten/tree/master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=aibexhq/botscripten)](https://dependabot.com)

**Upgrading? Check the [Changelog](/CHANGELOG.md)**

Botscripten is a chat-style [Twine](http://twinery.org) Story Fromat based on [Trialogue](https://github.com/phivk/trialogue) and its predecessors. Unlike other Twine sources, Botscripten is optimized for **an external runtime**. That is, while you can use Botscripten for Interactive Fiction, that's not this story format's intent.

Botscripten is also available as an npm parser, able to handle Passage-specific features found in the Botscripten format. It's available via `npm install @aibex/botscripten` or `yarn add @aibex/botscripten`.

✅ You want to use [Twine](http://twinery.org) to author complex branching dialogue <br>
✅ You want a conversation format (think chatbot) <br>
✅ You want simple built-in testing to step through flows and get feedback <br>
✅ You want a minimal output format for an **external runtime**

If "yes", then Botscripten is worth looking into.

🔮 [A Sample Conversation](http://htmlpreview.github.io/?https://github.com/aibexhq/botscripten/blob/master/examples/sample.html)

Botscripten comes with two distinct flavors: **An Interactive Output** for testing and stepping through conversations in a pseudo chat interface based on the Trialogue code, and built in proofing version. External JavaScript keeps the output file small, making it easy to use the pure HTML in other systems.

- [Botscripten](#botscripten)
- [🚀 Setup and Your First "Chat"](#-setup-and-your-first-chat)
  - [Add Botscripten and BotscriptenViewer as a Twine Story Formats](#add-botscripten-and-botscriptenviewer-as-a-twine-story-formats)
  - [Create your first chat story](#create-your-first-chat-story)
- [🏷 Botscripten Tags](#-botscripten-tags)
- [🙈 Comments in Botscripten](#-comments-in-botscripten)
- [🗂 Recipies](#-recipies)
  - ["Special" Comments (Directives)](#special-comments-directives)
  - [Conditional Branching (cycles, etc)](#conditional-branching-cycles-etc)
  - [Scripting Directives in BotscriptenViewer](#scripting-directives-in-botscriptenviewer)
- [📖 Node Module Documentation](#-node-module-documentation)
- [⚠️ Why would you use Botscripten over (Insert Twine Format)?](#️-why-would-you-use-botscripten-over-insert-twine-format)
- [Developing on Botscripten](#developing-on-botscripten)
  - [Local Development](#local-development)
  - [Building for Release](#building-for-release)
- [Acknowledgements](#acknowledgements)

# 🚀 Setup and Your First "Chat"

## Add Botscripten and BotscriptenViewer as a Twine Story Formats

![add](/docs/add-format.gif)

1. From the Twine menu, select `Formats`
2. Then, select the `Add a New Format` tab
3. Paste `https://cdn.jsdelivr.net/gh/aibexhq/botscripten@0.5.1/dist/Twine2/Botscripten/format.js`
4. Click `Add`

Once you've done this, you will have access to the Botscripten story format in Twine. If you're migrating, be sure to check the [Changelog](CHANGELOG.md) for a migration guide, as migrating to 0.5.0 from an earlier version can introduce breaking changes.

Upgrading is as simple as removing your old Botscripten and adding the new URL above. You can then convert any existing story to the new format.

## Create your first chat story

![create a chat](/docs/trialogue-create.gif)

1. Create a story in the Twine editor.
2. Edit the start passage to include:
   - Title (e.g. start)
   - Passage text (e.g. "Hi 👋")
   - One or more links (e.g. `[[What's your name?]]`)
   - Speaker tag (e.g. `speaker-bot`). This will display the speaker's name (in this case `bot`) in standalone viewer
3. Edit the newly created passage(s) to include:
   - Passage text (e.g. "My name is Bot")
   - One or more links (e.g. `[[Back to start->start]]`)
   - Speaker tag (e.g. `speaker-bot`)
4. Hit `Play` to test the result (Using BotscriptenViewer)

# 🏷 Botscripten Tags

Botscripten is designed to work exclusively with Twine's tag system. That means no code in your conversation nodes. This is important because behind the scenes, many other Twine formats convert Passages containing `<% ... %>` into JavaScript code, defeating the goal of portability.

The following passage tags are supported by BotscriptenViewer. It is assumed that anyone consuming a Botscripten formatted Twine story will also support these tags.

| tag                    | explanation                                                                                                                                                                                                                                                         |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `oneline`              | By default, chat bots will display one message per line, similar to an SMS conversation. If you'd like to send content as a paragraph, use the `oneline` tag. The entire Twine node will then be treated as a single message.                                       |
| `speaker-*` _(prefix)_ | The `speaker-*` tag describes "who" the message is from. For example, a tag of `speaker-bob` would imply the message should come from `bob`. The speaker tag is arbitrary, but should be consistent to identify "who" is talking.                                   |
| `wait`                 | Adding `wait` will prevent the conversation from automatically advancing. Automatic advancement happens when there is exactly 1 link to follow, and the `wait` tag is not set. The most common reason for `wait` is to present some form of "continue" to the user. |

To maintain compatibility with the [Twee 3 Specification](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md), the tags `script` and `stylesheet` should **never** be used.

# 🙈 Comments in Botscripten

The Botscripten story format allows for simple comments. Lines beginning with an octothorpe `#` are removed during the parsing process in BotscriptenViewer. These lines are made available in Botscripten should you need to attach meaning to your comments.

If you'd like to place a comment across multiple lines, you can use a triple-octothorpe `###`. Everything until the next `###` will be considered a comment.

The following are all comments in Botscripten:

```
# I'm a comment, because I have a "#" at the start of the line

# It can
# cover
# multiple lines

###
You can also use a triple # to denote a block
and everything is ommitted until the next
triple #
###

###
If you need a literal #, you can escape it with a
backslash like this: \###
###
```

# 🗂 Recipies

Below are some common challenges & solutions to writing Twine scripts in Botscripten format

## "Special" Comments (Directives)

If you look at the [onboarding example](/examples/onboarding.twee), you'll notice many of the comments contain an `@yaml` statement. While `BotscriptenViewer` doesn't care about these items (they're comments after all), any other system parsing the Twine file can read these statements out of the comment blocks.

These special comments are called **Directives** and they consist of the comment identifier (`#` or `###`) immediatly followed by `@` and a `word`. These are all Directives:

```
#@doAThing

#@make party

###@sql
INSERT INTO winners (name, time) VALUES ('you', NOW())
###
```

Anyone parsing Botscripten Twine files can assume that the regular expressions `/^#@([\S]+)(.*)/g` (inline) and `/^###@([\S]+)([\s\S]*?)###/gm` (block) will match and extract the directive and the remainder of the comment.

For consistency with BotscriptenViewer, directives should be run when a Passage is parsed, but before any tag behavior (such as `auto` or `speaker-*` are applied) This allows directives to form opinions about the Passage and it's output before rendering occurs.

There is no set definition for directives, as adding a directive to Botscripten would require **every external parser to also support it**. This is also why Botscripten is so light- there's almost no parsing being done of the individual Passages.

But if you'd like some examples, these are some directives we think are pretty useful and are worth implementing in your own conversation engine:

- `#@set <name> <value>` - A directive that sets a local variable `<name>` to value `<value>` within the conversation
- `#@increment <name> <amount>` - A directive to increment a local variable `<name>` by amount `<amount>`
- `#@end` - A directive that tells the system to end a conversation (don't put any `[[links]]` in this passage obviously!)

## Conditional Branching (cycles, etc)

Since Botscripten does not maintain a concept of state, nor have a way to script items such as cycling or conditional links, you should present **all possible branches** using the `[[link]]` syntax. This will allow you to view all permutations in Botscripten when testing conversations locally.

Conditional branching can then be implemented as a [Directive](#%22special%22-comments-directives). This gives you control outside of the Twine environment as to which link is followed under what conditions. We're partial to a `###@next ... ###` directive, but feel free to create your own!

## Scripting Directives in BotscriptenViewer

If you absolutely want to handle Directives in BotscriptenViewer, you can do so by selecting `Edit Story JavaScript` in Twine, and registering a handler for your directive. For example, this logs all `@log` directives' content to the developer tools console.

```js
story.directive("@log", function(info, rendered, passage, story) {
  console.log("LOG data from " + passage.id);
  console.log("Directive contained: " + info);
  return rendered; // return the original (or altered) output
});
```

Directives are evaluated after the Passage is parsed, but before any tag behaviors are applied.

# 📖 Node Module Documentation

Most individuals are interested in writing for the Botscripten format, not consuming it. If you are looking to read Botscripten's Twine HTML files, and are also in a node.js environment, you can install Botscripten over npm/yarn and access the parser. Parsing a valid Botscripten HTML file will yield the following:

```js
import botscripten from "@aibex/botscripten";
import fs from "fs";

const story = botscripten(fs.readFileSync("your/file.html").toString());

story = {
  name: "", // story name
  start: null, // name ID of starting story node
  startId: null, // numeric ID of starting story node
  creator: "", // creator of story file
  creatorVersion: "", // version of creator used
  ifid: "", // IFID - Interactive Fiction ID
  zoom: "", // Twine Zoom Level
  format: "", // Story Format (Botscripten / BotscriptenViewer)
  formatVersion: "", // Version of Botscripten / BotscriptenViewer used
  options: "", // Twine options
  tags: [
    {
      // A collection of tags in the following format...
      name: "", // Tag name
      color: "", // Tag color in Twine
    },
    // ...
  ],
  passages: {
    // A collection of passages in the following format...
    // pid is the passage's numeric ID
    [pid]: {
      pid: null, // The passage's numeric ID
      name: "", // The passage name
      tags: [], // An array of tags for this passage
      directives: [
        {
          // An array of Botscripten directives in the following format...
          name: "", // The directive name
          content: "", // The content in the directive, minus the name
        },
        // ...
      ],
      links: [
        {
          // Links discovered in the passage in the following format...
          display: "", // The display text for a given link
          target: "", // The destination Passage's name
        },
        // ...
      ],
      position: "", // The Twine position of this passage
      size: "", // The Twine size of this passage
      content: "", // The passage content minus links, comments, and directives
    },
    // ...
  },
  passageIndex: {
    [name]: id, // A lookup index of [Passage Name]: passageNumericId
    //...
  },
};
```

# ⚠️ Why would you use Botscripten over (Insert Twine Format)?

First off, every Twine format I've worked with is amazing and super thougtful. If your goal is to create interactive fiction, self-contained tutorials, etc, you should just use Trialogue, Harlowe, or Sugarcube. However, if you're using Twine as a conversation editor (and you are more interested in the `tw-passagedata` blocks and the data structure behind Twine) Botscripten may be for you.

- **Zero `story.*` Calls** To be as portable as possible, No template tags may be used. That means your code cannot contain the `<% ... %>` blocks seen in Trialogue/Paloma. These tags are incredibly difficult to parse/lex, because they assume a JavaScript environmemt at runtime. And since you don't know where your Twine file is going to run, you must decouple the programming from the data.
- **Tags drive behavior** Because of that first restriction, we need a way to perform actions within Botscripten. Thankfully, Twine's Tag system is up to the task. **We strive to keep the tag count low to minimize the number of reserved tags in the system.**
- **Dev Experience** Iterating on Twine templates is hard. A lot of time was spent to make the dev experience as simple as (1) put [tweego](https://www.motoslave.net/tweego/) in your executable path, and (2) type `yarn dev`.
- **Multiple Formats** Botscripten provides two syncrhonized formats from the same repository. Features in the proofing / html5-min version will also show up simultaneously in the Interactive one.

# Developing on Botscripten

## Local Development

1. Acquire [tweego](https://www.motoslave.net/tweego/) and place it in your development path.
2. Check out this repository
3. run `yarn install` to install your dependencies
4. run `yarn dev` to start developing using the twee files in the `examples` folder

- Examples are available under `http://localhost:3000`
- TEST_Botscripten can be installed in Twine from `http://localhost:3001/Botscripten`
- When you are done developing/testing, be sure to remove the TEST_Botscripten format. If you forget, just restart the dev server so Twine doesn't complain every time you start it up

For local testing convienence, we have a `yarn tweego` command. It ensures that Botscripten is in the `tweego` path before performing a build.

As an example, the sample document was converted from Twine to Twee using the command `yarn tweego -d ./stories/sample.html -o ./examples/sample.twee`. (You may need to manually edit the html file to set the format to "Botscripten")

## Building for Release

1. Be current on `master`
2. `yarn install` and `yarn build`
3. Commit all files
4. `npm run-script release` (yarn isn't reliable with this)

# Acknowledgements

Botscripten would not be possible without the amazing work of [Philo van Kemenade](https://github.com/phivk) for imagining Twine as a conversational tool, [M. C. DeMarco](http://mcdemarco.net/tools/scree/paloma/) who reimagined the original "Jonah" format for Twine 2, and [Chris Klimas](https://www.patreon.com/klembot/) creator and current maintainer of Twine.

Botscripten is sponsored by [Aibex](https://www.aibex.com). Love your career.
