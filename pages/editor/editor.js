import createFileSystemManager from "./fileSystemManager.js";
import initializeEditor from "./initializeEditor.js";
//import storageManager from "./storageManager.js";
import initializeWebCodeExecutor from "./initializeWebCodeExecutor.js";


window.addEventListener("load", async () => {
	const fileSystem = {
		"testFolder": {
			"main.js": "console.log(mmm);",
			"testFolder": { "file": "", "testFolder": { "readme.md": "", "testFolder": { "file.php": "", "1.s": "", "2.s": "", "3.s": "" }, }, },
		},
		"testFolsder": {
			"main.js": "console.log(mmm);",
			"testFolder": { "file": "", "testFolder": { "readme.md": "", "testFolder": { "file.php": "" }, }, },
		},
		"index.html": "<!DOCTYPE html>\n<html>\n\t<body>\n\t\t<script src=\"main/js\"></script>\n\t</body>\n</html>",
	};

	// loads in file system and editor
	window.fileSystemManager = await createFileSystemManager();
	/*fileSystemManager.loadFileSystem(fileSystem);
	fileSystemManager.changeItemName("otherFile", "file", "root testFolder testFolder");
	fileSystemManager.changeItemName("testFoldersssss", "testFolder", "root testFolder");
	fileSystemManager.removeItem("testFolder", "root testFolsder");
	fileSystemManager.removeItem("main.js", "root testFolsder");
	fileSystemManager.changeItemName("0.s", "3.s", "root testFolder testFoldersssss testFolder testFolder");
	fileSystemManager.addItem("4.s", "", "root testFolder testFoldersssss testFolder testFolder");
	fileSystemManager.moveItem("root testFolsder", "testFolder", "root testFolder testFoldersssss");*/

	/*
	alertCustom("dadsa wa ad kah duah diauhd iauhwd iuaulll")
	alertCustom("dadsa wa ad kah duahll")
	alertCustom("dadsalll")
	alert(await alertCustom("dadsa wa ad kah duah diauhd iauhwd iuaulll"))
	alert(await promptCustom("da"))
	alert(await confirmCustom("dadsa wa ad kah duah diahd iauhwd iuaulll"))
	*/
	const webCodeExecutor = await initializeWebCodeExecutor("http://127.0.0.1:5500", "/index.html");
	//webCodeExecutor.executeFileSystem(fileSystemManager.getFilesList());

	await initializeEditor();
});