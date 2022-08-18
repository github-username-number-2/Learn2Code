import { arrayBufferToBase64 } from "/js/functions.js";

const actionData = {
	fileSystem: {
		"index.html": [`<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n\n  <body>\n  <img src="image.png">\n  </body>\n</html>`, "utf-8"],
		"image.png": [fetch("/data/tutorials/resources/html_basic_syntax/image.png").then(response => response.arrayBuffer()).then(arrayBufferToBase64), "base64"],
	},
};

const tutorialData = {
	info: {
		id: "html_basic_syntax",
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
			"info",
			`HTML syntax is very basic; it is made up of only tags. Tags can be paired or not paired. Switch to the index.html file and write the following code:`,
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