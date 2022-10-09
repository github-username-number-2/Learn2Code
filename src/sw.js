const cacheName = "CacheV1";

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
		caches.match(event.request).then(cacheResult =>
			cacheResult || fetch(event.request).then(response => {
				const cache = caches.open(cacheName);
				cache.put(event.request, response);

				return response;
			}).catch(response =>
				new Response(
					`
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="utf-8">
							<title>Error ${response.status}</title>
						</head>
						<body>
							<h1>Error ${response.status}</h1>
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
			)
		)
	)
);