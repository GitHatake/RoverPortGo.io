/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim, setCacheNameDetails } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope
declare let firebase: any

self.skipWaiting()
clientsClaim()
declare let firebase: any

cleanupOutdatedCaches()

// Precache resources
precacheAndRoute(self.__WB_MANIFEST)

// Runtime Caching for Images
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

// Cache Images (CacheFirst)
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
);

// Cache API (StaleWhileRevalidate) - Fallback for context mechanism
registerRoute(
    ({ url }) => url.origin === 'https://roverport.rcjweb.jp' && url.pathname.includes('/wp-json/'),
    new StaleWhileRevalidate({
        cacheName: 'api-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // 24 Hours
            }),
        ],
    })
);

// ==========================================
// Firebase Messaging Handling
// ==========================================
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCPRh0Aze41dS_j9uePXDUfwNFTHQoB-gs",
    authDomain: "roverportgo.firebaseapp.com",
    projectId: "roverportgo",
    storageBucket: "roverportgo.firebasestorage.app",
    messagingSenderId: "366463377954",
    appId: "1:366463377954:web:5b68c5e3d44f93ee32e07b",
    measurementId: "G-KTGXHZ41TB"
};

try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload: any) => {
        console.log('[sw] Received background message ', payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/pwa-192x192.png'
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
    });
} catch (e) {
    console.warn('Firebase init failed in SW (likely offline or config error)', e);
}
