# Chatbook

**A modified Trialogue/Twine engine specifically for Building, Testing, and Exporting conversations as Minimal HTML5**

![Chatbook logo](dist/Twine2/Chatbook/icon.svg)

Chatbook is a chat-style [Twine](http://twinery.org) Story Fromat based on [Trialogue](https://github.com/phivk/trialogue) and its predecessors.

It comes with two distinct flavors: **A Minimal Output** (Chatbook) for using your twine files in other systems, and **An Interactive Output** (ChatbookViewer) For testing and stepping through conversations in a pseudo chat interface based on the Trialogue code.

👉 Demo: [/examples/onboarding.html](http://htmlpreview.github.io/?https://github.com/jakobo/chatbook/blob/master/examples/onboarding.html) <br>
📂 Min Version: [/examples/onboarding.min.html](http://htmlpreview.github.io/?https://github.com/jakobo/chatbook/blob/master/examples/onboarding.min.html) <br>
✏️ View Twee: [/examples/onboarding.twee](/examples/onboarding.twee)

The Min version is specifically designed to work with [any html5-compliant parser](https://en.wikipedia.org/wiki/Comparison_of_HTML_parsers) and extract the contents between `<twine>...</twine>` with minimal bloat. If you're staying in the node.js ecosystem, [jsdom](https://www.npmjs.com/package/jsdom) is an excellent choice. 🎉

- [Chatbook](#chatbook)
  - [🚀 Setup and Your First "Chat"](#%f0%9f%9a%80-setup-and-your-first-%22chat%22)
    - [Add Chatbook as a Twine Story Format](#add-chatbook-as-a-twine-story-format)
    - [Create your first chat story](#create-your-first-chat-story)
  - [🏷 Chatbook Tags](#%f0%9f%8f%b7-chatbook-tags)
  - [⚠️ Why would you use Chatbook over Trialogue?](#%e2%9a%a0%ef%b8%8f-why-would-you-use-chatbook-over-trialogue)
  - [Developing on Chatbook](#developing-on-chatbook)

## 🚀 Setup and Your First "Chat"

### Add Chatbook as a Twine Story Format

![add](/docs/add-format.gif)

1. From the Twine menu, select `Formats`
2. Then, select the `Add a New Format` tab
3. Paste `https://cdn.jsdelivr.net/gh/jakobo/chatbook@0.0.1/dist/Twine2/Chatbook/format.js`
4. Click `Add`
5. Then, `https://cdn.jsdelivr.net/gh/jakobo/chatbook@0.0.1/dist/Twine2/ChatbookViewer/format.js`
6. Click `Add`

Once you've done this, you can either select Chatbook or ChatbookViewer (Interactive) as your default format.

### Create your first chat story

![create a chat](/docs/trialogue-create.gif)

1. Create a story in the Twine editor.
2. Edit the start passage to include:
   - Title (e.g. start)
   - Passage text (e.g. "Hi 👋")
   - One or more links (e.g. `[[What's your name?]]`)
   - Speaker tag (e.g. `speaker-bot`). This will display the speaker's name (in this case `bot`) in above their passages. It also sets a `data-speaker="bot"` attribute on the passage's HTML element, which can be used for styling.
3. Edit the newly created passage(s) to include:
   - Passage text (e.g. "My name is Bot")
   - One or more links (e.g. `[[Back to start->start]]`)
   - Speaker tag (e.g. `speaker-bot`)
4. Hit `Play` to test the result (Using ChatbookViewer)

## 🏷 Chatbook Tags

Chatbook is designed to work exclusively with tags. That means no `<% ... %>` in your conversation nodes. This is important because behind the scenes, those `<% ... %>` blocks were getting converted to pure JavaScript, making it hard to port the behavior to other systems.

Tags provide just enough structure for the most common operations you'd want to do in a chat system. They are:

| tag                    | explanation                                                                                                                                                                                                                                                                                                                                                                              |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auto`                 | Adding `auto` will automatically advance the conversation to the **first** link discovered in the conversation (using any of the standard `[[link]]`, `[[display -> destination]]` or `[[destination <- display]]` formats). This allows you to create more granularity between your conversation nodes. **this is a direct replacement for the Trialogue `story.showDelayed` function** |
| `multiline`            | Adding `multiline` turns one speaker line into many. If you have more of an SMS-style of writing, the `multiline` tag will treat line breaks as new messages from the same speaker.                                                                                                                                                                                                      |
| `no-markdown`          | The `no-markdown` tag disables parsing with the [marked](https://github.com/chjj/marked/) markdown parser. This tag is also assumed when you use the `system` tag (as system calls are not expected to be formatted)                                                                                                                                                                     |
| `speaker-*` _(prefix)_ | The `speaker-*` tag describes "who" the message is from                                                                                                                                                                                                                                                                                                                                  |
| `system`               | Use the `system` tag when you want to tag something as not from a speaker. It will display in the chat, but can be easily identified as non-chat related data. For example, this can contain directives for your external game engine.                                                                                                                                                   |
| `prompt-*` _(prefix)_  | The `prompt-*` tag presents the user with a text box for input, saved to the remainder of the tag. So a tag of `prompt-firstName` implies that you want to prompt the user for text, which you wish to save as `firstName`. Upon answering the prompt, the first `[[link]]` encountered will be followed to continue the conversation.                                                   |

The following tags are available:

## ⚠️ Why would you use Chatbook over Trialogue?

First off, Trialogue is _amazing_. If your goal is to create interactive fiction, self-contained tutorials, etc, you should just use Trialogue. However, if you're using Twine as a conversation editor (and you are more interested in the `tw-passagedata` blocks and pseudo-xml Twine generates) Chatbook may be for you.

- **Zero `story.*` Calls** To be as portable as possible, you **should not** use any Trialogue/Paloma template tags (the `<% ... %>` seen in Trialogue docs). These tags are incredibly difficult to parse/lex, because they allow for arbitrary execution of JavaScript. And since you don't know where your Twine file is going to run, you must decouple the programming from the data.
- **Tags drive behavior** Because of that first restriction, we need a way to perform actions within Chatbook. Thankfully, Twine's Tag system is up to the task.
- **Dev Experience** Iterating on Twine templates is hard. A lot of time was spent to make the dev experience as simple as (1) put [tweego](https://www.motoslave.net/tweego/) in your executable path, and (2) type `yarn dev`.
- **Multiple Formats** Chatbook provides two syncrhonized formats from the same repository. Features in the proofing / html5-min version will also show up simultaneously in the Interactive one.

## Developing on Chatbook

1. Acquire [tweego](https://www.motoslave.net/tweego/) and place it in your development path.
2. Check out this repository
3. run `yarn install` to install your dependencies
4. run `yarn dev` to start developing using the twee files in the `examples` folder
