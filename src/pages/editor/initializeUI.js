import mime from "/js/libraries/mime.js";
import { stringToArrayBuffer } from "/js/functions.js";

export default function initializeUI(defaultTab) {
	const panelContainer = document.getElementById("panelContainer"),
		editorContainer = document.getElementById("editorContainer");

	const resizeContainers = (function () {
		const intervals = [];
		let mouseX;
		window.addEventListener("mousemove", event => mouseX = event.pageX);

		return {
			resizeOnce() {
				const separatorStyle = getComputedStyle(separator),
					separatorWidth = parseInt(separatorStyle.width.slice(0, -2));

				const xOffset = separator.getBoundingClientRect().x;

				editorContainer.style.width = window.innerWidth - xOffset - separatorWidth + "px";

				fileSystemManager.editor.layout();
				if (window.tutorial)
					fileSystemManager.tutorialDifferenceEditor.layout();
			},
			startResize(event) {
				separator.children[0].style.backgroundColor = "#595959";

				const separatorStyle = getComputedStyle(separator),
					separatorWidth = parseInt(separatorStyle.width.slice(0, -2));

				let xOffset = event.pageX - separator.getBoundingClientRect().x;
				intervals.push(setInterval(() => {
					// set left and right limiters
					if (mouseX - xOffset < separatorWidth) mouseX = xOffset = 0;
					if (mouseX - xOffset > window.innerWidth - separatorWidth * 2) {
						mouseX = window.innerWidth - separatorWidth;
						xOffset = 0;
					}

					separator.style.left = mouseX - xOffset + "px";
					panelContainer.style.width = mouseX - xOffset + "px";
					editorContainer.style.width = window.innerWidth - mouseX + xOffset - separatorWidth + "px";

					fileSystemManager.editor.layout();
					if (window.tutorial)
						fileSystemManager.tutorialDifferenceEditor.layout();
				}, 20));
			},
			stopResize() {
				separator.children[0].style.removeProperty("background-color");
				intervals.filter(interval => clearInterval(interval));
			},
		};
	})();


	const separator = document.getElementById("containersSeparator");
	separator.addEventListener("mousedown", event => resizeContainers.startResize(event));
	window.addEventListener("mouseup", () => resizeContainers.stopResize());
	window.addEventListener("resize", () => resizeContainers.resizeOnce());

	for (const tab of document.getElementsByClassName("panelTab")) {
		tab.addEventListener("click",
			event => selectTab(event.target.id.slice(0, -8))
		);
	}

	selectTab(defaultTab);


	const encodingOptionContainer = document.getElementById("fileOptionEncodingContainer");
	encodingOptionContainer.addEventListener("click", event => {
		event.stopPropagation();

		encodingOptionContainer.style.height = encodingOptionContainer.style.height === "fit-content"
			? "100%"
			: "fit-content";
	});
	document.body.addEventListener("click", () =>
		encodingOptionContainer.style.height = "100%"
	);
	for (const encodingOption of document.getElementsByClassName("fileEncodingOption")) {
		encodingOption.addEventListener("click", () =>
			fileSystemManager.changeFileEncodingScheme(
				fileSystemManager.activeFilePath,
				fileSystemManager.activeFile,
				encodingOption.getAttribute("data-value"),
			)
		);
	}

	const codeTab = document.getElementById("editorTabFileName"),
		previewTab = document.getElementById("editorTabPreview"),
		previewMask = document.getElementById("filePreviewMask");

	codeTab.addEventListener("click", () => {
		for (const frame of document.getElementsByClassName("filePreviewFrame"))
			frame.remove();

		previewMask.style.display = "none";
	});
	previewTab.addEventListener("click", () => {
		previewMask.style.display = "block";

		const targetFile = fileSystemManager.activeFile,
			targetPath = fileSystemManager.activePath;
		const currentFilePath =
			(targetPath.substring(4) + " " + targetFile).replaceAll(" ", "/");

		const targetFileContents = fileSystemManager.getFileContents(targetPath, targetFile),
			targetFileEncoding = fileSystemManager.getFileEncodingScheme(targetPath, targetFile);

		const previewFrame = document.createElement("iframe");
		previewFrame.classList.add("filePreviewFrame");
		previewFrame.width = previewMask.offsetWidth;
		editorContainer.append(previewFrame);

		previewFrame.addEventListener(
			"load",
			() => previewMask.style.display = "none",
		);

		webCodeExecutor.executeFilesList(
			[[
				(targetPath.substring(4) + " " + targetFile).trim(),
				stringToArrayBuffer(targetFileContents, targetFileEncoding),
				mime.getType(targetFile) || "text/plain",
			]],
			() => previewFrame.src = executorRootURL + currentFilePath,
		);
	});

	const editorTabs = document.getElementsByClassName("editorTab");
	for (const tab of editorTabs)
		tab.addEventListener("click", () => {
			for (const tab of editorTabs)
				tab.children[0].style.backgroundColor = null;
			tab.children[0].style.backgroundColor = "#cccccc";
		});
}

export function selectTab(tabName) {
	const tabs = document.getElementsByClassName("panelTab");
	for (const tab of tabs) {
		tab.style.backgroundColor = "#eeeeee";
	}

	const contentContainers = document.getElementsByClassName("panelContent");
	for (const container of contentContainers) {
		container.style.display = "none";
	}

	document.getElementById(tabName + "PanelTab").style.backgroundColor = "#cccccc";
	document.getElementById(tabName + "PanelContent").style.display = "block";
}