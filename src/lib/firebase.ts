import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCPRh0Aze41dS_j9uePXDUfwNFTHQoB-gs",
    authDomain: "roverportgo.firebaseapp.com",
    projectId: "roverportgo",
    storageBucket: "roverportgo.firebasestorage.app",
    messagingSenderId: "366463377954",
    appId: "1:366463377954:web:5b68c5e3d44f93ee32e07b",
    measurementId: "G-KTGXHZ41TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

export const VAPID_KEY = "BEDZrD84DtgL4NvnxjI_kSLDKxEGXr-bD-ptAE8KaSJkvp9qvPJ_22Cil-5QGYyVJRvl4F6sjTy8z7AZPl7pXdU";

export const requestForToken = async (vapidKey: string) => {
    try {
        // Wait for the main Service Worker (which now includes FCM logic) to be ready
        const registration = await navigator.serviceWorker.ready;
        console.log('Service Worker ready for FCM:', registration);

        const currentToken = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration
        });
        if (currentToken) {
            console.log('current token for client: ', currentToken);
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
            return null;
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
