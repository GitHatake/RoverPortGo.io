import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import axios from 'axios';

// NOTE: Ideally invoke this in a useEffect when token changes, but for now we do it on click or token change
// This URL needs to be replaced by the user after deploying GAS
const REGISTER_API_URL = 'https://script.google.com/macros/s/AKfycbzHA5NyGH0KdrZkFomJpWJK7iLiqCGYkQ-3VwiKT8H3QYTBKmTN3SC_xk_uWckYJZnVtQ/exec';

export const NotificationButton = () => {
    const { requestPermission, notificationPermission, fcmToken } = usePushNotifications();

    const handleClick = async () => {
        if (notificationPermission !== 'granted' || !fcmToken) {
            await requestPermission();
        } else {
            // Already has token, maybe simulate test?
            console.log("Token:", fcmToken);
        }

        // If we have a token and URL is set, register it
        if (fcmToken && REGISTER_API_URL) {
            try {
                // simple fire and forget
                // Note: CORS might be an issue with GAS. 
                // Using 'no-cors' mode fetch or ensuring GAS returns correct headers.
                // React axios call:
                await axios.post(REGISTER_API_URL, JSON.stringify({ token: fcmToken }), {
                    headers: { 'Content-Type': 'text/plain' } // GAS "JSON" parsing hack
                });
                alert("Registered for notifications!");
            } catch (e) {
                console.error("Registration failed", e);
            }
        } else if (fcmToken && !REGISTER_API_URL) {
            console.log("Got token but no backend URL configured yet:", fcmToken);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-full transition-colors ${notificationPermission === 'granted' && fcmToken
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            title={notificationPermission === 'granted' ? "Notifications Enabled" : "Enable Notifications"}
        >
            {notificationPermission === 'granted' && fcmToken ? <Bell size={20} /> : <BellOff size={20} />}
        </button>
    );
};
