export default async function createFileSystemManager() {
	// initialize editor
	const editor = monaco.editor.create(document.getElementById("editorContainer"), {
		value: "function hello() {\n\talert('Hello world!');\n}",
		language: "javascript",
		automaticLayout: true,
	});

	const filesContainer = document.getElementById("filesContainerInner");

	// load file extension mappings to icons
	const iconData = await (await fetch("/json/iconData.json")).json();

	// pre loads all icon images
	const iconNames = new Set();
	iconNames.add(`icons/languageIcons/${iconData.default[0]}.svg`);
	iconNames.add("icons/folderOpen.png");
	iconNames.add("icons/folderClosed.png");
	for (const mapping in iconData.mappings) {
		iconNames.add(`icons/languageIcons/${iconData.mappings[mapping][0]}.svg`);
	}

	const iconImages = {};
	await Promise.all([...iconNames].map(async iconName => {
		iconImages[iconName] = await loadImage(`/images/${iconName}`);
	}));

	return {
		fileSystem: {},
		activeItem: "root",

		loadFileSystem: function (fileSystem) {
			this.fileSystem = { "root": {} };

			for (const item in fileSystem) {
				this.addItem(item, fileSystem[item], "root");
			}
		},
		addItem: function (itemName, itemContents, targetDirectoryPath) {
			targetDirectoryPath = targetDirectoryPath.split(" ");
			const targetDirectoryName = targetDirectoryPath.pop();
			const targetDirectory = document.querySelector(`div[data-name="${targetDirectoryName}"][data-path="${targetDirectoryPath.join(" ")}"]`);
			const currentPath = targetDirectoryPath.length ? `${targetDirectoryPath.join(" ")} ${targetDirectoryName}` : targetDirectoryName;
			const itemDepth = targetDirectoryPath.length + 1;
			const isDirectory = typeof itemContents === "object";

			const itemElement = elementFromString(
				`<div class="file" data-path="${currentPath}"><canvas class="fileIcon"></canvas><p class="fileText"></p></div>`
			);
			itemElement.setAttribute("data-name", itemName);
			itemElement.style.display = itemDepth - 1 ? "none" : "block";

			const icon = itemElement.children[0],
				text = itemElement.children[1];

			icon.width = 100;
			icon.height = 100;
			const { width, height } = icon;

			icon.style.left = itemDepth * 1.5 + "vw";

			text.innerText = itemName;
			text.style.left = itemDepth * 1.5 + "vw";

			const context = icon.getContext("2d");

			let targetDirectoryObject = this.fileSystem;
			for (const directory of currentPath.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}
			targetDirectoryObject[itemName] = isDirectory ? {} : itemContents;

			const itemPlacementIndex = sortDirectoryToArray(targetDirectoryObject).findIndex(name => name[0] === itemName);
			const itemPrevious = [
				targetDirectory,
				...[...document.querySelectorAll(`.file[data-path="${currentPath}"]`)].map(item => getItemLastChild(item)),
			][itemPlacementIndex];
			itemPrevious.after(itemElement);

			itemElement.addEventListener("click", () => this.setActiveItem(itemElement));

			if (isDirectory) {
				itemElement.addEventListener("click", () => toggleDirectory(itemElement));
				itemElement.setAttribute("data-directory-state", "0");
				itemElement.setAttribute("data-is-directory", "1");

				context.drawImage(iconImages["icons/folderClosed.png"], 0, 0, width, height);

				for (const subItem in itemContents) {
					this.addItem(subItem, itemContents[subItem], `${currentPath} ${itemName}`);
				}
			} else {
				const iconData = getFileIconFromName(itemName);
				context.drawImage(
					iconImages[`icons/languageIcons/${iconData[0]}.svg`],
					0,
					0,
					width,
					height,
				);

				context.globalCompositeOperation = "source-in";
				context.fillStyle = iconData[1];
				context.fillRect(0, 0, width, height);
			}
		},
		removeItem: function (targetItemName, targetItemPath) {
			const targetItem = document.querySelector(`.file[data-name="${targetItemName}"][data-path="${targetItemPath}"]`);

			if (targetItem.getAttribute("data-is-directory")) {
				const subItems = document.querySelectorAll(`.file[data-path^="${`${targetItemPath} ${targetItemName}`}"]`);
				for (const subItem of subItems) {
					filesContainer.removeChild(subItem);
				}
			}

			filesContainer.removeChild(targetItem);

			let targetDirectoryObject = this.fileSystem;
			for (const directory of targetItemPath.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}
			delete targetDirectoryObject[targetItemName];
		},
		changeItemName: function (newItemName, targetItemName, targetItemPath) {
			let targetDirectoryObject = this.fileSystem;
			for (const directory of targetItemPath.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}
			const contents = targetDirectoryObject[targetItemName];

			this.removeItem(targetItemName, targetItemPath);
			this.addItem(newItemName, contents, targetItemPath);
		},
		setActiveItem: function (itemElement) {
			this.activeItem = itemElement;

		},
	};

	function elementFromString(string) {
		const template = document.createElement("template");
		template.innerHTML = string;

		return template.content.firstChild;
	}

	function getItemLastChild(item) {
		if (item.getAttribute("data-is-directory")) {
			const directoryName = item.getAttribute("data-name"),
				directoryPath = item.getAttribute("data-path");
			const childElements = document.querySelectorAll(`.file[data-path^="${directoryPath} ${directoryName}"]`);

			return childElements[childElements.length - 1];
		} else {
			return item;
		}
	}

	function toggleDirectory(directoryElement) {
		const show = !parseInt(directoryElement.getAttribute("data-directory-state"));
		const directoryName = directoryElement.getAttribute("data-name"),
			directoryPath = directoryElement.getAttribute("data-path");

		const subItems = show
			? document.querySelectorAll(`.file[data-path="${`${directoryPath} ${directoryName}`}"]`)
			: document.querySelectorAll(`.file[data-path^="${`${directoryPath} ${directoryName}`}"]`);


		for (const item of subItems) {
			if (show) {
				item.style.display = "block";
			} else {
				item.style.display = "none";

				if (item.getAttribute("data-is-directory")) {
					const targetCanvas = item.children[0],
						{ width, height } = targetCanvas;

					const context = targetCanvas.getContext("2d");
					context.clearRect(0, 0, width, height);
					context.drawImage(iconImages["icons/folderClosed.png"], 0, 0, width, height);

					item.setAttribute("data-directory-state", "0");
				}
			}
		}

		const targetCanvas = directoryElement.children[0],
			{ width, height } = targetCanvas;

		const context = targetCanvas.getContext("2d");
		context.clearRect(0, 0, width, height);
		context.drawImage(iconImages[show ? "icons/folderOpen.png" : "icons/folderClosed.png"], 0, 0, width, height);

		directoryElement.setAttribute("data-directory-state", show ? 1 : 0);
	}

	function sortDirectoryToArray(directoryObject) {
		const fileArray = [],
			directoryArray = [];
		for (const item in directoryObject) {
			const itemContents = directoryObject[item];
			typeof itemContents === "string"
				? fileArray.push([item, itemContents])
				: directoryArray.push([item, itemContents]);
		}

		return [...directoryArray.sort(), ...fileArray.sort()];
	}

	function getFileIconFromName(fileName) {
		const searchString = fileName.substring(fileName.indexOf("."));

		const iconMapping = iconData.mappings[fileName] || iconData.mappings[searchString] || iconData.default;

		return iconMapping;
	}

	function loadImage(url) {
		return new Promise(resolve => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.src = url;
		});
	}
}