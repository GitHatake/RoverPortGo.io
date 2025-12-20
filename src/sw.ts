/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope
declare let firebase: any

cleanupOutdatedCaches()

// Precache resources
precacheAndRoute(self.__WB_MANIFEST)

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
