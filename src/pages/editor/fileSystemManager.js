import mime from "/js/libraries/mime.js";
import { elementFromString, isValidUTF8, stringToArrayBuffer, arrayBufferToString, checkCharacterValid, readFileAsArrayBuffer } from "/js/functions.js";

export default async function createFileSystemManager() {
	const filesContainer = document.getElementById("filesContainerInner");
	const resizeObserver = new ResizeObserver(handleResize);
	resizeObserver.observe(filesContainer);

	// initialize new file, new folder, import and export buttons
	document.getElementById("newFileButton").addEventListener("click", () => addNewItem("file"));
	document.getElementById("newFolderButton").addEventListener("click", () => addNewItem("folder"));
	document.getElementById("importFilesButton").addEventListener("click", importItems);
	document.getElementById("exportFilesButton").addEventListener("click", exportItems);

	// initialize editor
	const codeContainer = document.getElementById("codeContainer");
	const editor = monaco.editor.create(codeContainer, {
		readOnly: true,
		fontSize: userSettings.editorFontSize,
		lineNumbers: userSettings.editorLineNumbers ? "on" : "off",
		wordWrap: userSettings.editorWrapText ? "on" : "off",
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
			() => {
				setFileEncodingWarnings(
					editor.getModel(),
					manager.activeFileEncodingScheme,
					manager.activeFileEncodingSchemeDisplay,
				);

				webCodeExecutor.executeFilesList(
					fileSystemManager.getBinaryFilesList(),
					() => { },
				);
			},
			250,
		);
	});
	editor.onDidChangeCursorPosition(event => {
		const currentModel = monaco.editor.getModel(
			monaco.Uri.file(`${manager.activePath} ${manager.activeFile}`)
		);

		if (currentModel)
			currentModel.cursorPosition = event.position;
	});

	const messageContribution = editor.getContribution("editor.contrib.messageController");
	editor.onDidAttemptReadOnlyEdit(() => {
		if (manager.activeFile === "")
			messageContribution.showMessage("Click on a file to edit it.", editor.getPosition());
		else
			messageContribution.showMessage("This file cannot be edited as it is read-only.", editor.getPosition());
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


	// tutorial specific
	const tutorialDifferenceEditorContainer = elementFromString(`<div id="tutorialDifferenceEditorContainer"></div>`);
	tutorialDifferenceEditorContainer.classList.add("tutorialDifferenceEditorContainerHidden");
	codeContainer.append(tutorialDifferenceEditorContainer);

	const tutorialDifferenceEditor = monaco.editor.createDiffEditor(tutorialDifferenceEditorContainer, {
		enableSplitViewResizing: false,
		renderSideBySide: { sideBySide: true, inline: false }[userSettings.tutorialDifferenceEditorStyle],
		fontSize: userSettings.editorFontSize,
		lineNumbers: userSettings.editorLineNumbers ? "on" : "off",
		wordWrap: userSettings.editorWrapText ? "on" : "off",
	});
	const tutorialDifferenceEditorNavigator =
		monaco.editor.createDiffNavigator(tutorialDifferenceEditor);

	let fileSystem;

	const manager = {
		editor,
		tutorialDifferenceEditor,

		activeFile: "",
		activeFilePath: "",
		activeFileEncodingScheme: "",
		activeFileEncodingSchemeDisplay: "",

		activeItem: "root",
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

			for (const model of monaco.editor.getModels())
				if (model !== defaultModel) model.dispose();

			// add top level items, addItem will add sub items within folders recursively
			for (const item in newFileSystem)
				this.addItem(item, newFileSystem[item], "root");
		},
		selectItem(itemName, itemPath) {
			return filesContainer.querySelector(`div[data-name="${itemName}"][data-path="${itemPath}"]`);
		},
		getImmediateWithinDirectory(directoryPath) {
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

				const newName = await promptCustom("Enter new name:", { defaultValue: itemName });
				if (
					newName !== null // prompt was canceled
					&& checkItemValid(newName, currentPath, isDirectory ? "folder" : "file")
				) manager.changeItemName(newName, itemName, currentPath);
			});

			const context = icon.getContext("2d");

			let targetDirectoryObject = fileSystem;
			for (const directory of currentPath.split(" "))
				targetDirectoryObject = targetDirectoryObject[directory];

			targetDirectoryObject[itemName] = isDirectory ? {} : encodingScheme;

			const itemPlacementIndex = sortDirectoryToArray(targetDirectoryObject).findIndex(name => name[0] === itemName);
			const itemPrevious = [
				targetDirectory,
				...[...this.getImmediateWithinDirectory(currentPath)].map(item => getItemLastChild(item)),
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
				if (
					this.activeItem === itemName && this.activePath === itemPath
					|| this.activeFilePath + " " + this.activeFile === itemPath + " " + itemName
				) this.setActiveItem(document.getElementById("fileSystemRoot"));

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
			for (const directory of targetItemPath.split(" "))
				targetDirectoryObject = targetDirectoryObject[directory];

			delete targetDirectoryObject[targetItemName];

			for (const listener of Object.values(this.fileSystemChangeListeners)) listener("removeItem");
		},
		changeItemName(newItemName, targetItemName, targetItemPath) {
			let targetDirectoryObject = fileSystem;
			for (const directory of targetItemPath.split(" "))
				targetDirectoryObject = targetDirectoryObject[directory];

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

				const directoryElement = manager.selectItem(parentDirectoryName, parentDirectoryPath);
				manager.toggleDirectory(directoryElement);

				if (manager.getDirectoryState(directoryElement) === "0")
					manager.toggleDirectory(directoryElement);
			}

			// recompute file option positions
			handleResize();

			this.setActiveItem(this.selectItem(newItemName, targetItemPath));
		},
		moveItem(newItemPath, targetItemName, targetItemPath) {
			let targetDirectoryObject = fileSystem;
			for (const directory of targetItemPath.split(" "))
				targetDirectoryObject = targetDirectoryObject[directory];

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

				for (const editorTab of document.getElementsByClassName("editorTab"))
					editorTab.style.display = "none";

				for (const fileOptionElement of document.getElementsByClassName("fileInfoElement"))
					fileOptionElement.style.display = "none";
			}

			const targetItemName = itemElement.getAttribute("data-name"),
				targetItemPath = itemElement.getAttribute("data-path");

			// only update if item is not already active
			if (this.activePath !== targetItemPath || this.activeItem !== targetItemName) {

				// tutorial specific
				if (window.tutorial)
					tutorialDifferenceEditorContainer.classList.add("tutorialDifferenceEditorContainerHidden");

				// remove preview frames
				document.getElementById("editorTabFileName").click();


				for (const fileElement of document.getElementsByClassName("file"))
					fileElement.style.backgroundColor = null;

				itemElement.style.backgroundColor = "#dddddd";

				let targetDirectoryObject = fileSystem;
				for (const directory of targetItemPath.split(" "))
					targetDirectoryObject = targetDirectoryObject[directory];

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

					for (const element of document.getElementsByClassName("fileEncodingOption"))
						element.style.display = element.getAttribute("data-value") === encodingScheme
							? "none"
							: "block";

					const encodingText = encodingOptionContainer.firstElementChild;
					encodingText.nextElementSibling.after(
						document.querySelector(
							`.fileEncodingOption[data-value="${encodingScheme}"`
						)
					);
					encodingText.innerText = "Encoding: " + displayEncoding;

					// show all editor tabs
					for (const editorTab of document.getElementsByClassName("editorTab"))
						editorTab.style.display = "block";

					document.getElementById("editorTabFileName").children[0].innerText =
						targetItemPath.replaceAll(" ", "/").substring(4) + "/" + targetItemName;

					// show all file info elements
					for (const fileInfoElement of document.getElementsByClassName("fileInfoElement"))
						fileInfoElement.style.display = "block";

					// update editor
					const model = monaco.editor.getModel(monaco.Uri.file(`${targetItemPath} ${targetItemName}`));
					editor.setModel(model);
					editor.focus();
					if (model.cursorPosition) editor.setPosition(model.cursorPosition);

					editor.updateOptions({ readOnly: itemElement.getAttribute("data-is-readonly") });

					setFileEncodingWarnings(model, encodingScheme, displayEncoding);

					// tutorial specific
					if (window.tutorial) {
						const fullPath = targetItemPath + " " + targetItemName;

						if (fullPath in this.fileDifferenceEditors) {
							tutorialDifferenceEditor.setModel({
								original: this.fileDifferenceEditors[fullPath][0],
								modified: model,
							});
							tutorialDifferenceEditor.focus();
							tutorialDifferenceEditorNavigator.next();

							const tutorialDifferenceEditorContainer = document.getElementById("tutorialDifferenceEditorContainer");
							tutorialDifferenceEditorContainer.classList.remove("tutorialDifferenceEditorContainerHidden");
						}

						setDifferenceEditorEncodingWarnings(model, encodingScheme, displayEncoding);
					}
				}
			}
		},
		toggleDirectory(directoryElement) {
			const show = !parseInt(directoryElement.getAttribute("data-directory-state"));
			const directoryName = directoryElement.getAttribute("data-name"),
				directoryPath = directoryElement.getAttribute("data-path");

			const subItems = show
				? this.getImmediateWithinDirectory(`${directoryPath} ${directoryName}`)
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
		fileDifferenceEditors: {},

		setFileCorrectState(filePath, fileName, state) {
			this.selectItem(fileName, filePath).children[1].style.color = state ? "#00aa00" : "#000000";
		},
		showFileHint(path, name, requiredFile) {
			requiredFile = [
				monaco.editor.createModel(requiredFile[0], undefined, monaco.Uri.file(Math.random() + name)),
				requiredFile[1],
			];

			this.fileDifferenceEditors[path + " " + name] = requiredFile;

			// if files/directories do not exist, create them
			path.split(" ").reduce((directoryPath, directoryName) => {
				const targetDirectory = manager.selectItem(directoryName, directoryPath);
				if (
					!(
						targetDirectory && manager.isItemDirectory(directoryName, directoryPath)
					)
				) {
					manager.addItem(directoryName, {}, directoryPath);
				}
				return directoryPath + " " + directoryName;
			});

			if (this.selectItem(name, path)) {
				if (this.isItemDirectory(name, path)) {
					this.removeItem(name, path);
					this.addItem(name, ["", requiredFile[1]]);
				}
			} else {
				this.addItem(name, ["", requiredFile[1]], path);
			}

			const openDirectories = filesContainer.querySelectorAll(`.file[data-is-directory="1"][data-directory-state="1"]`);
			for (const directory of openDirectories) this.toggleDirectory(directory);

			const allDirectories = filesContainer.querySelectorAll(`.file[data-is-directory="1"]`);
			for (const directory of allDirectories) this.toggleDirectory(directory);

			const originalActiveItem = this.activeItem,
				originalActivePath = this.activePath;
			this.setActiveItem(document.getElementById("fileSystemRoot"));
			this.setActiveItem(this.selectItem(originalActiveItem, originalActivePath));
		},
		clearFileHints() {
			tutorialDifferenceEditorContainer.classList.add("tutorialDifferenceEditorContainerHidden");

			for (const file of Object.values(this.fileDifferenceEditors))
				file[0].dispose();

			this.fileDifferenceEditors = {};
		},
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
		let path = manager.activePath;
		const activeItem = manager.activeItem,
			isCurrentItemDirectory = manager.isItemDirectory(activeItem, path);

		if (isCurrentItemDirectory) path = `${path} ${activeItem}`.trim();

		const name = await promptCustom(`New ${type} name:`);
		if (
			name !== null // prompt was canceled
			&& checkItemValid(name, path, type)
		) {
			manager.addItem(
				name,
				{ file: ["", "utf-8"], folder: {} }[type],
				path,
			);

			// close and reopen folder if directory is not root
			if (path !== "root") {
				const [directoryName, directoryPath] = splitPath(path);

				const directoryElement = manager.selectItem(directoryName, directoryPath);
				manager.toggleDirectory(directoryElement);

				if (manager.getDirectoryState(directoryElement) === "0") manager.toggleDirectory(directoryElement);
			}
		}
	}

	async function importItems() {
		const uploadFiles = await confirmCustom("Upload files or upload a folder?", { confirmText: "Files", cancelText: "Folder" }),
			fileInput = elementFromString(`<input type="file" ${uploadFiles ? "multiple" : "webkitdirectory"}>`);

		fileInput.addEventListener("change", async () => {
			const addedFilesList = [],
				addedDirectoriesList = new Set();

			let { activePath } = manager;
			const { activeItem } = manager,
				isCurrentItemDirectory = manager.isItemDirectory(activeItem, activePath);

			if (isCurrentItemDirectory) activePath = `${activePath} ${activeItem}`.trim();

			for (const file of fileInput.files) {
				let filePath = activePath;
				const pathArray = (uploadFiles ? file.name : file.webkitRelativePath).split("/"),
					fileName = pathArray.pop().replaceAll(" ", "");

				for (const item of pathArray) {
					filePath += " " + item.replaceAll(/[^a-zA-Z0-9._-]/g, "");

					addedDirectoriesList.add(filePath);
				}

				addedFilesList.push([filePath + " " + fileName, await readFileAsArrayBuffer(file)]);
			}

			for (const directoryFullPath of addedDirectoriesList) {
				const [name, path] = splitPath(directoryFullPath);

				const folderExists = manager.selectItem(name, path);
				if (
					folderExists
					&& !await confirmCustom(`Folder "${path.replaceAll(" ", "/").substring(4)}/${name}" already exists. Would you like to overwrite it?<br><br>If overwritten, all contents will be deleted.`, { confirmText: "Overwrite contents", cancelText: "Keep contents" })
				) continue;
				else if (folderExists)
					manager.removeItem(name, path);

				manager.addItem(name, {}, path);
			}

			for (const file of addedFilesList) {
				const [relativeFullPath, contents] = file,
					[name, relativePath] = splitPath(relativeFullPath);

				const encoding = isValidUTF8(contents) ? "utf-8" : "base64";

				manager.addItem(
					name,
					[arrayBufferToString(contents, encoding), encoding],
					relativePath,
				);
			}

			// close and reopen folder if directory is not root
			if (activePath !== "root") {
				const [directoryName, directoryPath] = splitPath(activePath);

				const directoryElement = manager.selectItem(directoryName, directoryPath);
				manager.toggleDirectory(directoryElement);

				if (manager.getDirectoryState(directoryElement) === "0") manager.toggleDirectory(directoryElement);
			}
		});

		document.body.append(fileInput);
		fileInput.click();
	}

	function exportItems() {
		alertCustom("This feature is currently a work in progress");
	}

	function formatFileSystemDirectory(contents, path) {
		const [itemName, itemPath] = splitPath(path);

		if (typeof contents === "string") {
			return [
				manager.getFileContents(itemPath, itemName),
				manager.getFileEncodingScheme(itemPath, itemName),
			];
		} else {
			for (const item in contents)
				contents[item] = formatFileSystemDirectory(contents[item], `${path} ${item}`);

			return contents;
		}
	}

	function setFileEncodingWarnings(model, encodingScheme, encodingSchemeDisplay) {
		const markers = monaco.editor.getModelMarkers().filter(
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

	// tutorial specific
	function setDifferenceEditorEncodingWarnings(model, encodingScheme, displayEncoding) {
		const modelFilePath = model._associatedResource.path.substring(1);

		// if model has difference editor
		if (modelFilePath in manager.fileDifferenceEditors) {
			const markers = monaco.editor.getModelMarkers().filter(
				marker =>
					marker.owner !== "tutorialEncodingWarnings"
					&& marker.resource.path === "/" + manager.activeFilePath
			);

			const requiredFileEncoding = manager.fileDifferenceEditors[modelFilePath][1],
				requiredFileEncodingDisplay = document.querySelector(`.fileEncodingOption[data-value="${requiredFileEncoding}"]`).innerText;

			if (requiredFileEncoding !== encodingScheme) {
				const lineCount = model.getLineCount();
				markers.push({
					message: `File encoding should be set to ${requiredFileEncodingDisplay}, current encoding is ${displayEncoding}`,
					severity: monaco.MarkerSeverity.Error,
					startLineNumber: 0,
					startColumn: 0,
					endLineNumber: lineCount,
					endColumn: model.getLineContent(lineCount).length + 1,
				});
			}

			monaco.editor.setModelMarkers(model, "tutorialEncodingWarnings", markers);
		}
	}

	function filterInvalidCharacters(string, encoding) {
		const charArray = [...string].filter(char => checkCharacterValid(char, encoding));
		return charArray.join("");
	}

	function checkItemValid(name, path, type) {
		const siblingNames = [
			...manager.getImmediateWithinDirectory(path)
		].map(element => manager.getItemName(element));

		if (!name) return void alertCustom(`${type[0].toUpperCase() + type.substring(1)} names cannot be blank`) || false;
		if (siblingNames.includes(name)) return void alertCustom(`A ${type} in this directory already has the name "${name}"`) || false;
		if (!/^[0-9a-zA-Z._-]+$/.test(name)) return void alertCustom(`${type[0].toUpperCase() + type.substring(1)} names can only contain characters "0-9", "a-z", "A-Z", ".", "_", and "-"`) || false;
		if (name.endsWith(".")) return void alertCustom(`${type[0].toUpperCase() + type.substring(1)} names cannot end with "."`) || false;

		// item names cannot interfere with native object properties
		const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf({}));
		for (const propertyName of propertyNames) {
			if (name === propertyName) return void alertCustom(`${type[0].toUpperCase() + type.substring(1)} names cannot be "${propertyName}". Nice try.`) || false;
		}

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
		const vw = window.innerWidth / 100;

		let largestWidth = 0;
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