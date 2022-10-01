const DATABASE_VERSION = 11;

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
			deleteTutorialData(tutorialID) {
				return createTransaction("TutorialData", "readwrite", store => store.delete(tutorialID));
			},

			async getTutorialProgress(tutorialID) {
				const progressData = await createTransaction("TutorialProgressData", "readonly", store => store.get(tutorialID));
				return progressData || {
					progressPercent: 0,
					state: "incomplete",
					completedOnce: false,
				};
			},
			async setTutorialProgress(tutorialID, { progressPercent, state, completedOnce }) {
				const currentProgress = await storageManager.getTutorialProgress(tutorialID);

				const currentProgressPercent = currentProgress.progressPercent,
					currentState = currentProgress.state,
					currentCompletedOnce = currentProgress.completedOnce;

				const currentData = {
					id: tutorialID,
					progressPercent: progressPercent === undefined
						? currentProgressPercent === undefined
							? 0
							: currentProgressPercent
						: progressPercent,
					state: state === undefined
						? currentState === undefined
							? "incomplete"
							: currentState
						: state,
					completedOnce: completedOnce === undefined
						? currentCompletedOnce === undefined
							? false
							: currentCompletedOnce
						: completedOnce,
				};
				return createTransaction("TutorialProgressData", "readwrite",
					store => store.put(currentData)
				);
			},
			deleteTutorialProgress(tutorialID) {
				return createTransaction("TutorialProgressData", "readwrite", store => store.delete(tutorialID));
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

		const openRequest = indexedDB.open("UserFiles", DATABASE_VERSION);

		let db, open = false;
		openRequest.addEventListener("success", event => {
			open = true;

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
			if (!db.objectStoreNames.contains("TutorialProgressData")) {
				db.createObjectStore("TutorialProgressData", {
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

		setTimeout(() => {
			if (!open) alertCustom("The website needs an update. Close all other instances of this page and reload.");
		}, 2000);

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