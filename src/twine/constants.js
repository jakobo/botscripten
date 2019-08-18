import template from "lodash.template";

const TWEE_TEMPLATE = template(`
:: StoryTitle
<%= story.title %>


:: StoryData
{
	"ifid": "<%= story.ifid %>",
	"format": "Chatbook",
	"format-version": "<%= story.formatVersion %>",
	"start": "<%= story.start %>",
	"tag-colors": <%= JSON.stringify(story.tags, null, 2) %>,
	"zoom": 1
}

<%= story.passages.join("") %>
`);

const PASSAGE_TEMPLATE = template(`
:: <%= passage.name %> [<%= passage.tags %>] {"position":"<%= passage.position %>","size":"<%= passage.size %>"}
<%= passage.contents %>


`);

export { TWEE_TEMPLATE, PASSAGE_TEMPLATE };
