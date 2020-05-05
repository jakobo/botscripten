# Botscripten + Twine

**Upgrading? Check the [Changelog](/CHANGELOG.md)**

# 🚀 Setup

1. Either install twine from [twinery.org](https://twinery.org) or use the web version
2. On the Twine home screen, select `Formats` and choose the `Add a New Format` tab
3. Paste `https://cdn.jsdelivr.net/gh/aibex/botscripten@master/dist/Twine2/Botscripten/format.js` into the text box and click `Add`
4. Return to the `Story Formats` tab and select the new "Botscripten" Story format by Aibex, Inc

![adding a story format](/docs/add-format.gif)

# 💬 Making Your First Conversation (tutorial)

## Add a New Story

With the above setup complete, you can select the green `+ Story` from the right-hand menu. Twine will ask you for a name. Let's call it `My Test Conversation` for now. Once you've selected a name, Twine's editor will open.

You'll now see an empty box called **Untitled Passage**. Twine works off of a concept called **Passages**. Every passage must have a title, and the default is called "Untitled Passage". Let's change it to something more appropriate.

## Your First Passage

1. Double Click the "Untitled Passage" to open up the **Passage Editor**
2. Since this is the start, let's rename this passage to `Start`
3. Finally, let's put some text into the content area. If you're not feeling creative at the moment, "Hello!" works.
4. Close the **Passage Editor** and hit the **Play** button. Twine will open a new window with... not much yet.

![empty conversation](/docs/tutorial/01-empty-conversation.png)

The reason we don't see anything yet is we haven't told Botscripten **who** is supposed to be speaking. By default, **nothing is said** until you specifically tell it to. Let's go back to our Twine editor, and double click on "Start", our passage from earlier.

1. Click `+ Tag` and add the text `speaker-bot`
2. 4. Close the **Passage Editor** and hit the **Play** button.

![coversation with text](/docs/tutorial/01-add-speaker.png)

![coversation with text](/docs/tutorial/01-conversation-speaker.png)

Tags can be used for organization of Twine stories. In botscripten, we also use tags to add additional meaning to our **Passages**.

#### 👻 Bonus: Supported Tags

| tag                    | explanation                                                                                                                                                                                                                                                                            |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oneline`              | By default, chat bots will display one message per line, similar to an SMS conversation. If you'd like to send your passage content as a paragraph, use the `oneline` tag. The entire Twine Passage will then be treated as a single message.                                          |
| `speaker-*` _(prefix)_ | The `speaker-*` tag describes "who" the message is from. For example, a tag of `speaker-bob` would imply the message should come from `bob`. The speaker tag is arbitrary, but should be consistent to identify "who" is talking. We use `speaker-karl` for messages from Karl A. Ibex |
| `wait`                 | Adding `wait` will prevent the conversation from automatically advancing. When Botscripten sees only one link, it will automatically advance. We recommend equating the `wait` tag with the chat user nodding in agreement.                                                            |

## Your Second and Third Passages - Creating Branches and Choices

_Now you're going to create some additional passages using the `+ Passage` button in the bottom right of the Twine Editor. We've intentionally left some details out at this point, as we want you to click around in the interface. You won't break anything, and it's pretty easy to delete your passages at this stage._

1. Return to the Twine Editor and create two additional **Passages**
2. The first passage, titled "I'm doing good" should contain the text "That's awesome!"
3. The second passage, titled "Eh, not so good" should contain the text "I'm sorry to hear that..."
4. Change the tag for "Start" from `speaker-bot` to `speaker-karl`. Give it a color of "green"
5. Remember to add the `speaker-karl` tag.

When completed, your Twine Editor should look like this:

![three independent passages](/docs/tutorial/02-story.png)

If we were to press Play, we'd see no change in our conversation. That's because we haven't linked them yet.

## Linking Passages

1. Return to your "Start" Passage
2. After `Hello`, add a new line and type `[[I`

The `[[` (two angle brackets) tells Twine you are creating a **Passage Link**. Passage Links point to other passages in your Twine file. Because we named our passages "I'm doing good" and "Eh, not so good" earlier, Twine can automatically suggest these passages for us.

![autocomplete](/docs/tutorial/02-link-autocomplete.png)

Go ahead and create a link for each passage. `[[I'm doing good]]` and `[[Eh, not so good]]`. Once you're done, hit Play:

![showing a choice](/docs/tutorial/02-showing-choice.png)

You'll see that you now have a choice! Choices are one of the most powerful tools we have in Twine, as they allow us to take the conversation in different directions based on how the user responds. In our example above, we present a choice to the user. Based on their decision, we can cover other topics or ask them about why they're not feeling great. (And the latter is what we're going to do next!)

#### 👻 Bonus: Link Naming

Links don't have to be exactly matching the Passage you want. Twine and Botscripten also support the format of `[[A->B]]`, where `A` is the text you want to display and `B` is the Passage Name. You cannot have any spaces around the arrow `->`. In our previous example, we could change the feeling good Link to `[[Swell->I'm doing good]]`. The user would then be given the choice of `Swell`, but behind the scenes we will still take them to `I'm Doing Good`. In large conversations, this can let you name Passages based on their purpose, independent of what the user picks.

## The Fourth and Fifth Passages - Asking Why

_Like before, we're going to give minimal guidance so that you can play around with the interface. It's one of the best ways to learn._

1. Open up `Eh, not so good` and add a link to `ask why` (Twine will create this Passage for you automatically)
2. Open up `ask why` and add the content of `#@prompt why_reason`
3. Add a new line (or many) and add a link to `confirm why`
4. Open up `confirm why` and add the text "Ah, I see. Thanks for sharing". Don't forget to set the `speaker-karl` tag

Ready to check your answer?

![asking for input](/docs/tutorial/03-story.png)

When we press "Play" now, and choose "Eh, not so good" we'll see additional lines of dialogue, including a dashed box around what used to be our `ask why` Passage. What's happened is that Botscripten saw you put in a **Directive**, text with special meaning in Aibex. In this case, we added the `#@prompt` directive. On Aibex, Karl will stop speaking and ask the user for an open ended response. This lets the user reflect at their own pace.

**Directives** allow Karl to do more than just hold a conversation. We also use Directives for adding items to your journey, scheduling followup conversations, and more. We support quite a few, but 99% of your conversations will use `#@prompt` and `#@end`.

#### 👻 Bonus: (Almost) All the Directives

| directive                | description                                                                                                                    |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `#@end`                  | Signals the end of a conversation, prompting a "close this conversation" button to appear                                      |
| `#@prompt varName`       | Prompts the user for free-text input, saved into the provided `varName`                                                        |
| `#@set varName varValue` | Store a value in the conversation. `varName` cannot contain spaces, and everything after `varName` is assumed to be the value. |

## The Sixth Passage - Ending

_One more time here, and you're about to become a Botscripten master!_

1. Create a new Passage called `end`
2. Inside of the Passage, add the directive `#@end`
3. Link "confirm why" and "I'm doing good" to your new "end" Passage

Your final Twine story should look like this (feel free to move the Passages around. Twine keeps the lines connected for you):

![compeleted story](/docs/tutorial/04-story.png)

Now, no matter which route you take, you'll end up at our final node, "end" which contains the `#@end` directive. This tells Karl and Aibex the conversation's complete and explicitly adds a "close conversation" button. You might be asking _why do we need the end directive?_ at this point, and the answer is because "finishing" a conversation (hitting `#@end`) is different than "abandoning" a conversation by closing out Karl mid-chat. Without an ending, we'd have no way of knowing what happened. This is especially true when someone is talking to Karl over Slack, SMS, Facebook, or other environments where we don't control the experience.

# Learning More About Twine

Twine is a rich tool for Interactive Fiction. Using other story formats, authors have created everything from "Choose Your Own Adventure"-style stories to text based video games.

- [The Twine Story Map](http://twinery.org/wiki/twine2:the_story_map) - A tutorial on the Twine Editor interface
- [Advanced Passage Editing](http://twinery.org/wiki/twine2:editing_passages) - A walkthrough on the Passage Editor screen
- [Finding & Replacing Text Across Passages](http://twinery.org/wiki/twine2:finding_and_replacing_text) - Advanced Twine Editor features
- [IFDB Twine Stories](https://ifdb.tads.org/search?searchbar=system%3Atwine&searchGo.x=0&searchGo.y=0) - Inspiration and ways to pass time, reading works created by other authors (using other Twine story formats)

# Learning More About Botscripten

- [Return to the main Botscripten docs](./README.md)
