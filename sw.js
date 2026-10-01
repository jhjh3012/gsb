const CACHE = 'bank-demo-shell-2026-10-01-v1';
const FILES = ["./", "./index.html", "./manifest.webmanifest?v=3", "./assets/app-icon.png?v=3", "./assets/brand-mark.png", "./assets/card-hd.png", "./assets/fonts/Hellix-Regular.woff2", "./assets/fonts/Hellix-SemiBold.woff2"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('bank-demo-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const isShell = FILES.some(file => new URL(file, self.location).href === url.href);
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put('./index.html', copy))); }
      return response;
    }).catch(() => caches.match('./index.html')));
  } else if (isShell) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});
