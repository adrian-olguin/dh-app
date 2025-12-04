// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  console.log('Push notification received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Daily Hope';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/images/daily-hope-logo.png',
    badge: '/images/daily-hope-logo.png',
    data: data.url || '/',
    requireInteraction: false,
    tag: data.tag || 'daily-hope-notification'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
