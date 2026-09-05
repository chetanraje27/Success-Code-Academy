/* SCA's small, same-origin push worker. Keep payloads deliberately generic. */
self.addEventListener("push", function (event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = {}; }
  var title = typeof data.title === "string" ? data.title.slice(0, 80) : "SCA admin update";
  var body = typeof data.body === "string" ? data.body.slice(0, 180) : "You have a new admin notification.";
  var url = typeof data.url === "string" ? data.url : "/admin";
  var payload = { id: typeof data.id === "string" ? data.id : String(Date.now()), title: title, body: body, url: url, createdAt: Date.now() };
  event.waitUntil(self.registration.showNotification(title, {
    body: body,
    icon: "/images/ui/SCA-Logo.png",
    badge: "/images/ui/SCA-Logo.png",
    tag: payload.id,
    data: { url: url }
  }).then(function () { return self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windows) {
    windows.forEach(function (client) { client.postMessage(payload); });
  }); }));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var target = event.notification.data && event.notification.data.url;
  var url = new URL(typeof target === "string" ? target : "/admin", self.location.origin);
  if (url.protocol !== "http:" && url.protocol !== "https:") url = new URL("/admin", self.location.origin);
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windows) {
    for (var i = 0; i < windows.length; i += 1) {
      if ("focus" in windows[i]) { windows[i].navigate(url.href); return windows[i].focus(); }
    }
    return clients.openWindow(url.href);
  }));
});
