/*
beginTutorial
clearAll
resolveOnEvent
resolveOnCodeCorrect
highlightElement
loadFileSystem
setRequiredFileSystem
displayText
displayNextButton
setPanelText
enableInteraction
disableInteraction
createCheckpoint
endTutorial
*/

const actionData = {
	fileSystem: {},
};

const tutorialData = {
	info: {
		display: "Hello World in HTML",
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
			"addRequiredFile",
			`index.html`,
		],
		//
		[
			"displayTextAndSetPanel",
			`Switch to the main panel.`,
		],
		[
			"enableInteraction",
		],
		[
			"resolveOnEvent",
			`click`,
			document.getElementById("mainPanelTab"),
		],
		//
		[
			"clearAll",
		],
		[
			"displayTextAndSetPanel",
			`Click the New File button to create a new file named "index.html"`,
		],
		[
			"resolveOnCodeCorrect",
		],
		//
		[
			"createCheckpoint",
		],
		[
			"clearAll",
		],
		[
			"displayText",
			`All HTML files should begin with what is known as a DOCTYPE (document type) declaration.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"displayTextAndSetPanel",
			`Write the following code in the index.html file:<pre data-lang="text/html">&lt;!DOCTYPE html&gt;</pre>`,
			true,
		],
		[
			"highlightAllCode",
		],
		[
			"setRequiredFileCode",
			`index.html`,
			[`<!DOCTYPE html>`, "utf-8"],
		],
		[
			"resolveOnCodeCorrect",
		],
		//
		[
			"createCheckpoint",
		],
		[
			"clearAll",
		],
		[
			"displayText",
			`Most HTML files should have html, head and body tags, and only in specific cases do they not. Although most browsers create these tags automatically, it is good practice to include them anyway.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"displayTextAndSetPanel",
			`Add the following code to the index.html file:<pre data-lang="text/html">&lt;html&gt;\n  &lt;head&gt;\n  &lt;/head&gt;\n\n  &lt;body&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</pre>`,
		],
		[
			"highlightAllCode",
		],
		[
			"appendRequiredFileCode",
			`index.html`,
			`\n<html>\n<head>\n</head>\n<body>\n</body>\n</html>`,
		],
		[
			"resolveOnCodeCorrect",
		],
		//
		[
			"createCheckpoint",
		],
		[
			"clearAll",
		],
		[
			"displayText",
			`The title tag sets the text displayed on the tab of a web page. The title of this web page is "Tutorial: Hello World in HTML", for example. The title tag should always be placed between the head tags.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"displayTextAndSetPanel",
			`Add a title tag to the index.html file. The file should then look similar to this:<pre data-lang="text/html">&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;title&gt;Hello World&lt;/title&gt;\n  &lt;/head&gt;\n\n  &lt;body&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</pre>`,
		],
		[
			"highlightAllCode",
		],
		[
			"insertRequiredFileCode",
			`index.html`,
			`<title>Hello World</title>`,
			3,
			0.
		],
		[
			"resolveOnCodeCorrect",
		],
		//
		[
			"createCheckpoint",
		],
		[
			"clearAll",
		],
		[
			"displayText",
			`Text can be displayed differently based on what tags it is within. The h1 tag is short for heading 1, and makes text large. There are also h2 h3, h4, h5 and h6 tags that can display text smaller.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"displayTextAndSetPanel",
			`Insert an h1 tag between the 2 body tags. The file should then look similar to this:<pre data-lang="text/html">&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;title&gt;Hello World&lt;/title&gt;\n  &lt;/head&gt;\n\n  &lt;body&gt;\n    &lt;h1&gt;Hello World&lt;/h1&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</pre>`,
		],
		[
			"highlightAllCode",
		],
		[
			"insertRequiredFileCode",
			`index.html`,
			`<h1>Hello World</h1>`,
			6,
			0,
		],
		[
			"resolveOnCodeCorrect",
		],
		//
		[
			"clearAll",
		],
		[
			"displayTextAndSetPanel",
			`Click the run button.`,
		],
		[
			"resolveOnEvent",
			`click`,
			document.getElementById("runCode"),
		],
		//
		[
			"createCheckpoint",
		],
		[
			"endTutorial",
		],
	],
};

export default tutorialData;