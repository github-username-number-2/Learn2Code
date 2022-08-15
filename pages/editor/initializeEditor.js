import initializeUI from "./initializeUI.js";
import initializeTutorialFunctions from "./tutorialFunctions.js";

export default async function initializeEditor() {
	const hash = window.location.hash.substring(1);

	if (hash.startsWith("tutorial")) {
		const tutorialID = hash.split("-")[1];
		const tutorialData = await (import(`/data/tutorials/${tutorialID}.js`).catch(() => {
			alertCustom("Error: Could not load tutorial<br><br>Tutorials can be accessed from the main page under the tutorials tab<br><br>You will be redirected automatically in 15 seconds");
			setTimeout(() => window.location.href = "//" + window.location.host, 15000);
		}));

		runTutorial(tutorialData.default);
	} else if (hash.startsWith("editor")) {
		const projectName = hash.split("-")[1],
			projectData = await storageManager.getProjectData(projectName);

		if (projectData === undefined) {
			alertCustom("Error: Could not load project<br><br>Projects can be accessed from the main page under the projects tab<br><br>You will be redirected automatically in 15 seconds");
			setTimeout(() => window.location.href = "//" + window.location.host, 15000);
			return;
		}

		runEditor(projectData);
	} else {
		window.location.href = "//" + window.location.host;
	}

	async function runTutorial(tutorialJSON) {
		window.tutorialFunctions = initializeTutorialFunctions(tutorialJSON);

		initializeUI("tutorial");

		// load stored progress
		let actionIndex = 0;

		const savedData = await storageManager.getTutorialData(tutorialJSON.info.id);
		if (savedData) {
			({ actionIndex } = savedData);
			const { lastCheckPointFileSystem, requiredFileSystem } = savedData;

			await tutorialFunctions.loadFileSystem(lastCheckPointFileSystem);
			tutorialFunctions.setRequiredFileSystem(requiredFileSystem);
		}

		const actionList = tutorialJSON.actionList;
		for (; actionIndex < actionList.length; actionIndex++) {
			const instruction = tutorialJSON.actionList[actionIndex];
			await tutorialFunctions[instruction[0]](...instruction.slice(1), actionIndex);
		}
	}

	function runEditor(projectData) {
		initializeUI("main");

		const { name, fileSystem } = projectData;

		document.getElementById("headerText").innerText =
			document.title =
			"Project: " + name;

		fileSystemManager.loadFileSystem(fileSystem);

		// initialize autosave
		const saveIcon = document.getElementById("saveIcon");

		let timeout;
		fileSystemManager.fileSystemChangeListeners.saveListener = () => {
			saveIcon.style.animationName = "fade";
			clearTimeout(timeout);
			timeout = setTimeout(async () => {
				await storageManager.setProjectData({ name, fileSystem: fileSystemManager.getFileSystem() });

				saveIcon.style.animationName = null;
			}, 600);
		};
	}
}