---
layout: null
---
var CACHE_NAME = "allcontent-v3";
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
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function (networkResponse) {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        var requestUrl = new URL(event.request.url);
        if (requestUrl.origin === location.origin) {
          var clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clonedResponse);
          });
        }

        return networkResponse;
      });
    })
  );
});
