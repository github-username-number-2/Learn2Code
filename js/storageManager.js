export default function initializeStorageManager() {
	return new Promise(resolve => {
		const storageManager = {
			getTutorialData(tutorialID) {
				return createTransaction("TutorialData", "readonly", store => store.get(tutorialID));
			},
			getAllTutorialData() {
				return createTransaction("TutorialData", "readonly", store => store.getAll());
			},
			setTutorialData(tutorialData) {
				return createTransaction("TutorialData", "readwrite", store => store.put(tutorialData));
			},
			getProjectData(projectName) {
				return createTransaction("ProjectData", "readonly", store => store.get(projectName));
			},
			getAllProjectKeys() {
				return createTransaction("ProjectData", "readonly", store => store.getAllKeys());
			},
			setProjectData(projectData) {
				return createTransaction("ProjectData", "readwrite", store => store.put(projectData));
			},
			deleteProjectData(projectName) {
				return createTransaction("ProjectData", "readwrite", store => store.delete(projectName));
			},
		};


		let db;
		const openRequest = indexedDB.open("UserFiles", 4);

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

			resolve(storageManager);
		});

		function createTransaction(storeName, type, requestFunction) {
			return new Promise(resolve => {
				const transaction = db.transaction(storeName, type);
				transaction.onerror = error => console.log(error);

				const store = transaction.objectStore(storeName),
					request = requestFunction(store);

				request.onsuccess = event => resolve(event.target.result);
			});
		}
	});
}