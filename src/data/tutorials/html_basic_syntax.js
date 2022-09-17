import { arrayBufferToBase64 } from "/js/functions.js";

const actionData = {
	fileSystem: {
		"index.html": [``, "utf-8"],
		"image.jpg": [fetch("/data/tutorials/resources/html_basic_syntax/image.jpg").then(response => response.arrayBuffer()).then(arrayBufferToBase64), "base64"],
	},
};

const tutorialData = {
	info: {
		display: "HTML Basic Syntax",
	},
	actionList: [
		[
			"beginTutorial",
		],
		[
			"loadFileSystem",
			actionData.fileSystem,
		],
		[
			"setRequiredFileSystem",
			actionData.fileSystem,
		],
		//
		[
			"info",
			`This tutorial will teach you the basics of HTML syntax.`,
		],
		//
		[
			"info",
			`Syntax is the set rules for writing code in a specific language. Languages usually differ in their syntax but can have similarities.`,
		],
		//
		[
			"instructCodeAction",
			`HTML files should always begin with the DOCTYPE (document type) declaration, followed by the html, head and body tags. Write the following code in the index.html file:<pre data-lang="text/html">&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n  &lt;/head&gt;\n\n  &lt;body&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</pre>`,
			`appendRequiredFileCode`,
			`index.html`,
			`<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n</body>\n</html>`,
		],
		//
		[
			"instructCodeAction",
			`HTML syntax is very basic; it is made up of only tags. Tags can be paired or not paired. Paired tags are written as:<pre data-lang="text/html">&lt;tagname&gt;&lt;/tagname&gt;</pre>Unpaired tags are written as:<pre data-lang="text/html">&lt;tagname&gt;</pre>Switch to the index.html file and write the following code between the head and body tags:<pre data-lang="text/html">&lt;img src="image.jpg" width="300"&gt;\n&lt;button&gt;some text&lt;/button&gt;</pre>The file should then look like this:<pre data-lang="text/html">&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n    &lt;head&gt;\n    &lt;/head&gt;\n\n    &lt;body&gt;\n        &lt;img src="image.jpg" width="300"&gt;\n        &lt;button&gt;some text&lt;/button&gt;\n    &lt;/body&gt;\n&lt;/html&gt;</pre>`,
			`insertRequiredFileCode`,
			`index.html`,
			`<img src="image.jpg" width="300">\n<button>some text</button>`,
			5,
			0,

		],
		//
		[
			"instructCodeExecution",
			`Click the run button.`,
		],
		//
		[
			"info",
			`As you may have noticed, the <code class="highlightInline">img</code>, or image, tag is unpaired, while the button tag is paired.<br><br>Paired tags can have content and unpaired tags cannot.<br><br>But what is content? Content is a general term used to describe basically anything in HTML, like tags or just regular text. For example, the <code class="highlightInline">button</code> tag is content of the <code class="highlightInline">body</code> tag, and "some text" is content of the <code class="highlightInline">button</code> tag. As stated before, the <code class="highlightInline">img</code> tag is unpaired, and there is no place for it to hold any content.`,
		],
		//
		[
			"instructCodeAction",
			`Place the image tag within the button tag as shown:<pre data-lang="text/html">&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n  &lt;/head&gt;\n\n  &lt;body&gt;\n    &lt;button&gt;\n      some text\n      &lt;img src="image.jpg" width="300"&gt;\n    &lt;/button&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</pre>`,
			`insertRequiredFileCode`,
			`index.html`,
			`<button>\nsome text\n<img src="image.jpg" width="300">\n</button>`,
			5,
			2,
		],
		//
		[
			"instructCodeExecution",
			`Click the run button.`,
		],
		//
		[
			"info",
			`By placing the image within the button, the image becomes part of the button along with the text.`,
		],
		[
			"instructCodeAction",
			`Place an anchor tag around the button as shown:<pre data-lang="text/html">&lt;a href="https://example.com"&gt;\n  &lt;button&gt;\n    some text\n    &lt;img src="image.jpg" width="300"&gt;\n  &lt;/button&gt;\n&lt;/a&gt;</pre>`,
			`insertRequiredFileCode`,
			`index.html`,
			`<a href="https://example.com">\n<button>\nsome text\n<img src="image.jpg" width="300">\n</button>\n</a>`,
			5,
			4,
		],
		//
		[
			"instructCodeExecution",
			`Now, clicking the button should redirect the page to "example.com" Click run.`,
		],
		[
			"info",
			`The <code class="highlightInline">a</code> (short for anchor) tag, is used to create links. Usually, just regular text is used as content of the anchor tag, but this example displays how dynamic HTML can be. Nearly (in programming, there are almost always exceptions) anything can be placed inside an anchor tag and become a link.<br><br>A core element of HTML is that content will inherit functionality from its parent (the tags that it resides in).`,
		],
		[
			"info",
			`Another key element of the language, is HTML attributes. Attributes give extra functionality to tags.<br><br>Attributes are always placed in the first tag, between the tag name and the <code class="highlightInline">&gt;</code>.<pre data-lang="text/html">&lt;tagname attribute-1="value" attribute-2="value"&gt;&lt;/tagname&gt;\n&lt;tagname attribute-1="value" attribute-2="value"&gt;</pre>The <code class="highlightInline">width</code> attribute of the image tag defines the width in pixels of the image. There is also a <code class="highlightInline">height</code> attribute, but it does not need to be set, as the height will automatically adjust so the image doesn't stretch/contract.<br><br>Another example, is the <code class="highlightInline">href</code> attribute of the anchor tag. It defines the URL the user is redirected to when clicking the link.<br><br><code class="highlightInline">href</code> however, will have no effect on the image tag, and the <code class="highlightInline">width</code> attribute will have no effect on the anchor tag. This is because some attributes only work for certain tags. Each tag has a list of valid attributes, and the same attributes may have different functionality for different tags. Some attributes are global, meaning they can be used on every HTML tag.`,
		],
		//
		[
			"info",
			`For perspective, there are over 100 different HTML elements and attributes. The anchor tag has 8 possible attributes and the image tag has 12 possible attributes. This does not include global attributes of which there are 28, and event attributes of which there are 72. This list is valid of 2022.<br><br>If you ever forget what a tag or attribute does, reference can always be found online with a quick search.`,
		],
		//
		[
			"saveProgress",
		],
		[
			"endTutorial",
		],
	],
};

export default tutorialData;