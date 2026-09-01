// minimal offline support: cache static assets, network-first for pages
const CACHE = "memory-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static") || url.pathname.endsWith(".css") || url.pathname.endsWith(".js")) {
    // static assets: cache-first
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    // pages: network-first, fall back to cache offline
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
  }
});
