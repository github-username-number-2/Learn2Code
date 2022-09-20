import initializeStorageManager from "/js/storageManager.js";
import { elementFromString } from "/js/functions.js";

window.addEventListener("load", async () => {
	// initialize global vars
	window.storageManager = await initializeStorageManager();

	// initialize sub page tabs
	const subPages = [
		...document.getElementsByClassName("subPage")
	].map(subPage => subPage.id);

	if (!subPages.includes(window.location.hash.substring(1))) {
		window.location.hash = "info";
	}
	switchSubPages(window.location.hash.substring(1));

	for (const index of subPages.keys()) {
		const subPageButton = document.getElementById(subPages[index] + "Button");
		subPageButton.style.left = "calc(11vh + " + index * 12 + "vw)";
		subPageButton.addEventListener("mousedown", () => {
			switchSubPages(subPages[index]);
		});
	}

	// initialize tutorial and editor tabs
	loadTutorialTab();
	loadEditorTab();


	async function loadTutorialTab() {
		const tutorialIndex = (await import("/data/tutorials/tutorialIndex.js")).default,
			{ entryPoint, tutorialList } = tutorialIndex;
		addTutorialElement(tutorialList[entryPoint]);

		const tutorialsContainer = document.getElementById("tutorials");
		for (const tutorial in tutorialList) {
			const tutorialProgress =
			await storageManager.getTutorialProgress(tutorial);

			tutorialsContainer.append(
				elementFromString(`
					<a target="_blank" href="${`//${window.location.host}/pages/editor.html#tutorial-${encodeURIComponent(tutorial)}`}">${tutorialList[tutorial].display}</a>
				`),
				elementFromString(`
					<p>${tutorialProgress.percentComplete}% complete | ${tutorialProgress.state} | ${tutorialProgress.completedOnce}</p>
				`),
				document.createElement("br"),
			);
		}

		function addTutorialElement(tutorialObject) {
		}
	}

	async function loadEditorTab() {
		const newProjectButton = document.getElementById("newProjectButton"),
			projectsContainer = document.getElementById("projectsContainer");

		newProjectButton.addEventListener("click", async () => {
			const name = await promptCustom("Project name:");

			if (name === null) return; // prompt was canceled
			if (!name) return alertCustom(`Project names cannot be blank`);
			if (!/^[0-9a-zA-Z ._-]+$/.test(name)) return alertCustom(`Project names can only contain characters "0-9", "a-z", "A-Z", ".", "_", "-" and " "`);
			if (name.startsWith(" ") || name.endsWith(" ")) return alertCustom(`Project names can not start or end with " "`);
			if (await storageManager.getProjectData(name)) return alertCustom(`A project with this name already exists`);


			storageManager.setProjectData({ name, fileSystem: { "index.html": ["", "utf-8"] } });

			window.location = `//${window.location.host}/pages/editor.html#editor-${encodeURIComponent(name)}`;
		});

		const keyList = await storageManager.getAllProjectKeys();
		for (const key of keyList) {
			const projectElement = elementFromString(`
				<div class="project">
					<p>${key}</p>
					<img title="Delete Project" src="/images/icons/deleteIcon.png">
					<img title="Rename Project" src="/images/icons/renameIcon.png">
				</div>
			`);
			projectElement.addEventListener("click", () =>
				window.open(`//${window.location.host}/pages/editor.html#editor-${encodeURIComponent(key)}`)
			);
			projectElement.children[1].addEventListener("click", async event => {
				event.stopPropagation();

				if (await confirmCustom("Are you sure you want to delete this project? This can not be undone.")) {
					const name = await promptCustom("Please type the name of this project to verify this action:");
					if (name === key) {
						storageManager.deleteProjectData(key);

						projectsContainer.innerHTML = "";
						loadEditorTab();
					} else if (name !== null /* prompt was canceled */) {
						alertCustom("Name did not match");
					}
				}
			});
			projectElement.children[2].addEventListener("click", async event => {
				event.stopPropagation();

				const newName = await promptCustom("Enter new project name:", { defaultValue: key });

				if (newName === null) return; // prompt was canceled
				if (!newName) return alertCustom(`Project names cannot be blank`);
				if (!/^[0-9a-zA-Z ._-]+$/.test(newName)) return alertCustom(`Project names can only contain characters "0-9", "a-z", "A-Z", ".", "_", "-" and " "`);
				if (newName.startsWith(" ") || newName.endsWith(" ")) return alertCustom(`Project names can not start or end with " "`);
				if (newName === key) return alertCustom("The name must be different then the current.");
				if (await storageManager.getProjectData(newName)) return alertCustom(`A project with this name already exists`);

				const projectData = await storageManager.getProjectData(key);
				await storageManager.setProjectData({ ...projectData, name: newName });
				await storageManager.deleteProjectData(key);

				projectsContainer.innerHTML = "";
				loadEditorTab();
			});

			projectsContainer.appendChild(projectElement);
		}
	}

	function switchSubPages(pageName) {
		for (const button of document.getElementsByClassName("subPageButton")) {
			button.style.height = "4.1vh";
			button.style.backgroundColor = "#cccccc";
			button.children[0].style.marginTop = "1vh";
		}

		for (const subPage of document.getElementsByClassName("subPage")) {
			subPage.style.display = "none";
		}

		const targetButton = document.getElementById(pageName + "Button");
		targetButton.style.height = "4.71vh";
		targetButton.style.backgroundColor = "#eeeeee";
		targetButton.children[0].style.marginTop = "0.8em";

		document.getElementById(pageName).style.display = "block";

		window.location.hash = pageName;
	}
});