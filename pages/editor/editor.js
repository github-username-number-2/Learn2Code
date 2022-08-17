import createFileSystemManager from "./fileSystemManager.js";
import initializeEditor from "./initializeEditor.js";
import initializeWebCodeExecutor from "./initializeWebCodeExecutor.js";
import initializeStorageManager from "/js/storageManager.js";

window.addEventListener("load", async () => {
	window.storageManager = await initializeStorageManager();
	const fileSystem = {
		"testFolder": {
			"main.js": ["console.log(mmm);", "UTF-8"],
			"testFolder": {
				"file": ["", "UTF-8"],
				"testFolder": {
					"readme.md": ["", "UTF-8"],
					"testFolder": {
						"file.php": ["", "UTF-8"],
						"1.s": ["", "UTF-8"],
						"2.s": ["", "UTF-8"],
						"3.s": ["", "UTF-8"],
					},
				},
			},
		},
		"testFolsder": {
			"main.js": ["console.log(mmm);", "UTF-8"],
			"testFolder": {
				"file": ["", "UTF-8"],
				"testFolder": {
					"readme.md": ["", "UTF-8"],
					"testFolder": {
						"file.php": ["", "UTF-8"],
					},
				},
			},
		},
		"index.html": ["<!DOCTYPE html>\n<html>\n\t<body>\n\t\t<script src=\"main/js\"></script>\n\t</body>\n</html>", "UTF-8"],
	};

	// loads in file system and editor
	window.fileSystemManager = await createFileSystemManager();
	fileSystemManager.loadFileSystem(fileSystem);
	fileSystemManager.changeItemName("otherFile", "file", "root testFolder testFolder");
	fileSystemManager.changeItemName("testFoldersssss", "testFolder", "root testFolder");
	fileSystemManager.removeItem("testFolder", "root testFolsder");
	fileSystemManager.removeItem("main.js", "root testFolsder");
	fileSystemManager.changeItemName("0.s", "3.s", "root testFolder testFoldersssss testFolder testFolder");
	fileSystemManager.addItem("4.s", ["", "Base64"], "root testFolder testFoldersssss testFolder testFolder");
	fileSystemManager.moveItem("root testFolsder", "testFolder", "root testFolder testFoldersssss");

	/*
	alertCustom("dadsa wa ad kah duah diauhd iauhwd iuaulll")
	alertCustom("dadsa wa ad kah duahll")
	alertCustom("dadsalll")
	alert(await alertCustom("dadsa wa ad kah duah diauhd iauhwd iuaulll"))
	alert(await promptCustom("da"))
	alert(await confirmCustom("dadsa wa ad kah duah diahd iauhwd iuaulll"))
	*/
	const webCodeExecutor = await initializeWebCodeExecutor("https://Learn2CodeWebCodeExecutor.repl-account.repl.co", "/index.html");
	//webCodeExecutor.executeFilesList(fileSystemManager.getFilesList());

	await initializeEditor();
});