/* TUS Komuta Merkezi — çevrimdışı önbellek.
   Uygulama kabuğu kurulumda önbelleğe alınır; sonra internet olmadan da açılır. */
const AD = 'tus-kabuk-v4';
const DOSYALAR = ['./', './index.html', './manifest.webmanifest',
                  './icon-180.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(AD)
      .then(c => c.addAll(DOSYALAR))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== AD).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(bulunan => {
      if (bulunan) return bulunan;
      return fetch(e.request).then(yanit => {
        const kopya = yanit.clone();
        caches.open(AD).then(c => c.put(e.request, kopya)).catch(() => {});
        return yanit;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
