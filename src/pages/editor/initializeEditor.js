import initializeUI from "./initializeUI.js";
import initializeTutorialFunctions from "./tutorialFunctions.js";

export default async function initializeEditor() {
	const hash = window.location.hash.substring(1);

	if (hash.startsWith("tutorial")) {
		const tutorialID = decodeURIComponent(hash.split("-")[1]);
		let tutorialData;
		try {
			tutorialData = (await import(`/data/tutorials/${tutorialID}.js`)).default;
		} catch {
			alertCustom("Error: Could not load tutorial<br><br>Tutorials can be accessed from the main page under the tutorials tab<br><br>You will be redirected automatically in 15 seconds");
			setTimeout(() => window.location.href = "//" + window.location.host, 15000);

			return;
		}

		tutorialData.info.id = tutorialID;

		if ("actionString" in tutorialData)
			tutorialData.actionList = parseActionString(tutorialData.actionString);

		runTutorial(tutorialData);
	} else if (hash.startsWith("editor")) {
		const projectName = decodeURIComponent(hash.split("-")[1]),
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
		window.tutorial = true;
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
		window.project = true;

		initializeUI("main");

		const { name, fileSystem } = projectData;

		document.getElementById("headerText").innerText =
			document.title =
			"Project: " + name;

		history.pushState(null, "");

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

	function parseActionString(actionString) {
		const sectionList = actionString.split("---").map(section => section.trim());
		const startingFileSystem = JSON.parse(sectionList.shift());

		const actionList = [
			[
				"beginTutorial",
			],
			[
				"loadFileSystem",
				startingFileSystem,
			],
			[
				"setRequiredFileSystem",
				startingFileSystem,
			],
		];

		for (let section of sectionList) {
			const placeholder = [0, 0, 0].map(() => Math.random().toString().slice(2)).join("");
			section = section.replaceAll("\n", placeholder);

			section = replaceMarkdown(section, "`", "`", string =>
				`<code class="highlightInline">${string}</code>`
			);

			section = replaceMarkdown(section, "<[", "]>", string => {
				const [mimeType, code] = string.split(new RegExp(placeholder + "(.*)", "s"));
				return `<pre data-lang="${mimeType}">${code.replaceAll(placeholder, "\n").trim()}</pre>`;
			});

			// instructCodeExecution
			if (section.slice(-3) === ">>>") {
				actionList.push(["instructCodeExecution", section.replaceAll(placeholder, "<br>").slice(0, -7)]);
				continue;
			}

			// instruct code action
			if (~section.indexOf("<{")) {
				const codeActions = [];
				section = replaceMarkdown(section, "<{", "}>", string => {
					const paramList = string.split(new RegExp(placeholder + "(.*)", "s"));
					const [actionInfo, text] = [paramList[0].split(" "), paramList[1].replaceAll(placeholder, "\n").trim()];
					actionInfo.splice(3, 0, actionInfo[1] === "s" ? [text, "utf-8"] : text);

					// if add file
					let requiredCodeMethodIndex = 1;
					if (actionInfo[0] === "f") requiredCodeMethodIndex = 0;

					codeActions.push([
						{
							"f": "addRequiredFile",
							"s": "setRequiredFileCode",
							"a": "appendRequiredFileCode",
							"i": "insertRequiredFileCode",
						}[actionInfo[requiredCodeMethodIndex]],
						...actionInfo.slice(requiredCodeMethodIndex + 1),
					]);

					return "";
				});


				// trim trailing br tags
				while (section.endsWith(placeholder)) section = section.slice(0, -placeholder.length);

				for (const action of codeActions)
					actionList.push(["instructCodeAction", section.replaceAll(placeholder, "<br>"), ...action]);

				continue;
			}

			// trim trailing br tags
			while (!section.lastIndexOf(placeholder) === placeholder.length) section = section.slice(0, -4);

			actionList.push(["info", section.replaceAll(placeholder, "<br>").trim()]);
		}

		actionList.push(
			["saveProgress"],
			["endTutorial"],
		);

		return actionList;


		function replaceMarkdown(string, startString, endString, handler) {
			let startIndex, resultString = "";
			while (startIndex = string.indexOf(startString), ~startIndex) {
				resultString += string.slice(0, startIndex);
				string = string.slice(startIndex + startString.length);

				const endIndex = string.indexOf(endString);
				if (!~endIndex) throw new Error("Start markup sequence is never closed");

				resultString += handler(string.slice(0, endIndex));
				string = string.slice(endIndex + endString.length);
			}
			resultString += string;

			return resultString;
		}
	}
}