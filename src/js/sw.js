const cacheName = "CacheV1";

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
			cacheResult || fetch(event.request).then(response => {
				const cache = caches.open(cacheName);
				cache.add(event.request, response);
			})
		)
	)
);