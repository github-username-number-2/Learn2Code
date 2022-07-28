export default async function initializeStorageManager() {
	let db, objectStore;
	const openRequest = indexedDB.open("UserFiles", 4);

	openRequest.addEventListener("success", event => db = event.target.result);

	openRequest.addEventListener("error", error => console.log(error));

	openRequest.addEventListener("upgradeneeded", event => {
		db = event.target.result;

		if (!db.objectStoreNames.contains("userFiles")) {
			db.createObjectStore("userFiles", {
				keyPath: "type",
			});
		}
		if (!db.objectStoreNames.contains("tutorialFiles")) {
			db.createObjectStore("tutorialFiles", {
				keyPath: "type",
			});
		}
		if (!db.objectStoreNames.contains("userData")) {
			db.createObjectStore("userData", {
				keyPath: "type",
			});
		}
	});

	return {
		getUserProject() {
		},
		getUserProject() {
		},
		addUserFile(file) {
			return new Promise(resolve => {
				const transaction = db.transaction("userFiles", "readwrite");
				transaction.oncomplete = event => console.log(event);
				transaction.onerror = error => console.log(error);

				const store = transaction.objectStore("userFiles"),
					request = store.add(file);

				request.onsuccess = () => resolve();
				transaction.onerror = error => console.log(error);
			});
		},
	};
}