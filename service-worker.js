self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    );
});


// Receive push notifications
self.addEventListener('push', event => {

    let data = {
        title: 'Family Survivor',
        body: 'New picks have been revealed.',
        url: './'
    };

    if (event.data) {
        try {
            data = {
                ...data,
                ...event.data.json()
            };
        } catch (error) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: './app-icon-192.png',
        badge: './app-icon-192.png',
        data: {
            url: data.url || './'
        }
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title,
            options
        )
    );
});


// Handle tapping/clicking the notification
self.addEventListener('notificationclick', event => {

    event.notification.close();

    const targetUrl =
        event.notification.data?.url || './';

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(windowClients => {

            // If Survivor is already open, use that window.
            for (const client of windowClients) {
                if ('navigate' in client && 'focus' in client) {
                    return client
                        .navigate(targetUrl)
                        .then(() => client.focus());
                }
            }

            // Otherwise open Survivor.
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
