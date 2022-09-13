const actionData = {
	fileSystem: {
		"js": {
			"main.js": [``, "utf-8"],
		},
		"index.html": [`<!DOCTYPE html>\n<html>\n\t<body>\n\t\t<script src="/js/main.js"></script>\n\t</body>\n</html>`, "utf-8"],
	},
};

const tutorialData = {
	info: {
		id: "hello_world",
		display: "Hello World",
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
		[
			"highlightElement",
			`#panelContainer`,
		],
		[
			"displayText",
			`This is the panel container. Here, you can access information about the current tutorial, access files, settings, and more.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"highlightElement",
			`#panelTabContainer`,
		],
		[
			"displayText",
			`These tabs let you switch between different panels.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"displayText",
			`The main panel is where you can access files, and run your code. Click the tab titled \"main\" to swich to the main panel.`,
		],
		[
			"setPanelText",
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
			"disableInteraction",
		],
		[
			"clearAll",
		],
		[
			"highlightElement",
			`#filesContainerOuter`,
		],
		[
			"displayText",
			`These are all of your files. Throughout these tutorials, you will be asked to write code into these files. Once you have written the required code, the file names will turn green. As you can see, the index.html file is already complete.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"highlightElement",
			`#codeContainer`,
		],
		[
			"displayText",
			`This is the code editor. When you click on a file you will be able to edit its text here.`,
		],
		[
			"displayNextButton",
		],
		//
		[
			"clearAll",
		],
		[
			"setRequiredFileCode",
			`js main.js`,
			[`alert("Hello World");`, "utf-8"],
		],
		[
			"displayTextAndSetPanel",
			`Open the folder named js. In the main.js file write the following code: <pre data-lang="text/javascript">alert("Hello World");</pre>`,
		],
		[
			"highlightAllCode",
		],
		[
			"enableInteraction",
		],
		[
			"resolveOnCodeCorrect",
		],
		//
		[
			"saveProgress",
		],
		[
			"clearAll",
		],
		[
			"displayText",
			`Each time you finish writing the required code, a checkpoint is created. For example, if you were to reload the page right now, you would continue from here instead of back at the start.`,
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
			`Click the run button in the main tab to execute your code.`,
		],
		[
			"resolveOnEvent",
			`click`,
			document.getElementById("runCode"),
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