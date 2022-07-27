import initializeUI from "./initializeUI.js";
import { elementFromString } from "./functions.js";

export default async function initializeEditor() {
	const panelTabContainer = document.getElementById("panelTabContainer").firstElementChild.firstElementChild,
		panelContentContainer = document.getElementById("panelContentContainer");
	const hash = window.location.hash.substring(1);

	if (hash.startsWith("tutorial")) {
		const tutorialID = hash.split("-")[1];
		const tutorialData = await (import(`/data/tutorials/${tutorialID}.js`).catch(error => {
			console.log(error);

			alertCustom("Error: Could not load tutorial<br><br>Tutorials can be accessed from the main page under the tutorials tab<br><br>You will be redirected automatically in 15 seconds");
			setTimeout(() => redirectToHome(), 15000);
		}));

		runTutorial(tutorialData.default);
	} else if (hash.startsWith("editor")) {
		runEditor();
	} else {
		redirectToHome();
	}

	function redirectToHome() {
		window.location.href = "//" + window.location.host;
	}

	async function runTutorial(tutorialJSON) {
		window.pageType = "tutorial";

		const tutorialActions = {
			beginTutorial: () => {
				return new Promise(resolve => {
					const startButton = document.getElementById("tutorialStartButton");
					startButton.style.display = "block";
					startButton.addEventListener("click", function handler() {
						startButton.removeEventListener("click", handler);
						startButton.style.display = "none";

						resolve();
					});
				});
			},
			endTutorial: () => {
				tutorialActions.clearAll();

				tutorialActions.displayText({ text: `You have completed the ${tutorialJSON.info.display} tutorial. You will be redirected back to the home page in 10 seconds.` });
				setTimeout(() => redirectToHome(), 10000);
			},
			loadFileSystem: async ({ fileSystem }) => {
				fileSystemManager.loadFileSystem(fileSystem);
				window.requiredFileSystem = fileSystem;
			},
			displayText: async ({ text }) => {
				const popupElement = elementFromString(`
					<div class="tutorialPopup">
						<div class="tutorialPopupHeader"></div>
						<p class="tutorialPopupText">${text}</p>
					</div>
				`);
				document.body.appendChild(popupElement);
			},
			clearText: async () => {
				for (const element of document.getElementsByClassName("tutorialPopup")) {
					element.remove();
				}
			},
			highlightElement: async ({ selector }) => {
				const element = document.querySelector(selector);

				const highlighter = document.createElement("div");
				highlighter.classList.add("tutorialHighlighter");

				const observer = new ResizeObserver(() => {
					const boundingRect = element.getBoundingClientRect();

					highlighter.style.left = boundingRect.x + "px";
					highlighter.style.top = boundingRect.y + "px";
					highlighter.style.width = boundingRect.width + "px";
					highlighter.style.height = boundingRect.height + "px";
				});
				observer.observe(element);

				document.body.appendChild(highlighter);
			},
			clearHighlighters: async () => {
				for (const element of document.getElementsByClassName("tutorialHighlighter")) {
					element.remove();
				}
			},
			setPanelText: async ({ text }) => {
				document.getElementById("tutorialPanelContent").innerHTML = text;
			},
			awaitEvent: async ({ eventListener }) => {
				await eventListener();
			},
			displayNextButton: () => {
				return new Promise(resolve => {
					const nextButton = document.getElementById("tutorialNextButton");
					nextButton.style.display = "block";
					nextButton.addEventListener("click", function handler() {
						nextButton.removeEventListener("click", handler);
						nextButton.style.display = "none";

						resolve();
					});
				});
			},
			clearAll: async () => {
				await tutorialActions.clearHighlighters();
				await tutorialActions.clearText();
				await tutorialActions.setPanelText({ text: "" });
			},
			enableInteraction: async () => {
				tutorialMaskElement.style.display = "none";
			},
			disableInteraction: async () => {
				tutorialMaskElement.style.display = "block";
			},
			runFunction: async ({ func }) => {
				func();
			},
		};


		const tutorialTabElement = elementFromString(`<td id="tutorialPanelTab" class="panelTab">Tutorial</td>`),
			tutorialContentElement = elementFromString(`<div id="tutorialPanelContent" class="panelContent"></div>`),
			tutorialMaskElement = elementFromString(`<div id="tutorialMask"></div>`),
			tutorialNextElement = elementFromString(`<button id="tutorialNextButton" class="tutorialButton">Next</button>`),
			tutorialStartElement = elementFromString(`<button id="tutorialStartButton" class="tutorialButton">Start</button>`);

		panelTabContainer.insertBefore(tutorialTabElement, panelTabContainer.firstChild);
		panelContentContainer.insertBefore(tutorialContentElement, panelContentContainer.firstChild);
		document.body.appendChild(tutorialMaskElement);
		document.body.appendChild(tutorialNextElement);
		document.body.appendChild(tutorialStartElement);

		const headerTextElement = document.getElementById("headerText");
		headerTextElement.innerText = "Tutorial: " + tutorialJSON.info.display;

		initializeUI("tutorial");

		for (const instruction of tutorialJSON.actionList) {
			const action = instruction.action;

			await tutorialActions[instruction.action](instruction);
		}
	}

	function runEditor(projectName) {
		window.pageType = "editor";

		initializeUI("main");

		fileSystemManager.loadFileSystem({});
	}
}