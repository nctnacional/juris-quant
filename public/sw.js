self.addEventListener('fetch', (event) => {
  // Apenas permite que o app funcione offline ou cacheie requisições básicas se desejar
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});