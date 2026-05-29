// Utilidades cliente para push notifications

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  return Notification.requestPermission();
}

export async function subscribeToPush(registration) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) return null;

  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });
}

export async function setupPushNotifications(userId) {
  try {
    const permission = await requestNotificationPermission();
    if (permission !== "granted") return;

    const reg = await registerServiceWorker();
    if (!reg) return;

    const sub = await subscribeToPush(reg);
    if (!sub) return;

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subscription: sub.toJSON() }),
    });
  } catch (err) {
    console.error("Push setup:", err);
  }
}

export async function notifyUser(userId, title, body, url = "/") {
  if (!userId) return;
  fetch("/api/push/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, body, url }),
  }).catch(() => {});
}
