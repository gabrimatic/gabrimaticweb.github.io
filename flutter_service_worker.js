'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "2243c45f4885146660b98b3ad5e8a576",
"splash/s.js": "f1aac2210f1a88e6baacc992c9d3a597",
"splash/s.css": "cad96bebdcb3bea833d9685684b9e5f7",
"favicon.ico": "e1cf4f1dd4b7444815267224381eab93",
"index.html": "c4411cf4a4341d90b015f42a56f30cdd",
"/": "c4411cf4a4341d90b015f42a56f30cdd",
"main.dart.js": "a6dcba6be52e91946c387219909176cf",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-16.png": "44303fa03c38cba452deca7b9d629d99",
"icons/Icon-192.png": "12353e6d3b0ee1d8f21c400f4ec3b0cb",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-32.png": "0a64ab4f70f8393fc3444bcb7be3c80b",
"icons/Icon-512.png": "ffcaf756f6c212638bd0d137cdc7b333",
"manifest.json": "2c1b753509a583137923cf529635b9f7",
"assets/AssetManifest.json": "826558ad88f358c63b5b945bcfce4107",
"assets/NOTICES": "012a9eb931dc3b6d0170ca4f6761fb94",
"assets/FontManifest.json": "e4414f3cbdfa7bccfc6a3c796b2a1921",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "26f5af2d93473531f82ef5060f9c6d45",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "1f7cb220b3f5309130bd6d9ad87e0fc0",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "4e20cb87b0d43808c49449ffd69b1a74",
"assets/shaders/ink_sparkle.frag": "d772b1ca2d13c7c1add98a18228bf94f",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/flashcard.png": "9677e1c93a7062b322e7c12b8409344c",
"assets/assets/images/me.jpg": "0cdf73f36edb80a180e74752e33d645e",
"assets/assets/images/sinamobile.png": "d977a4b0b4c6847c62392fd58cbf1b95",
"assets/assets/images/doris.png": "ff97ff2fabd19b4c4f3aae82b0cf62a0",
"assets/assets/images/carepoint.png": "8d50009f09261fd66cd14e9629545ffc",
"assets/assets/images/alobodo.png": "82eaa9dbfc42289f452f0b1071f63ba6",
"assets/assets/images/aghigh.png": "f60976077df7a454eeeb171fbc665cf3",
"assets/assets/images/citawork.png": "b63e962504f1042f22cea0c6c1aa2f4b",
"assets/assets/images/elimedi.png": "f065aabc27c0f39a495f0d4a72aef529",
"assets/assets/images/kifduzak.png": "2927bbbf998fc41c6175f559433a0257",
"assets/assets/images/shabaviz.png": "01a176d93a03a156136cd71fc359583c",
"assets/assets/images/logo.png": "8ebd2c4535ecca827b63343321476b58",
"assets/assets/images/hashverse.png": "1c27d282e2d725b13d2380d91a89d6a8",
"assets/assets/images/wand.png": "e1f3206e2c3b3d6d71f9b2283966c836",
"assets/assets/images/passesbox.png": "74f1bfed5be4ad83097134ea77378b99",
"assets/assets/images/back.png": "8ba198fc94a9d91143b38e77bc87cb34",
"assets/assets/resume/resume.pdf": "a3baee596c21c335ae5a9bd2ba2696fe",
"assets/assets/fonts/raleway.ttf": "2ec8557460d3a2cd7340b16ac84fce32",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
