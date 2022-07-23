import initializeUI from "./initializeUI.js";
import { elementFromString } from "./functions.js";

export default async function initializeEditor() {
	const panelTabContainer = document.getElementById("panelTabContainer").firstElementChild.firstElementChild,
		panelContentContainer = document.getElementById("panelContentContainer");
	const hash = window.location.hash.substring(1);

	if (hash.startsWith("tutorial")) {
		const tutorialID = hash.split("-")[1];
		const tutorialData = await (import(`/data/tutorials/${tutorialID}.js`).catch((error) => {console.log(error)
			alertCustom("Error: Could not load tutorial<br><br>Tutorials can be accessed from the main page under the tutorials tab<br><br>You will be redirected automatically in 15 seconds");

			//setTimeout(() => redirectToHome(), 15000);
		}));

		runTutorial(tutorialData.default);
	} else if (hash.startsWith("editor")) {

	} else {
		redirectToHome();
	}

	function redirectToHome() {
		window.location.href = "//" + window.location.host;
	}

	async function runTutorial(tutorialJSON) {
		const tutorialTabElement = elementFromString(`<td id="tutorialPanelTab" class="panelTab">Tutorial</td>`),
			tutorialContentElement = elementFromString(`<div id="tutorialPanelContent" class="panelContent">tutorial</div>`)

		panelTabContainer.insertBefore(tutorialTabElement, panelTabContainer.firstChild);
		panelContentContainer.insertBefore(tutorialContentElement, panelContentContainer.firstChild);

		const headerTextElement = document.getElementById("headerText");
		headerTextElement.innerText = "Tutorial: " + tutorialJSON.info.display;

		initializeUI("tutorial");
	}

	function runEditor(projectName) {
		initializeUI("main");
	}
}

const tutorialActions = {
	loadFileSystem: function () {
	},
	enableInteraction: function () {
	},
	disableInteraction: function () {
	},
	displayText: function () {
	},
	highlightElement: function () {
	},
};