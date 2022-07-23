import createFileSystemManager from "./fileSystemManager.js";
import initializeUI from "./initializeUI.js";
import { elementFromString } from "./functions.js";

export default async function initializeEditor() {
	const panelTabContainer = document.getElementById("panelTabContainer").firstElementChild.firstElementChild,
		panelContentContainer = document.getElementById("panelContentContainer");
	const hash = window.location.hash.substring(1);

	if (hash.startsWith("tutorial")) {
		const tutorialID = hash.split("-")[1];
		const tutorialData = await (fetch(`/json/tutorials/${tutorialID}.json`).then(response =>
			response.status === 200 ? response.json() : redirectToHome()
		));

		runTutorial(tutorialData);
	} else if (hash.startsWith("editor")) {

	} else {
		redirectToHome();
	}

	function redirectToHome() {
		window.location.href = "//" + window.location.host;
	}

	function runTutorial(tutorialJSON) {
		const tutorialTabElement = elementFromString(`<td id="tutorialPanelTab" class="panelTab">Tutorial</td>`),
			tutorialContentElement = elementFromString(`<div id="tutorialPanelContent" class="panelContent">tutorial</div>`)

		panelTabContainer.insertBefore(tutorialTabElement, panelTabContainer.firstChild);
		panelContentContainer.insertBefore(tutorialContentElement, panelContentContainer.firstChild);

		const headerTextElement = document.getElementById("headerText");
		headerTextElement.innerText = "Tutorial: " + tutorialJSON.info.display;

		initializeUI("tutorial");
		fileSystemManager.loadFileSystem(tutorialJSON.startingFileSystem);
	}

	function runEditor(projectName) {
		initializeUI("main");
	}
}