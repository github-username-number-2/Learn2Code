const tutorialData = {
	info: {
		id: "demo",
		display: "Demo",
	},
	data: {
		fileSystem: {
			testFolder: {
				"main.js": "console.log(mmm);",
			},
			"index.html": "<!DOCTYPE html>\n<html>\n\t<body>\n\t\t<script src=\"main.js\"></script>\n\t</body>\n</html>",
		},
	},
	tutorial: [
		{
			action: "loadFileSystem",
			dataName: "fileSystem",
		},
		{
			action: "disableInteraction",
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
			action: "highlightElement",
			selector: "#panelContainer",
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
			action: "displayText",
			text: "This tab displays the main panel, where you can access files, and run your code. Click the tab titled \"main\" to swich to the main panel.",
		},
		{
			action: "setPanelText",
			text: "Switch to the main panel.",
		},
		{
			action: "awaitEvent",
			eventListener: () => resolveOnEvent("click", document.getElementById("mainPanelTab")),
		},
		//
		{
			action: "highlightElement",
			selector: "#mainPanelContent",
		},
		{
			action: "displayNextButton",
		},
		//
		{
			action: "enableInteraction",
		},
	],
};

function resolveOnEvent(event, element) {
	return new Promise(resolve => {
		element.addEventListener(event, function handler() {
			element.removeEventListener(event, handler);

			resolve();
		});
	});
}

export default tutorialData;