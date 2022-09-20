export default function initializeStorageManager() {
	return new Promise(resolve => {
		const storageManager = {
			getAllTutorialData() {
				return createTransaction("TutorialData", "readonly", store => store.getAll());
			},
			getTutorialData(tutorialID) {
				return createTransaction("TutorialData", "readonly", store => store.get(tutorialID));
			},
			setTutorialData(tutorialData) {
				return createTransaction("TutorialData", "readwrite", store => store.put(tutorialData));
			},

			getAllProjectKeys() {
				return createTransaction("ProjectData", "readonly", store => store.getAllKeys());
			},
			getProjectData(projectName) {
				return createTransaction("ProjectData", "readonly", store => store.get(projectName));
			},
			setProjectData(projectData) {
				return createTransaction("ProjectData", "readwrite", store => store.put(projectData));
			},
			deleteProjectData(projectName) {
				return createTransaction("ProjectData", "readwrite", store => store.delete(projectName));
			},

			getEditorSettings() {
				return createTransaction("EditorSettings", "readonly", store => store.getAll());
			},
			modifyEditorSetting(settingObject) {
				return createTransaction("EditorSettings", "readwrite", store => store.put(settingObject));
			},
			deleteEditorSetting(settingName) {
				return createTransaction("EditorSettings", "readwrite", store => store.delete(settingName));
			},
		};


		let db;
		const openRequest = indexedDB.open("UserFiles", 8);

		openRequest.addEventListener("success", event => {
			db = event.target.result;
			resolve(storageManager);
		});

		openRequest.addEventListener("error", error => console.log(error));

		openRequest.addEventListener("upgradeneeded", event => {
			db = event.target.result;

			if (!db.objectStoreNames.contains("ProjectData")) {
				db.createObjectStore("ProjectData", {
					keyPath: "name",
				});
			}
			if (!db.objectStoreNames.contains("TutorialData")) {
				db.createObjectStore("TutorialData", {
					keyPath: "id",
				});
			}
			if (!db.objectStoreNames.contains("EditorSettings")) {
				db.createObjectStore("EditorSettings", {
					keyPath: "name",
				});
			}

			resolve(storageManager);
		});

		function createTransaction(storeName, type, requestFunction) {
			return new Promise(resolve => {
				try {
					const transaction = db.transaction(storeName, type);

					transaction.onerror = error => console.log(error);

					const store = transaction.objectStore(storeName),
						request = requestFunction(store);

					request.onsuccess = event => resolve(event.target.result);
				} catch {
					// version change occurring, wait for update and reload page
					setTimeout(() => window.location.reload(), 1000);
				}
			});
		}
	});
}