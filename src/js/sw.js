const cacheName = "CacheV1";

const cachedAssets = [
	"/",
	"/index.html",
	"/pages/index/index.js",
	"/pages/index/index.css",
	"/pages/editor.html",
	"/pages/editor/editor.js",
	"/pages/editor/editor.css",
	"/js/main.js",
	"/css/main.css",
	"/favicon.png",
	"/data/tutorials/tutorialIndex.js",
];

self.addEventListener("install", event =>
	event.waitUntil(
		caches.open(cacheName).then(cache => {
			for (const asset of cachedAssets) {
				try {
					cache.add(asset);
				} catch {
					console.log("Error: Request for asset failed: " + asset);
				}
			}
		})
	)
);

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys.filter(key => key !== cacheName).map(key => caches.delete(key))
			)
		)
	);
});

self.addEventListener("fetch", async event => {
	console.log(event);

	event.respondWith(
		/*caches.match(event.request).then(cacheResult =>
			cacheResult || fetch(event.request).then(response => {
				if (response.status === 200) {
					const cache = caches.open(cacheName);
					cache.put(event.request, response);

					return response;
				}

				return */new Response(
					`
						<!DOCTYPE html>
            			<html lang="en">
            			<head>
              				<meta charset="utf-8">
              				<title>Error ${/*response.status*/200}</title>
            			</head>
            			<body>
              				<pre>Error ${/*response.status*/200}</pre>
            			</body>
            			</html>
					`,
					{
						headers: new Headers({ "content-type": "text/html; charset=utf-8" })
					},
				)/*;
			})
		)*/
	);
});