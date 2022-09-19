import initializeSettingsManager from "./settingsManager.js";
import createFileSystemManager from "./fileSystemManager.js";
import initializeEditor from "./initializeEditor.js";
import initializeWebCodeExecutor from "./initializeWebCodeExecutor.js";
import initializeStorageManager from "/js/storageManager.js";

window.addEventListener("hashchange", () => window.location.reload());
window.addEventListener("load", async () => {
	window.storageManager = await initializeStorageManager();
	window.settingsManager = await initializeSettingsManager();

	// loads in file system and editor
	window.fileSystemManager = await createFileSystemManager();

	window.executorRootURL = "https://learn2code-webcodeexecutor.web.app";
	window.webCodeExecutor = await initializeWebCodeExecutor("/index.html");

	await initializeEditor();
});