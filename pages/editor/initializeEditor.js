import initializeUI from "./initializeUI.js";
import initializeTutorialFunctions from "./tutorialFunctions.js";

export default async function initializeEditor() {
	const hash = window.location.hash.substring(1);

	if (hash.startsWith("tutorial")) {
		const tutorialID = hash.split("-")[1];
		const tutorialData = await (import(`/data/tutorials/${tutorialID}.js`).catch(error => {
			console.log(error);

			alertCustom("Error: Could not load tutorial<br><br>Tutorials can be accessed from the main page under the tutorials tab<br><br>You will be redirected automatically in 15 seconds");
			setTimeout(() => window.location.href = "//" + window.location.host, 15000);
		}));

		runTutorial(tutorialData.default);
	} else if (hash.startsWith("editor")) {
		runEditor();
	} else {
		window.location.href = "//" + window.location.host;
	}

	async function runTutorial(tutorialJSON) {
		window.tutorialFunctions = initializeTutorialFunctions(tutorialJSON);

		// load stored progress
		let actionIndex = 0;

		const savedData = await storageManager.getTutorialData(tutorialJSON.info.id);
		if (savedData) {
			({ actionIndex } = savedData);
			const { lastCheckPointFileSystem, requiredFileSystem } = savedData;

			tutorialFunctions.loadFileSystem(lastCheckPointFileSystem);
			tutorialFunctions.setRequiredFileSystem(requiredFileSystem);
		}

		initializeUI("tutorial");

		const actionList = tutorialJSON.actionList;
		for (; actionIndex < actionList.length; actionIndex++) {
			const instruction = tutorialJSON.actionList[actionIndex];
			await tutorialFunctions[instruction[0]](...instruction.slice(1), actionIndex);
		}
	}

	function runEditor(projectName) {
		initializeUI("main");

		fileSystemManager.loadFileSystem({});
	}
}