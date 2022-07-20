import createFileSystemManager from "./fileSystemManager.js";
import initializeUI from "./initializeUI.js";


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

	const fileSystemManager = await createFileSystemManager();
	fileSystemManager.loadFileSystem(fileSystem);
	fileSystemManager.changeItemName("otherFile", "file", "root testFolder testFolder");
	fileSystemManager.changeItemName("testFoldersssss", "testFolder", "root testFolder");
	fileSystemManager.removeItem("testFolder", "root testFolsder");
	fileSystemManager.removeItem("main.js", "root testFolsder");
	fileSystemManager.changeItemName("0.s", "3.s", "root testFolder testFoldersssss testFolder testFolder");
	fileSystemManager.addItem("4.s", "", "root testFolder testFoldersssss testFolder testFolder");

	initializeUI("tutorial");
});