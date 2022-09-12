import mime from "https://cdn.skypack.dev/pin/mime@v3.0.0-Mgy8KWi04WDrrthUM8WI/mode=imports,min/unoptimized/lite.js";
import { elementFromString, isValidUTF8, stringToArrayBuffer, arrayBufferToString, checkCharacterValid } from "/js/functions.js";

export default async function createFileSystemManager() {
	const filesContainer = document.getElementById("filesContainerInner");
	const resizeObserver = new ResizeObserver(handleResize);
	resizeObserver.observe(filesContainer);

	// initialize new file and folder buttons
	document.getElementById("newFileButton").addEventListener("click", () => addNewItem("file"));
	document.getElementById("newFolderButton").addEventListener("click", () => addNewItem("folder"));

	// initialize editor
	const codeContainer = document.getElementById("codeContainer");
	const editor = monaco.editor.create(codeContainer, {
		automaticLayout: true,
		readOnly: true,
	});
	const defaultModel = monaco.editor.createModel(
		"no files currently open",
		"plaintext",
		monaco.Uri.file("root"),
	);
	editor.setModel(defaultModel);

	// for fileSystemChangeListeners
	let timeout;
	editor.onDidChangeModelContent(() => {
		Object.values(manager.fileSystemChangeListeners).forEach(listener => listener("edit"));

		clearTimeout(timeout);
		timeout = setTimeout(
			() => setFileEncodingWarnings(
				editor.getModel(),
				manager.activeFileEncodingScheme,
				manager.activeFileEncodingSchemeDisplay,
			),
			250,
		);
	});


	// load file extension mappings to icons
	const iconData = await (await fetch("/data/iconData.json")).json();

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

	let fileSystem;

	const manager = {
		editor,

		activeFile: "",
		activeFilePath: "",
		activeFileEncodingScheme: "",
		activeFileEncodingSchemeDisplay: "",

		activeItem: "",
		activePath: "",

		fileSystemChangeListeners: {},

		loadFileSystem(newFileSystem) {
			editor.setModel(defaultModel);
			editor.updateOptions({ readOnly: true });

			fileSystem = { "root": {} };

			// set object properties to defaults
			this.activeFile = "";
			this.activeFilePath = "";
			this.activeFileEncodingScheme = "";
			this.activeFileEncodingSchemeDisplay = "";

			this.activeItem = "root";
			this.activePath = "";

			filesContainer.innerHTML = `<div id="fileSystemRoot" data-path="" data-name="root" data-is-directory="1" data-directory-state="1"></div>`;

			for (const model of monaco.editor.getModels()) {
				if (model !== defaultModel) model.dispose();
			}

			// add top level items, addItem will add sub items within folders recursively
			for (const item in newFileSystem) {
				this.addItem(item, newFileSystem[item], "root");
			}
		},
		selectItem(itemName, itemPath) {
			return filesContainer.querySelector(`div[data-name="${itemName}"][data-path="${itemPath}"]`);
		},
		getImmidiateWithinDirectory(directoryPath) {
			return filesContainer.querySelectorAll(`div[data-path="${directoryPath}"]`);
		},
		getAllWithinDirectory(directoryPath) {
			return filesContainer.querySelectorAll(`div[data-path^="${directoryPath}"]`);
		},
		getItemName(itemElement) {
			return itemElement.getAttribute("data-name");
		},
		addItem(itemName, itemValue, targetDirectoryFullPath) {
			const isDirectory = !Array.isArray(itemValue);
			const [itemContents, encodingScheme] = isDirectory ? [itemValue] : itemValue;

			const [targetDirectoryName, targetDirectoryPath] = splitPath(targetDirectoryFullPath);
			const targetDirectory = this.selectItem(targetDirectoryName, targetDirectoryPath);

			const currentPath = targetDirectoryPath.length ? `${targetDirectoryPath} ${targetDirectoryName}` : targetDirectoryName,
				itemDepth = targetDirectoryFullPath.split(" ").length;

			const itemElement = elementFromString(`
				<div class="file" data-path="${currentPath}">
					<canvas class="fileIcon"></canvas>
					<p class="fileText"></p>
					<img class="fileOption fileDelete" src="/images/icons/deleteIcon.png">
					<img class="fileOption fileRename" src="/images/icons/renameIcon.png">
				</div>
			`);
			itemElement.setAttribute("data-name", itemName);
			itemElement.style.display = itemDepth - 1 ? "none" : "block";

			const [
				icon,
				text,
				deleteButton,
				renameButton,
			] = itemElement.children;

			icon.width = 100;
			icon.height = 100;
			const { width, height } = icon;

			icon.style.left = itemDepth * 2.5 + "vh";

			text.innerText = itemName;
			text.style.marginLeft = itemDepth * 2.5 + "vh";

			deleteButton.addEventListener("click", async event => {
				event.stopPropagation();

				if (await confirmCustom(`Delete "${itemName}" and all of its contents?`))
					manager.removeItem(itemName, currentPath);
			});
			renameButton.addEventListener("click", async event => {
				event.stopPropagation();

				const newName = await promptCustom("Enter new name:", { defaultInputValue: itemName });
				if (
					newName !== null // prompt was canceled
					&& checkItemValid(newName, currentPath, isDirectory ? "folder" : "file")
				) manager.changeItemName(newName, itemName, currentPath);
			});

			const context = icon.getContext("2d");

			let targetDirectoryObject = fileSystem;
			for (const directory of currentPath.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}
			targetDirectoryObject[itemName] = isDirectory ? {} : encodingScheme;

			const itemPlacementIndex = sortDirectoryToArray(targetDirectoryObject).findIndex(name => name[0] === itemName);
			const itemPrevious = [
				targetDirectory,
				...[...this.getImmidiateWithinDirectory(currentPath)].map(item => getItemLastChild(item)),
			][itemPlacementIndex];
			itemPrevious.after(itemElement);

			itemElement.addEventListener("click", () => this.setActiveItem(itemElement));

			if (isDirectory) {
				itemElement.addEventListener("click", () => this.toggleDirectory(itemElement));
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

				monaco.editor.createModel(
					itemContents,

					// set language to plaintext if encoding is not utf-8
					encodingScheme === "utf-8" ? undefined : "plaintext",

					monaco.Uri.file(`${currentPath} ${itemName}`),
				);
			}

			handleResize();

			for (const listener of Object.values(this.fileSystemChangeListeners)) listener("addItem");
		},
		removeItem(targetItemName, targetItemPath) {
			const targetItem = this.selectItem(targetItemName, targetItemPath);

			const removeItem = (itemPath, itemName, itemElement) => {
				if (this.activeItem === itemName && this.activePath === itemPath)
					this.setActiveItem(document.getElementById("fileSystemRoot"));

				itemElement.remove();
			};

			if (targetItem.getAttribute("data-is-directory")) {
				// gets all items recursively
				const subItems = this.getAllWithinDirectory(`${targetItemPath} ${targetItemName}`);
				for (const subItem of subItems) {
					const subItemPath = subItem.getAttribute("data-path"),
						subItemName = subItem.getAttribute("data-name");

					if (!subItem.getAttribute("data-is-directory"))
						monaco.editor.getModel(monaco.Uri.file(`${subItemPath} ${subItemName}`)).dispose();

					removeItem(subItemPath, subItemName, subItem);
				}
			} else {
				monaco.editor.getModel(monaco.Uri.file(`${targetItemPath} ${targetItemName}`)).dispose();
			}

			removeItem(targetItemPath, targetItemName, targetItem);

			let targetDirectoryObject = fileSystem;
			for (const directory of targetItemPath.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}
			delete targetDirectoryObject[targetItemName];

			for (const listener of Object.values(this.fileSystemChangeListeners)) listener("removeItem");
		},
		changeItemName(newItemName, targetItemName, targetItemPath) {
			let targetDirectoryObject = fileSystem;
			for (const directory of targetItemPath.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}
			const itemValue = targetDirectoryObject[targetItemName];
			const contents = typeof itemValue === "string"
				? [
					this.getFileContents(targetItemPath, targetItemName),
					itemValue,
				]
				: formatFileSystemDirectory(itemValue, `${targetItemPath} ${targetItemName}`);

			this.removeItem(targetItemName, targetItemPath);
			this.addItem(newItemName, contents, targetItemPath);

			// close and reopen folder if directory is not root
			if (targetItemPath != "root") {
				const [parentDirectoryName, parentDirectoryPath] = splitPath(targetItemPath);

				const directoryElement = fileSystemManager.selectItem(parentDirectoryName, parentDirectoryPath);
				fileSystemManager.toggleDirectory(directoryElement);

				if (fileSystemManager.getDirectoryState(directoryElement) === "0") fileSystemManager.toggleDirectory(directoryElement);
			}

			// recompute file option positions
			handleResize();

			this.setActiveItem(this.selectItem(newItemName, targetItemPath));
		},
		moveItem(newItemPath, targetItemName, targetItemPath) {
			let targetDirectoryObject = fileSystem;
			for (const directory of targetItemPath.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}

			const itemValue = targetDirectoryObject[targetItemName];
			const contents = typeof itemValue === "string"
				? [
					this.getFileContents(targetItemPath, targetItemName),
					itemValue,
				]
				: formatFileSystemDirectory(itemValue, `${targetItemPath} ${targetItemName}`);

			this.removeItem(targetItemName, targetItemPath);
			this.addItem(targetItemName, contents, newItemPath);
		},
		setActiveItem(itemElement) {
			if (itemElement === document.getElementById("fileSystemRoot")) {
				// deselect all files and hide file related elements
				this.activeFile = "";
				this.activeFilePath = "";
				this.activeFileEncodingScheme = "";
				this.activeFileEncodingSchemeDisplay = "";

				editor.setModel(defaultModel);
				editor.updateOptions({ readOnly: true });

				for (const fileOptionElement of document.getElementsByClassName("fileInfoElement"))
					fileOptionElement.style.display = "none";
			}

			const targetItemName = itemElement.getAttribute("data-name"),
				targetItemPath = itemElement.getAttribute("data-path");

			// only update if item is not already active
			if (this.activePath !== targetItemPath || this.activeItem !== targetItemName) {
				for (const fileElement of document.getElementsByClassName("file")) {
					fileElement.style.backgroundColor = null;
				}
				itemElement.style.backgroundColor = "#dddddd";

				let targetDirectoryObject = fileSystem;
				for (const directory of targetItemPath.split(" ")) {
					targetDirectoryObject = targetDirectoryObject[directory];
				}

				this.activeItem = targetItemName;
				this.activePath = targetItemPath;

				// if target item is file
				if (!itemElement.getAttribute("data-is-directory")) {
					for (const fileElement of document.getElementsByClassName("file")) {
						fileElement.children[1].style.fontWeight = null;
					}
					itemElement.children[1].style.fontWeight = "600";

					this.activeFile = targetItemName;
					this.activeFilePath = targetItemPath;

					// update file encoding info
					const encodingScheme = this.getFileEncodingScheme(targetItemPath, targetItemName),
						encodingOptionContainer = document.getElementById("fileOptionEncodingContainer");

					const displayEncoding = document.querySelector(
						`.fileEncodingOption[data-value="${encodingScheme}"]`
					).innerText;

					this.activeFileEncodingScheme = encodingScheme;
					this.activeFileEncodingSchemeDisplay = displayEncoding;

					for (const element of document.getElementsByClassName("fileEncodingOption")) {
						element.style.display = element.getAttribute("data-value") === encodingScheme
							? "none"
							: "block";
					}

					const encodingText = encodingOptionContainer.firstElementChild;
					encodingText.nextElementSibling.after(
						document.querySelector(
							`.fileEncodingOption[data-value="${encodingScheme}"`
						)
					);
					encodingText.innerText = "Encoding: " + displayEncoding

					// show all file info elements
					for (const fileInfoElement of document.getElementsByClassName("fileInfoElement"))
						fileInfoElement.style.display = "block";

					// update editor
					const model = monaco.editor.getModel(monaco.Uri.file(`${targetItemPath} ${targetItemName}`));
					editor.setModel(model);
					editor.updateOptions({ readOnly: itemElement.getAttribute("data-is-readonly") });
					setFileEncodingWarnings(model, encodingScheme, displayEncoding);
				}
			}
		},
		toggleDirectory(directoryElement) {
			const show = !parseInt(directoryElement.getAttribute("data-directory-state"));
			const directoryName = directoryElement.getAttribute("data-name"),
				directoryPath = directoryElement.getAttribute("data-path");

			const subItems = show
				? this.getImmidiateWithinDirectory(`${directoryPath} ${directoryName}`)
				: this.getAllWithinDirectory(`${directoryPath} ${directoryName}`);


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
		},
		isItemDirectory(itemName, itemPath) {
			return Boolean(this.selectItem(itemName, itemPath).getAttribute("data-is-directory"));
		},
		getDirectoryState(directoryElement) {
			return directoryElement.getAttribute("data-directory-state");
		},
		getFileContents(path, name) {
			const model = monaco.editor.getModel(monaco.Uri.file(`${path} ${name}`));
			return model
				? filterInvalidCharacters(model.getValue(), this.getFileEncodingScheme(path, name))
				: null;
		},
		setFileContents(path, name, contents) {
			const model = monaco.editor.getModel(monaco.Uri.file(`${path} ${name}`));
			model.setValue(contents);
		},
		getFileEncodingScheme(path, name) {
			let targetDirectoryObject = fileSystem;
			for (const directory of path.split(" ")) {
				targetDirectoryObject = targetDirectoryObject[directory];
			}
			return targetDirectoryObject[name];
		},
		async changeFileEncodingScheme(path, name, encodingScheme) {
			// if encoding scheme is different than current
			const initialEncodingScheme = this.getFileEncodingScheme(path, name);
			if (initialEncodingScheme !== encodingScheme) {
				const fileBinary = stringToArrayBuffer(
					this.getFileContents(path, name),
					initialEncodingScheme,
				);

				// allow user to cancel if file content will change
				if (
					encodingScheme === "utf-8"
					&& !isValidUTF8(fileBinary)
					&& !await confirmCustom("This file is not valid UTF-8. Encoding it as UTF-8 will change its contents.<br><br>Would you like to proceed?")
				) return false;

				this.removeItem(name, path);
				this.addItem(name, [arrayBufferToString(fileBinary, encodingScheme), encodingScheme], path);
				this.setActiveItem(this.selectItem(name, path));
			}

			// user did not cancel
			return true;
		},
		getFileSystem() {
			const getDirectoryContents = path => {
				const directoryContents = {};
				let targetDirectory = fileSystem;

				for (const directory of path.split(" ")) targetDirectory = targetDirectory[directory];

				for (const item in targetDirectory) {
					if (typeof targetDirectory[item] === "string") {
						directoryContents[item] = [
							this.getFileContents(path, item),
							this.getFileEncodingScheme(path, item),
						];
					} else {
						directoryContents[item] = getDirectoryContents(`${path} ${item}`);
					}
				}

				return directoryContents;
			};

			return getDirectoryContents("root");
		},
		getBinaryFilesList() {
			return getFileListFromDirectory(this.getFileSystem());

			function getFileListFromDirectory(directory, path = "") {
				const files = [];
				for (const item in directory) {
					const content = directory[item];

					if (Array.isArray(content)) {
						files.push([
							`${path} ${item}`.trim(),
							stringToArrayBuffer(...content),
							mime.getType(item) || "text/plain",
						]);
					} else {
						files.push(...getFileListFromDirectory(content, `${path} ${item}`.trim()));
					}
				}
				return files;
			}
		},
		setFileReadOnly(filePath, fileName, readOnly) {
			const fileElement = this.selectItem(fileName, filePath);
			if (readOnly) fileElement.setAttribute("data-is-readonly", "1");
			else fileElement.removeAttribute("data-is-readonly");

			if (this.activeFile === fileName && this.activeFilePath === filePath) {
				editor.updateOptions({ readOnly: true });
			}
		},

		// tutorial specific
		setFileCorrectState(filePath, fileName, state) {
			this.selectItem(fileName, filePath).children[1].style.color = state ? "#00aa00" : "#000000";
		},
		//setFileDifferenceEditor(path, reuiredCode
	};
	return manager;


	function getItemLastChild(item) {
		if (item.getAttribute("data-is-directory")) {
			const directoryName = item.getAttribute("data-name"),
				directoryPath = item.getAttribute("data-path");
			const directoryElements = [item, ...manager.getAllWithinDirectory(`${directoryPath} ${directoryName}`)];

			return directoryElements[directoryElements.length - 1];
		} else {
			return item;
		}
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

	async function addNewItem(type) {
		let path = fileSystemManager.activePath;
		const activeItem = fileSystemManager.activeItem,
			isCurrentItemDirectory = fileSystemManager.isItemDirectory(activeItem, path);

		if (isCurrentItemDirectory) path = `${path} ${activeItem}`.trim();

		const name = await promptCustom(`New ${type} name:`);
		if (
			name !== null // prompt was canceled
			&& checkItemValid(name, path, type)
		) {
			fileSystemManager.addItem(
				name,
				{ file: ["", "utf-8"], folder: {} }[type],
				path,
			);

			// close and reopen folder if directory is not root
			if (path != "root") {
				const [directoryName, directoryPath] = splitPath(path);

				const directoryElement = fileSystemManager.selectItem(directoryName, directoryPath);
				fileSystemManager.toggleDirectory(directoryElement);

				if (fileSystemManager.getDirectoryState(directoryElement) === "0") fileSystemManager.toggleDirectory(directoryElement);
			}
		}
	}

	function formatFileSystemDirectory(contents, path) {
		const [itemName, itemPath] = splitPath(path);

		if (typeof contents === "string") {
			return [
				manager.getFileContents(itemPath, itemName),
				manager.getFileEncodingScheme(itemPath, itemName),
			];
		} else {
			for (const item in contents) {
				contents[item] = formatFileSystemDirectory(contents[item], `${path} ${item}`);
			}

			return contents;
		}
	}

	function setFileEncodingWarnings(model, encodingScheme, encodingSchemeDisplay) {
		const markers = monaco.editor.getModelMarkers(monaco).filter(
			marker =>
				marker.owner !== "encodingWarnings"
				&& marker.resource.path === "/" + manager.activeFilePath
		);

		// lines start at 1
		for (let lineIndex = 1, lineCount = model.getLineCount() + 1; lineIndex < lineCount; lineIndex++) {
			const lineValue = [...model.getLineContent(lineIndex)];
			for (let charIndex = 0, lineLength = lineValue.length; charIndex < lineLength; charIndex++) {
				const char = lineValue[charIndex],
					isValid = checkCharacterValid(char, encodingScheme);

				if (!isValid) {
					markers.push({
						message: `"${char}" is not a valid character within the ${encodingSchemeDisplay} encoding scheme. Invalid characters will be ignored.`,
						severity: monaco.MarkerSeverity.Warning,
						startLineNumber: lineIndex,
						startColumn: charIndex + 1,
						endLineNumber: lineIndex,
						endColumn: charIndex + 2,
					});
				}
			}
		}

		monaco.editor.setModelMarkers(model, "encodingWarnings", markers);
	}

	function filterInvalidCharacters(string, encoding) {
		const charArray = [...string].filter(char => checkCharacterValid(char, encoding));
		return charArray.join("");
	}

	function checkItemValid(name, path, type) {
		const siblingNames = [
			...fileSystemManager.getImmidiateWithinDirectory(path)
		].map(element => fileSystemManager.getItemName(element));

		if (!name) return void alertCustom(`${type[0].toUpperCase() + type.substring(1)} names cannot be blank`) || false;
		if (siblingNames.includes(name)) return void alertCustom(`A ${type} in this directory already has the name "${name}"`) || false;
		if (!/^[0-9a-zA-Z._-]+$/.test(name)) return void alertCustom(`${type[0].toUpperCase() + type.substring(1)} names can only contain characters "0-9", "a-z", "A-Z", ".", "_", and "-"`) || false;
		if (name.endsWith(".")) return void alertCustom(`${type[0].toUpperCase() + type.substring(1)} names cannot end with "."`) || false;

		// restricted file names that interfere with code executor
		if (["_L2C_RESERVED_INDEX_.html", "_L2C_RESERVED_WORKER_.js"].includes(name)) return void alertCustom(`"_L2C_RESERVED_INDEX_.html" and "_L2C_RESERVED_WORKER_.js" are reserved file names used by the code executor`) || false;

		return true;
	}

	function splitPath(path) {
		path = path.split(" ");
		return [
			path.pop(),
			path.join(" "),
		];
	}

	function handleResize() {
		let largestWidth = 0, vw = window.innerWidth / 100;
		for (const file of filesContainer.children) {
			file.style.width = "fit-content";

			const fileWidth = file.getBoundingClientRect().width;
			if (fileWidth > largestWidth) largestWidth = fileWidth;
		}
		for (const file of filesContainer.children) {
			file.style.width = largestWidth + vw * 2 + "px";
		}
	}
}