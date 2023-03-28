const cacheName = "_L2C_RESERVED_CACHE_MAIN_V2_";

const cachedAssets = [
	"_L2C_RESERVED_INDEX_.html",
];

self.addEventListener("install", event =>
	event.waitUntil(
		caches.open(cacheName).then(cache => cache.addAll(cachedAssets))
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

self.addEventListener("fetch", async event =>
	event.respondWith(
		caches.match(event.request).then(cacheResult =>
			cacheResult || fetch(event.request).catch(() =>
				new Response(
					`
            			<!DOCTYPE html>
            			<html lang="en">
            			<head>
              				<meta charset="utf-8">
              				<title>Error 404</title>
            			</head>
            			<body>
              				<pre>Error 404: File does not exist</pre>
            			</body>
            			</html>
          			`,
					{
						status: 404,
						headers: new Headers({
							"content-type": "text/html; charset=utf-8",
						}),
					},
				)
			)
		)
	)
);