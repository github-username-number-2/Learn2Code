import initializeStorageManager from "/js/storageManager.js";
import { elementFromString } from "/js/functions.js";


window.addEventListener("load", async () => {
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

	// initialize global vars
	window.storageManager = await initializeStorageManager();

	// initialize tutorial and editor tabs
	loadTutorialTab();
	loadEditorTab();


	async function loadTutorialTab() {
		const tutorialIndex = (await import("/data/tutorials/tutorialIndex.js")).default,
			{ tutorialList } = tutorialIndex,
			tutorialDataList = {},
			tutorialProgressList = {};

		let rightMostContainerPosition = 0, bottomMostContainerPosition = 0, currentTutorialID;
		const tutorialsContainer = document.getElementById("tutorialsContainerInner"),
			previewTitle = document.getElementById("tutorialPreviewTitle"),
			previewDescription = document.getElementById("tutorialPreviewDescription"),
			previewImage = document.getElementById("tutorialPreviewImage"),
			previewBackButton = document.getElementById("tutorialPreviewBack"),
			previewResetButton = document.getElementById("tutorialPreviewReset"),
			previewDeleteButton = document.getElementById("tutorialPreviewDelete"),
			openButtonLink = document.getElementById("tutorialOpenButtonLink"),
			openButton = openButtonLink.children[0],
			previewRelatedLinks = document.getElementById("tutorialPreviewRelatedLinks"),
			previewElements = document.getElementsByClassName("tutorialPreview");

		for (const tutorialID in tutorialList) {
			const tutorialProgress = await storageManager.getTutorialProgress(tutorialID),
				tutorialData = tutorialList[tutorialID];

			const tutorialElement =
				elementFromString(`
					<div id="tutorial_${tutorialID}" class="tutorialContainer" style="left: ${tutorialData.left}vh; top: ${tutorialData.top}vh">
						<div class="difficultyBar"></div>
						<img src="/data/tutorials/resources/${tutorialID}/icon.png">
						<h1>${tutorialData.display}</h1>
						<p>${Math.trunc(tutorialProgress.progressPercent)}% Complete</p>
						<div class="tutorialMask"></div>
					</div>
				`);
			tutorialsContainer.append(tutorialElement);

			tutorialElement.addEventListener("mousedown", event => event.stopPropagation());

			tutorialElement.addEventListener("click", () => {
				currentTutorialID = tutorialID;

				previewTitle.innerText = tutorialData.display;
				previewDescription.innerText = tutorialData.description;
				previewImage.src = `/data/tutorials/resources/${tutorialID}/icon.png`;
				openButtonLink.href = `//${window.location.host}/pages/editor.html#tutorial-${encodeURIComponent(tutorialID)}`;

				for (const link of document.querySelectorAll(".tutorialPreviewLink"))
					link.remove();
				for (const link of tutorialData.relatedLinks)
					previewRelatedLinks.append(
						elementFromString(`<a class="tutorialPreviewLink" href="${link}" target="_blank">${link}</a>`)
					);

				const unlocked = tutorialLockedStates[tutorialID];
				openButton.disabled = !unlocked;
				unlocked
					? openButton.removeAttribute("title")
					: openButton.title = "Complete the previous tutorials to unlock this one";

				for (const tutorialPreviewElement of previewElements)
					tutorialPreviewElement.style.display = "block";
			});

			tutorialDataList[tutorialID] = tutorialData;
			tutorialProgressList[tutorialID] = tutorialProgress;

			rightMostContainerPosition = Math.max(rightMostContainerPosition, tutorialData.left);
			bottomMostContainerPosition = Math.max(bottomMostContainerPosition, tutorialData.top);
		}

		const tutorialSpacer = document.getElementById("tutorialSpacer");
		tutorialSpacer.style.left = rightMostContainerPosition + "vh";
		tutorialSpacer.style.top = bottomMostContainerPosition + "vh";

		// store tutorial locked states
		const tutorialLockedStates = {};
		for (const tutorialID in tutorialProgressList) {
			const prerequisites = tutorialDataList[tutorialID].prerequisites,
				unlocked = prerequisites.every(requiredTutorialID =>
					tutorialProgressList[requiredTutorialID].completedOnce
				);

			tutorialLockedStates[tutorialID] = unlocked;

			const tutorialElement = document.getElementById("tutorial_" + tutorialID);
			tutorialElement.querySelector(".tutorialMask").style.display = unlocked ? "none" : null;
		}

		// enable tutorial back, reset, and delete buttons
		previewBackButton.addEventListener("click", () => {
			for (const tutorialPreviewElement of previewElements)
				tutorialPreviewElement.style.display = "none";
		});
		previewResetButton.addEventListener("click", async () => {
			if (await confirmCustom("Are you sure you would like to clear progress for this tutorial?<br><br>All unlocked tutorials will stay unlocked.")) {
				await storageManager.setTutorialProgress(currentTutorialID, { progressPercent: 0 });
				await storageManager.deleteTutorialData(currentTutorialID);

				window.location.reload();
			}
		});
		previewDeleteButton.addEventListener("click", async () => {
			if (await confirmCustom("Are you sure you would like to clear all progress for this tutorial?<br><br>Any tutorials requiring this one as a prerequisite will become locked.")) {
				await storageManager.deleteTutorialProgress(currentTutorialID);
				await storageManager.deleteTutorialData(currentTutorialID);

				window.location.reload();
			}
		});

		// enable drag to scroll
		const origin = {};
		const tutorialTabContent = document.getElementById("tutorials");
		tutorialTabContent.addEventListener("mousedown", event => {
			origin.x = event.clientX;
			origin.y = event.clientY;
			origin.scrollX = tutorialTabContent.scrollLeft;
			origin.scrollY = tutorialTabContent.scrollTop;


			tutorialTabContent.addEventListener("mousemove", mouseMove);
		});
		window.addEventListener("mouseup", () =>
			tutorialTabContent.removeEventListener("mousemove", mouseMove)
		);

		function mouseMove(event) {
			tutorialTabContent.scrollLeft = origin.x + origin.scrollX - event.clientX;
			tutorialTabContent.scrollTop = origin.y + origin.scrollY - event.clientY;
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