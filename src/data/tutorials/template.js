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
createCheckpoint
endTutorial
*/

const actionData = {
	fileSystem: {},
};

const tutorialData = {
	info: {
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
			"createCheckpoint",
		],
		[
			"endTutorial",
		],
	],
};

export default tutorialData;