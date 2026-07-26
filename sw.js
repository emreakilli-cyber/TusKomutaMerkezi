/* Rota — çevrimdışı önbellek. Kabuk kurulumda saklanır, internetsiz açılır. */
const AD='rota-tus-v1';
const DOSYALAR=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(AD).then(c=>c.addAll(DOSYALAR)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==AD).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(v=>v||fetch(e.request).then(r=>{
    const c=r.clone(); caches.open(AD).then(x=>x.put(e.request,c)).catch(()=>{}); return r;
  }).catch(()=>caches.match('./index.html'))));
});
