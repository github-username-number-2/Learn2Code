import mime from "https://cdn.skypack.dev/pin/mime@v3.0.0-Mgy8KWi04WDrrthUM8WI/mode=imports,min/unoptimized/lite.js";
import { elementFromString } from "/js/functions.js";

export default function initializeTutorialFunctions(tutorialJSON) {
	const { id, display } = tutorialJSON.info;

	const tutorialTabElement = elementFromString(`<td id="tutorialPanelTab" class="panelTab">Tutorial</td>`),
		tutorialContentElement = elementFromString(`<div id="tutorialPanelContent" class="panelContent"><button id="revertFileSystemButton" disabled>Revert File System</button><div id="tutorialPanelText"></div></div>`),
		tutorialMaskElement = elementFromString(`<div id="tutorialMask"></div>`),
		tutorialNextElement = elementFromString(`<button id="tutorialNextButton" class="tutorialButton">Next</button>`),
		tutorialStartElement = elementFromString(`<button id="tutorialStartButton" class="tutorialButton">Start</button>`);

	const panelTabContainer = document.getElementById("panelTabContainer").firstElementChild.firstElementChild,
		panelContentContainer = document.getElementById("panelContentContainer");

	panelTabContainer.insertBefore(tutorialTabElement, panelTabContainer.firstChild);
	panelContentContainer.insertBefore(tutorialContentElement, panelContentContainer.firstChild);
	document.body.appendChild(tutorialMaskElement);
	document.body.appendChild(tutorialNextElement);
	document.body.appendChild(tutorialStartElement);

	const headerTextElement = document.getElementById("headerText");
	headerTextElement.innerText = "Tutorial: " + display;

	const revertFileSystemButton = document.getElementById("revertFileSystemButton");
	revertFileSystemButton.addEventListener("click", async () => {
		if (await confirmCustom("Are you sure you would like to revert the file system back the the last checkpoint?")) {
			tutorialFunctions.revertFileSystem();
		}
	});


	// initialize file correct checker
	let lastCheckPointFileSystem, requiredFileSystem, requiredFileSystemObject, timeout, resolveFunction = () => { };
	fileSystemManager.editor.onDidChangeModelContent(() => {
		const activeFile = fileSystemManager.activeFile,
			activePath = fileSystemManager.activePath;

		clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (!checkFileCodeCorrect(activePath, activeFile)) return;
			if (checkFileSystemCorrect()) resolveFunction();
		}, 600);
	});

	const tutorialFunctions = {
		resolveOnEvent(event, element) {
			return new Promise(resolve => {
				element.addEventListener(event, function handler() {
					element.removeEventListener(event, handler);

					resolve();
				});
			});
		},
		appendRequiredFileCode(filePath, requiredCode) {
			requiredFileSystem["root " + filePath] += requiredCode;

			let currentItem = requiredFileSystemObject;
			for (const item of filePath.split(" ")) {
				if (typeof currentItem[item] === "string") {
					currentItem[item] += requiredCode;
					break;
				} else {
					currentItem = requiredFileSystemObject[item];
				}
			}

			const path = ["root", ...filePath.split(" ")],
				name = path.pop();
			checkFileCodeCorrect(path.join(" "), name);
		},
		setRequiredFileSystem(fileSystem) {
			requiredFileSystemObject = fileSystem;
			requiredFileSystem = {};

			addDirectoryFiles(fileSystem, "root");

			function addDirectoryFiles(directory, path) {
				for (const item in directory) {
					const itemValue = directory[item];
					if (typeof itemValue === "string") {
						const code = formatCode(itemValue, mime.getType(item))

						requiredFileSystem[`${path} ${item}`] = code;
					} else if (typeof itemValue === "object") {
						addDirectoryFiles(itemValue, `${path} ${item}`);
					}
				}
			}

			checkFileSystemCorrect();
		},
		getRequiredFileSystem() {
			return requiredFileSystemObject;
		},
		resolveOnCodeCorrect() {
			return new Promise(resolve => {
				resolveFunction = () => resolve();
			});
		},
		beginTutorial() {
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
		async endTutorial() {
			await tutorialFunctions.clearAll();
			await tutorialFunctions.displayText(`You have completed the ${display} tutorial. Click the next button to be redirected back to the home page.`);
			await tutorialFunctions.displayNextButton();

			window.location.href = "//" + window.location.host;
		},
		loadFileSystem(fileSystem) {
			fileSystemManager.loadFileSystem(fileSystem);
			checkFileSystemCorrect();

			// clone file system object
			lastCheckPointFileSystem = JSON.parse(JSON.stringify(fileSystem));
			revertFileSystemButton.disabled = false;
		},
		revertFileSystem() {
			tutorialFunctions.loadFileSystem(lastCheckPointFileSystem);
		},
		displayText(text) {
			const popupElement = elementFromString(`
				<div class="tutorialPopup">
					<div class="tutorialPopupHeader"></div>
					<p class="tutorialPopupText">${text}</p>
				</div>
			`);
			document.body.appendChild(popupElement);
		},
		clearText() {
			for (const element of document.getElementsByClassName("tutorialPopup")) {
				element.remove();
			}
		},
		highlightElement(selector) {
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
		clearHighlighters() {
			for (const element of document.getElementsByClassName("tutorialHighlighter")) {
				element.remove();
			}
		},
		setPanelText(text) {
			document.getElementById("tutorialPanelText").innerHTML = text;
		},
		awaitEvent: async eventListener => {
			await eventListener();
		},
		displayNextButton() {
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
		async clearAll() {
			tutorialFunctions.clearHighlighters();
			tutorialFunctions.clearText();
			tutorialFunctions.setPanelText("");
		},
		enableInteraction() {
			tutorialMaskElement.style.display = "none";
		},
		disableInteraction() {
			tutorialMaskElement.style.display = "block";
		},
		runFunction(func) {
			func();
		},
		highlightCode(types) {
			for (const type of types) {
				for (const element of document.querySelectorAll(`[data-lang="${type}"]`)) {
					monaco.editor.colorizeElement(element);
				}
			}
		},
		// progress should only be saved when code is correct
		saveProgress(actionIndex) {
			lastCheckPointFileSystem = fileSystemManager.getFileSystem();
			revertFileSystemButton.disabled = false;

			storageManager.setTutorialData({
				id,
				actionIndex,
				lastCheckPointFileSystem,
				requiredFileSystem: tutorialFunctions.getRequiredFileSystem(),
			});
		},
	};
	return tutorialFunctions;


	function formatCode(code, type) {
		code = code.split("\n").filter(line => line).join("\n");

		switch (type) {
			case "text/html":
				return html_beautify(code);
			case "text/css":
				return css_beautify(code);
			case "application/javascript":
				return js_beautify(code);
		}
	}

	function checkFileCodeCorrect(path, name) {
		const fileContents = fileSystemManager.getFileContents(path, name);
		// file doesn't exist
		if (fileContents === null) return false;

		const code = formatCode(fileContents, mime.getType(name));
		const correct = code === requiredFileSystem[`${path} ${name}`];

		fileSystemManager.setFileCorrectState(path, name, correct);

		return correct;
	}

	function checkFileSystemCorrect() {
		let correct = true;
		for (const filePath in requiredFileSystem) {
			const pathList = filePath.split(" ");
			const [path, name] = [pathList.slice(0, -1).join(" "), pathList.slice(-1)[0]];

			if (checkFileCodeCorrect(path, name)) correct = true;
		}

		return correct;
	}
}