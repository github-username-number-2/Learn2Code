/*
beginTutorial
clearAll
resolveOnEvent
highlightElement
loadFileSystem
setRequiredFileSystem
displayText
displayNextButton
setPanelText
enableInteraction
disableInteraction
saveProgress
endTutorial
*/

const actionData = {
	fileSystem: {},
};

const tutorialData = {
	info: {
		id: "",
		display: "",
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