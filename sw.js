---
layout: null
---
var CACHE_PREFIX = "allcontent-";
var CACHE_NAME = CACHE_PREFIX + "{{ site.time | date: '%Y%m%d%H%M' }}";
var STATIC_ASSETS = [
  "{{ '/assets/css/pixyll.css' | relative_url }}?{{ site.time | date: '%Y%m%d%H%M' }}",
  "{{ '/' | relative_url }}",
  "{{ '/archive/' | relative_url }}",
  "{{ '/topics/' | relative_url }}",
  "{{ '/search/' | relative_url }}"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.map(function (name) {
          if (name.indexOf(CACHE_PREFIX) === 0 && name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("message", function (event) {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});

function isSameOrigin(request) {
  return new URL(request.url).origin === location.origin;
}

function shouldUseNetworkFirst(request) {
  var requestUrl = new URL(request.url);
  return request.mode === "navigate" ||
    request.destination === "document" ||
    requestUrl.pathname.slice(-12) === "/search.json" ||
    requestUrl.pathname.slice(-9) === "/feed.xml";
}

function cacheResponse(request, response) {
  if (!response || response.status !== 200 || !isSameOrigin(request)) {
    return;
  }

  var clonedResponse = response.clone();
  caches.open(CACHE_NAME).then(function (cache) {
    cache.put(request, clonedResponse);
  });
}

function networkFirst(request) {
  return fetch(request).then(function (networkResponse) {
    cacheResponse(request, networkResponse);
    return networkResponse;
  }).catch(function () {
    return caches.match(request).then(function (cachedResponse) {
      return cachedResponse || Response.error();
    });
  });
}

function cacheFirst(request) {
  return caches.match(request).then(function (cachedResponse) {
    if (cachedResponse) {
      return cachedResponse;
    }

    return fetch(request).then(function (networkResponse) {
      cacheResponse(request, networkResponse);
      return networkResponse;
    }).catch(function () {
      return Response.error();
    });
  });
}

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  if (!isSameOrigin(event.request)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    shouldUseNetworkFirst(event.request) ? networkFirst(event.request) : cacheFirst(event.request)
  );
});
