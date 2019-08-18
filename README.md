# Chatbook

**A modified Trialogue/Twine engine specifically for Building, Testing, and Exporting conversations as Minimal HTML5**

![Chatbook logo](dist/Twine2/Chatbook/icon.svg)

Chatbook is a chat-style Twine Story Fromat based on [Trialogue](https://github.com/phivk/trialogue), which is based on [Paloma](http://mcdemarco.net/tools/scree/paloma/), which is based on [Snowman](https://bitbucket.org/klembot/snowman-2/).

It comes with two distinct flavors: **An XML Output** (Chatbook) for using your twine files in other systems, and **An HTML Output** (ChatbookViewer) For testing/walking through conversations in a pseudo chat interface based on the Trialogue code.

👉 Demo story: [http://htmlpreview.github.io/?https://github.com/jakobo/chatbook/blob/master/examples/onboarding.html](View a sample "onboarding" chat transcript)
👉 Demo Html5: [http://htmlpreview.github.io/?https://github.com/jakobo/chatbook/blob/master/examples/onboarding.min.html](The corresponding Minimalist output)

You can then use [any html5-compliant parser](https://en.wikipedia.org/wiki/Comparison_of_HTML_parsers) and extract the contents between `<twine>...</twine>`. If you're staying in the node.js ecosystem, [jsdom](https://www.npmjs.com/package/jsdom) is an excellent choice.

### Add Chatbook as a Twine Story Format

![add](/docs/add-format.gif)

1. From the Twine menu, select `Formats`
2. Then, select the `Add a New Format` tab
3. Paste `https://cdn.jsdelivr.net/gh/jakobo/chatbook@master/dist/Twine2/Chatbook/format.js` and click `Add`
4. Then, `https://cdn.jsdelivr.net/gh/jakobo/chatbook@master/dist/Twine2/ChatbookViewer/format.js` and click `Add`

Once you've done this, you can either select Chatbook (XML) or ChatbookViewer (HTML) as your default format.

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

## ⚠️ Why would you use Chatbook over Trialogue?

First off, Trialogue is _amazing_. If your goal is to create interactive fiction, interactive tutorials, and more, you should just use Trialogue. However, if you're using Twine as a conversation editor (and you are more interested in the `tw-passagedata` blocks and `twee` file format output, Chatbook may be for you).

- **Zero `story.*` Calls** To be as portable as possible, you **should not** use any Trialogue/Paloma template tags (the `<% ... %>` seen in Trialogue docs). These tags are incredibly difficult to parse/lex, because they allow for arbitrary execution of JavaScript. And since you don't know where your `.tw` file is going to run, you must decouple the programming from the data.
- **Tags drive behavior** Because of that first restriction, we need a way to perform actions within Chatbook. Thankfully, Twine's Tag system is up to the task. The following tags have special meaning in the Chatbook format:
  - `auto`: Adding `auto` will automatically advance the conversation to the first link discovered in the conversation (using any of the standard `[[link]]`, `[[display -> destination]]` or `[[destination <- display]]` formats). This allows you to create more granularity between your conversation nodes. **this replaces the Trialogue `story.showDelayed` function**
  - `multiline`: Adding `multiline` turns one speaker line into many. If you have more of an SMS-style of writing, the `multiline` tag will treat line breaks as new messages from the same speaker.
  - `no-markdown`: The `no-markdown` tag disables parsing with the [marked](https://github.com/chjj/marked/) markdown parser. This tag is also assumed when you use the `system` tag (as system calls are not expected to be formatted)
  - `speaker-*` _(prefix)_: The `speaker-*` tag is still supported, describing "who" the message is from. Since tags can only contain `[a-z0-9_\-]`, it's recommended that you use an ID here that you can reference elsewhere
  - `prompt-*` _(prefix)_: The `prompt-*` tag presents the user with a text box for input, saved to the remainder of the tag. So a tag of `prompt-firstName` implies that you want to prompt the user for text, which you wish to save as `firstName`. Upon answering the prompt, the first `[[link]]` encountered will be followed to continue the conversation.
  - `system`: Use the `system` tag when you want to tag something as not from a speaker. It will display in the chat, but can be easily identified as non-chat related data. For example, this can contain directives for your external game engine.
- **Dev Experience** Iterating on Twine templates is hard. Instead of copying things around, put [tweego](https://www.motoslave.net/tweego/) in your executable path, and type `yarn dev` to let node take care of building Chatbook, creating the `format.js`, and automatically regenerating every test conversation for you. Chatbook's written in ES6, combined with rollup & babel.
- **Minimal HTML5 Output** If your final destination isn't an HTML interface, use the `Chatbook` interfance instead of the ChatbookViewer. The resulting code is super-lean, proofing friendly, and HTML5 compliant.

## Developing on Chatbook

1. Acquire [tweego](https://www.motoslave.net/tweego/) and place it in your development path.
2. Check out this repository
3. run `yarn install` to install your dependencies
4. run `yarn dev` to start developing using the twee files in the `examples` folder
