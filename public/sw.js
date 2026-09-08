// Truekly Match Service Worker
const CACHE = 'truekly-v1';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener('push', e => {
  if (!e.data) return;
  let data = {};
  try { data = e.data.json(); } catch { data = { title: 'Truekly Match', body: e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(data.title || 'Truekly Match', {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(cs => {
      const url = e.notification.data?.url || '/';
      const c = cs.find(x => x.url === url);
      if (c) return c.focus();
      return clients.openWindow(url);
    })
  );
});
