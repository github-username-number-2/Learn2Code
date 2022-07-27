import mime from "https://cdn.skypack.dev/pin/mime@v3.0.0-Mgy8KWi04WDrrthUM8WI/mode=imports,min/unoptimized/lite.js";


let requiredFileSystem = {}, fileCorrectStates = {}, timeout, resolveFunction;
fileSystemManager.editor.onDidChangeModelContent(() => {
	const activeFile = fileSystemManager.activeFile,
		activePath = fileSystemManager.activePath;

	clearTimeout(timeout);
	timeout = setTimeout(() => {
		fileCorrectStates[`${activePath} ${activeFile}`] = checkFileCodeCorrect(activePath, activeFile);

		if (!Object.values(fileCorrectStates).includes(false)) resolveFunction();
	}, 600);
});

function resolveOnEvent(event, element) {
	return new Promise(resolve => {
		element.addEventListener(event, function handler() {
			element.removeEventListener(event, handler);

			resolve();
		});
	});
}

function appendRequiredFileCode(filePath, requiredCode) {
	requiredFileSystem["root " + filePath] += requiredCode;

	const path = ["root", ...filePath.split(" ")],
		name = path.pop();
	checkFileCodeCorrect(path.join(" "), name);
}

function setRequiredFileSystem(fileSystem) {
	requiredFileSystem = {};
	fileCorrectStates = {};

	addDirectoryFiles(fileSystem, "root");

	function addDirectoryFiles(directory, path) {
		for (const item in directory) {
			const itemValue = directory[item];
			if (typeof itemValue === "string") {
				const code = formatCode(itemValue, mime.getType(item))

				requiredFileSystem[`${path} ${item}`] = code;
				fileCorrectStates[`${path} ${item}`] = checkFileCodeCorrect(path, item);
			} else if (typeof itemValue === "object") {
				addDirectoryFiles(itemValue, `${path} ${item}`);
			}
		}
	}
}

function checkFileCodeCorrect(path, name) {
	const code = formatCode(fileSystemManager.getFileContents(path, name), mime.getType(name));
	const correct = code === requiredFileSystem[`${path} ${name}`];

	fileSystemManager.setFileCorrectState(path, name, correct);

	return correct;
}

function resolveOnCodeCorrect() {
	return new Promise(resolve => {
		resolveFunction = () => resolve();
	});
}

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

export { resolveOnEvent, resolveOnCodeCorrect, setRequiredFileSystem, appendRequiredFileCode };