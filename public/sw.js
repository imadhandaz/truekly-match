// Service Worker — Truekly Match
// Gestiona push notifications y click en notificaciones

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("push", (e) => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || "Truekly Match", {
      body: data.body || "¡Tienes una novedad!",
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: data.tag || "truekly",
      renotify: true,
      data: { url: data.url || "/" },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        const existing = list.find((c) => "focus" in c);
        return existing ? existing.focus() : clients.openWindow(url);
      })
  );
});
