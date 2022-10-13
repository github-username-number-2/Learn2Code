const cacheName="CacheV3",cachedAssets=["/","/index.html","/pages/index/index.js","/pages/index/index.css","/pages/editor.html","/pages/editor/editor.js","/pages/editor/fileSystemManager.js","/pages/editor/initializeEditor.js","/pages/editor/initializeUI.js","/pages/editor/initializeWebCodeExecutor.js","/pages/editor/settingsManager.js","/pages/editor/tutorialFunctions.js","/js/initializePage.js","/js/storageManager.js","/js/functions.js","/js/libraries/md5.js","/js/libraries/mime.js","/js/libraries/beautifyJS/beautify-html.min.js","/js/libraries/beautifyJS/beautify-css.min.js","/js/libraries/beautifyJS/beautify.min.js","/css/main.css","/favicon.png","/data/iconData.json","/data/tutorials/tutorialIndex.js","/manifest.json"],fileExpiryTimes={"/data/tutorials/tutorialIndex.js":12};self.addEventListener("install",e=>{e.waitUntil(caches.open(cacheName).then(e=>{for(const t of cachedAssets)e.add(t).catch(()=>console.log("Error: Request for asset failed: "+t))})),self.skipWaiting()}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==cacheName).map(e=>caches.delete(e)))))}),self.addEventListener("fetch",async a=>a.respondWith(caches.match(a.request).then(e=>{if(e){var t=new Date(e.headers.get("date")).getTime()+36e5,s=fileExpiryTimes[new URL(e.url).pathname];if(!navigator.onLine||!s||Date.now()>t*s)return e}return fetch(a.request).then(async e=>{return new URL(a.request.url).host===self.location.host&&(await caches.open(cacheName)).put(a.request,e.clone()),e}).catch(e=>new Response(`
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="utf-8">
							<title>Error 404</title>
						</head>
						<body>
							<h1>Error 404: This file does not exist.</h1>
						</body>
						</html>
					`,{headers:new Headers({status:e.status,"content-type":"text/html; charset=utf-8"})}))})));