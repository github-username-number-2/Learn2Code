import { resolveOnEvent, resolveOnCodeCorrect, setRequiredFileSystem, appendRequiredFileCode } from "/pages/editor/tutorialFunctions.js";

const actionData = {
	fileSystem: {
		"js": {
			"main.js": "",
		},
		"index.html": "<!DOCTYPE html>\n<html>\n\t<body>\n\t\t<script src=\"/js/main.js\"></script>\n\t</body>\n</html>",
	},
};

const tutorialData = {
	info: {
		id: "hello_world",
		display: "Hello World",
	},
	actionList: [
		{
			action: "disableInteraction",
		},
		{
			action: "beginTutorial",
		},
		{
			action: "loadFileSystem",
			fileSystem: actionData.fileSystem,
		},
		{
			action: "runFunction",
			func: () => {
				setRequiredFileSystem(actionData.fileSystem);
			},
		},
		{
			action: "highlightElement",
			selector: "#panelContainer",
		},
		{
			action: "displayText",
			text: "This is the panel container. Here, you can access information about the current tutorial, access files, settings, and more.",
		},
		{
			action: "displayNextButton",
		},
		//
		{
			action: "clearAll",
		},
		{
			action: "highlightElement",
			selector: "#panelTabContainer",
		},
		{
			action: "displayText",
			text: "These tabs let you switch between different panels.",
		},
		{
			action: "displayNextButton",
		},
		//
		{
			action: "clearAll",
		},
		{
			action: "displayText",
			text: "The main panel is where you can access files, and run your code. Click the tab titled \"main\" to swich to the main panel.",
		},
		{
			action: "setPanelText",
			text: "Switch to the main panel.",
		},
		{
			action: "enableInteraction",
		},
		{
			action: "awaitEvent",
			eventListener: () => resolveOnEvent("click", document.getElementById("mainPanelTab")),
		},
		//
		{
			action: "disableInteraction",
		},
		{
			action: "clearAll",
		},
		{
			action: "runFunction",
			func: () => {
				appendRequiredFileCode("js main.js", "alert(\"Hello World\");");
			},
		},
		{
			action: "highlightElement",
			selector: "#filesContainerOuter",
		},
		{
			action: "displayText",
			text: "These are all of your files. Throughout these tutorials, you will be asked to write code into these files. Once you have written the required code, the file names will turn green. As you can see, the index.html file is already complete.",
		},
		{
			action: "displayNextButton",
		},
		//
		{
			action: "clearAll",
		},
		{
			action: "setPanelText",
			text: "Write the following code into the main.js file under the js folder: <pre data-lang=\"text/javascript\">alert(\"Hello World\");</pre>",
		},
		{
			action: "displayText",
			text: "Write the following code into the main.js file under the js folder: <pre data-lang=\"text/javascript\">alert(\"Hello World\");</pre>",
		},
		{
			action: "highlightCode",
			types: ["text/javascript"],
		},
		{
			action: "enableInteraction",
		},
		{
			action: "awaitEvent",
			eventListener: () => {
				return resolveOnCodeCorrect();
			},
		},
		//
		{
			action: "saveProgress",
		},
		{
			action: "clearAll",
		},
		{
			action: "displayText",
			text: "Click the run button to execute your code.",
		},
		{
			action: "setPanelText",
			text: "Click the run button in the main tab to execute your code.",
		},
		{
			action: "awaitEvent",
			eventListener: () => resolveOnEvent("click", document.getElementById("runCode")),
		},
		//
		{
			action: "endTutorial",
		},
	],
};

export default tutorialData;