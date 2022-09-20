import mime from "/js/libraries/mime.js";
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
	document.body.append(tutorialMaskElement);
	document.body.append(tutorialNextElement);
	document.body.append(tutorialStartElement);

	document.getElementById("headerText").innerText =
		document.title =
		"Tutorial: " + display;

	history.pushState(null, "");

	const revertFileSystemButton = document.getElementById("revertFileSystemButton");
	revertFileSystemButton.addEventListener("click", async () => {
		if (await confirmCustom("Are you sure you would like to revert the file system back the the last checkpoint?")) {
			tutorialFunctions.revertFileSystem();
		}
	});


	// initialize file correct checker
	let lastCheckPointFileSystem, requiredFileSystem = {}, timeout, resolveFunction = () => { };
	fileSystemManager.fileSystemChangeListeners.tutorialChangeListener = type => {
		const activeFile = fileSystemManager.activeFile,
			activePath = fileSystemManager.activePath;

		clearTimeout(timeout);
		timeout = setTimeout(() => {
			switch (type) {
				case "edit":
					if (!checkFileCodeCorrect(activePath, activeFile)) break;
					if (checkFileSystemCorrect()) resolveFunction();
					break;
				case "addItem":
				case "removeItem":
					if (checkFileSystemCorrect()) resolveFunction();
					break;
			}
		}, 600);
	};

	const tutorialFunctions = {
		resolveOnEvent(event, element) {
			return new Promise(resolve => {
				element.addEventListener(event, function handler() {
					element.removeEventListener(event, handler);

					resolve();
				});
			});
		},
		addRequiredFile(fullPath) {
			requiredFileSystem["root " + fullPath.replaceAll("/", " ")] = ["", "utf-8"];
		},
		setRequiredFileCode(filePath, requiredCode) {
			const path = ["root", ...filePath.split(" ")],
				name = path.pop();

			requiredFileSystem["root " + filePath] = [formatCode(requiredCode[0], mime.getType(name)) || "text/plain", requiredCode[1]];

			checkFileCodeCorrect(path.join(" "), name);
		},
		appendRequiredFileCode(filePath, requiredCode) {
			const path = ["root", ...filePath.split(" ")],
				name = path.pop();
			const currentCode = requiredFileSystem["root " + filePath][0];

			requiredFileSystem["root " + filePath][0] = formatCode(currentCode + requiredCode, mime.getType(name) || "text/plain");

			checkFileCodeCorrect(path.join(" "), name);
		},
		insertRequiredFileCode(filePath, requiredCode, lineNumber, deleteCount) {
			const path = ["root", ...filePath.split(" ")],
				name = path.pop();

			const requiredFileObject = requiredFileSystem["root " + filePath];
			requiredFileObject[0] = requiredFileObject[0].split("\n");
			requiredFileObject[0].splice(lineNumber, deleteCount, requiredCode);
			requiredFileObject[0] = formatCode(requiredFileObject[0].join("\n"), mime.getType(name) || "text/plain");

			checkFileCodeCorrect(path.join(" "), name);
		},
		setRequiredFileSystem(fileSystem) {
			requiredFileSystem = {};

			addDirectoryFiles(fileSystem, "root");

			function addDirectoryFiles(directory, path) {
				for (const item in directory) {
					const itemValue = directory[item];
					if (Array.isArray(itemValue)) {
						const code = formatCode(itemValue[0], mime.getType(item) || "text/plain");

						requiredFileSystem[`${path} ${item}`] = [code, itemValue[1]];
					} else {
						addDirectoryFiles(itemValue, `${path} ${item}`);
					}
				}
			}

			checkFileSystemCorrect();
		},
		getRequiredFileSystemObject() {
			const fileSystemObject = {};
			for (const pathString in requiredFileSystem) {
				const filePath = pathString.split(" "),
					fileName = filePath.pop();

				// remove root object
				filePath.shift();

				let currentDirectoryObject = fileSystemObject;
				for (const item of filePath) {
					currentDirectoryObject = currentDirectoryObject[item] =
						currentDirectoryObject[item] || {};
				}
				currentDirectoryObject[fileName] = requiredFileSystem[pathString];
			}

			return fileSystemObject;
		},
		resolveOnCodeCorrect() {
			return new Promise(resolve =>
				resolveFunction = () => {
					fileSystemManager.clearFileHints();

					resolve();
				}
			);
		},
		beginTutorial() {
			return new Promise(resolve => {
				tutorialFunctions.disableInteraction();

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
			this.clearAll();
			this.displayText(`You have completed the ${display} tutorial. Click the next button to be redirected back to the home page.`);
			await this.displayNextButton();

			window.location.href = "//" + window.location.host;
		},
		async loadFileSystem(fileSystem) {
			// await all fetch requests
			fileSystem = await iterate(fileSystem);

			fileSystemManager.loadFileSystem(fileSystem);
			checkFileSystemCorrect();

			// clone file system object
			lastCheckPointFileSystem = JSON.parse(JSON.stringify(fileSystem));
			revertFileSystemButton.disabled = false;

			async function iterate(object) {
				for (const key in object) {
					const value = object[key];

					if (Array.isArray(value)) {
						object[key][0] = await value[0];
					} else {
						object[key] = await iterate(value);
					}
				}

				return object;
			}
		},
		async revertFileSystem() {
			await this.loadFileSystem(lastCheckPointFileSystem);
		},
		displayText(text, codeTimer = false) {
			const popupElement = elementFromString(`
				<div class="tutorialPopup">
					<div class="tutorialPopupHeader">
						<img class="tutorialCollapseButton" src="/images/icons/collapseIcon.png">
						${codeTimer === true ? `<p class="tutorialPopupTimer">60</p>` : ""}
					</div>
					<div class="tutorialPopupContent">
						<p>${text.replaceAll("<pre", "</p><pre").replaceAll("</pre>", "</pre><p>")}</p>
					</div>
				</div>
			`);

			const header = popupElement.querySelector(".tutorialPopupHeader"),
				collapseIcon = popupElement.querySelector(".tutorialCollapseButton"),
				timer = popupElement.querySelector(".tutorialPopupTimer"),
				content = popupElement.querySelector(".tutorialPopupContent");

			let isCollapsed = false;
			header.addEventListener("click", () => {
				isCollapsed = !isCollapsed;

				popupElement.classList.toggle("tutorialPopupCollapsed");
				collapseIcon.classList.toggle("tutorialCollapseButtonCollapsed");

				for (const element of [...content.children, timer, showCorrectButton])
					element && (element.style.display = isCollapsed ? "none" : "block");

				popupElement.style.boxShadow = {
					[true]: "none",
					[false]: "0 0 10vh 0.1vh #bbbbbb",
				}[isCollapsed];

				if (popupElement.contains(showCorrectButton)) {
					header.style.width = {
						[true]: "100%",
						[false]: "calc(100% - 14vh)",
					}[isCollapsed];

					header.style.borderTopRightRadius = {
						[true]: "2vh",
						[false]: "0",
					}[isCollapsed];

					collapseIcon.style.left = {
						[true]: "50%",
						[false]: "calc((100% + 14vh) / 2)",
					}[isCollapsed];
				}
			});

			document.body.appendChild(popupElement);

			const showCorrectButton = document.createElement("button");
			if (codeTimer === true) {
				let timerInterval, remainingTime = 59;

				// timer only runs when the page is active
				if (document.visibilityState === "visible") startTimer();
				document.addEventListener(
					"visibilitychange",
					() => ({ visible: startTimer, hidden: stopTimer }[document.visibilityState]()),
				);

				function startTimer() {
					stopTimer();

					timerInterval = setInterval(() => {
						timer.innerText = remainingTime;

						if (remainingTime-- < 1) {
							stopTimer();

							showCorrectButton.innerText = "Show correct code";
							showCorrectButton.title = "Create all required files/folders and show the correct code for each file";
							showCorrectButton.classList.add("tutorialPopupShowCorrect");

							showCorrectButton.addEventListener("click", event => {
								event.stopPropagation();
								displayCorrectCode();
							});

							if (isCollapsed) {
								showCorrectButton.style.display = "none";
							} else {
								header.style.width = "calc(100% - 14vh)";
								header.style.borderTopRightRadius = "0";

								collapseIcon.style.left = "calc((100% + 14vh) / 2)";
							}

							timer.remove();
							popupElement.append(showCorrectButton);
						}
					}, 1000);
				}
				function stopTimer() {
					clearInterval(timerInterval);
				}
			}
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
		displayTextAndSetPanel(text, codeTimer = false) {
			this.displayText(text, codeTimer);
			this.setPanelText(text);
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
		clearAll() {
			this.clearHighlighters();
			this.clearText();
			this.setPanelText("");
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
		highlightAllCode() {
			for (const element of document.querySelectorAll("[data-lang]")) {
				monaco.editor.colorizeElement(element, element.getAttribute("data-lang"));
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
				requiredFileSystem: this.getRequiredFileSystemObject(),
			});
		},

		// higher level actions
		async info(text) {
			this.clearAll();
			this.enableInteraction();
			this.displayText(text);
			this.highlightAllCode();
			await this.displayNextButton();
		},
		async infoWithHighlight(text, selector) {
			this.clearAll();
			this.disableInteraction();
			this.highlightElement(selector);
			this.displayText(text);
			this.highlightAllCode();
			await this.displayNextButton();
		},
		async instructEventAction(text, event, element) {
			this.clearAll();
			this.enableInteraction();
			this.displayTextAndSetPanel(text);
			this.highlightAllCode();
			await this.resolveOnEvent(event, element);
		},
		async instructCodeAction(text, requiredCodeMethod, ...requiredCodeMethodParams) {
			const actionIndex = requiredCodeMethodParams.pop();

			this[requiredCodeMethod](...requiredCodeMethodParams);
			this.clearAll();
			this.enableInteraction();
			this.displayTextAndSetPanel(text, true);
			this.highlightAllCode();
			await this.resolveOnCodeCorrect();
			this.saveProgress(actionIndex + 1);
		},
		async instructCodeExecution(text) {
			this.clearAll();
			this.displayTextAndSetPanel(text);
			await this.resolveOnEvent("click", document.getElementById("runCode"));
		},
	};
	return tutorialFunctions;


	function formatCode(code, type) {
		switch (type) {
			case "text/html":
				code = html_beautify(code);
				break;
			case "text/css":
				code = css_beautify(code);
				break;
			case "application/javascript":
				code = js_beautify(code);
				break;
		}

		// remove new lines, carriage returns and trim white space
		return code
			.replaceAll("\r", "")
			.split("\n")
			.filter(line => line)
			.map(line => line.trim())
			.join("\n");
	}

	function checkFileCodeCorrect(path, name) {
		// no file open
		if (!path && !name) return true;

		const fileContents = fileSystemManager.getFileContents(path, name);
		// file doesn't exist
		if (fileContents === null) return false;

		let correct;

		// check if file is required
		if (requiredFileSystem[`${path} ${name}`]) {
			const [requiredCode, requiredEncoding] = requiredFileSystem[`${path} ${name}`];

			const code = formatCode(fileContents, mime.getType(name) || "text/plain"),
				encoding = fileSystemManager.getFileEncodingScheme(path, name);

			correct = requiredCode === code && requiredEncoding === encoding;
		} else {
			correct = false;
		}

		fileSystemManager.setFileCorrectState(path, name, correct);

		return correct;
	}

	function checkFileSystemCorrect() {
		let correct = true;
		for (const filePath in requiredFileSystem) {
			const pathList = filePath.split(" ");
			const [path, name] = [pathList.slice(0, -1).join(" "), pathList.slice(-1)[0]];

			if (!checkFileCodeCorrect(path, name)) correct = false;
		}

		return correct;
	}

	async function displayCorrectCode() {
		for (const requiredFile in requiredFileSystem) {
			if (!(requiredFile in fileSystemManager.fileDifferenceEditors)) {
				const pathList = requiredFile.split(" ");
				const [path, name] = [pathList.slice(0, -1).join(" "), pathList.slice(-1)[0]];

				if (!checkFileCodeCorrect(path, name))
					fileSystemManager.showFileHint(path, name, requiredFileSystem[requiredFile]);
			}
		}
	}
}