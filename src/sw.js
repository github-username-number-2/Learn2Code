const cacheName = "CacheV3";

const cachedAssets = [
	"/",
	"/index.html",
	"/pages/index/index.js",
	"/pages/index/index.css",
	"/pages/editor.html",
	"/pages/editor/editor.js",
	"/pages/editor/fileSystemManager.js",
	"/pages/editor/initializeEditor.js",
	"/pages/editor/initializeUI.js",
	"/pages/editor/initializeWebCodeExecutor.js",
	"/pages/editor/settingsManager.js",
	"/pages/editor/tutorialFunctions.js",
	"/js/initializePage.js",
	"/js/storageManager.js",
	"/js/functions.js",
	"/js/libraries/md5.js",
	"/js/libraries/mime.js",
	"/js/libraries/beautifyJS/beautify-html.min.js",
	"/js/libraries/beautifyJS/beautify-css.min.js",
	"/js/libraries/beautifyJS/beautify.min.js",
	"/css/main.css",
	"/favicon.png",
	"/data/iconData.json",
	"/data/tutorials/tutorialIndex.js",
	"/manifest.json",
];

// in hours
const fileExpiryTimes = {
	"/data/tutorials/tutorialIndex.js": 12,
};

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(cacheName).then(cache => {
			for (const asset of cachedAssets) {
				cache.add(asset).catch(
					() => console.log("Error: Request for asset failed: " + asset)
				);
			}
		})
	);

	self.skipWaiting();
});

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys.filter(key => key !== cacheName).map(key => caches.delete(key))
			)
		)
	);
});

self.addEventListener("fetch", async event =>
	event.respondWith(
		caches.match(event.request).then(cacheResult => {
			if (cacheResult) {
				const resourceAge = new Date(cacheResult.headers.get("date")).getTime() + 1000 * 60 * 60,
					resourceExpiryTime = fileExpiryTimes[new URL(cacheResult.url).pathname];

				// if offline return from cache, else update if resource has expired
				if (!navigator.onLine || !resourceExpiryTime || Date.now() > resourceAge * resourceExpiryTime)
					return cacheResult;
			}

			return fetch(event.request).then(async response => {
				if (new URL(event.request.url).host === self.location.host) {
					const cache = await caches.open(cacheName);
					cache.put(event.request, response.clone());
				}

				return response;
			}).catch(response =>
				new Response(
					`
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="utf-8">
							<title>Error code: ${response.status}</title>
						</head>
						<body>
							<h1>Error code: ${response.status}</h1>
						</body>
						</html>
					`,
					{
						headers: new Headers({
							"status": response.status,
							"content-type": "text/html; charset=utf-8",
						})
					},
				)
			);
		})
	)
);