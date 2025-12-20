import { useState } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import axios from 'axios';

// NOTE: Ideally invoke this in a useEffect when token changes, but for now we do it on click or token change
// This URL needs to be replaced by the user after deploying GAS
const REGISTER_API_URL = 'https://script.google.com/macros/s/AKfycbzHA5NyGH0KdrZkFomJpWJK7iLiqCGYkQ-3VwiKT8H3QYTBKmTN3SC_xk_uWckYJZnVtQ/exec';

export const NotificationButton = () => {
    const { requestPermission, notificationPermission, fcmToken } = usePushNotifications();
    const [isRegistering, setIsRegistering] = useState(false);

    const handleClick = async () => {
        if (isRegistering) return;

        setIsRegistering(true);
        try {
            // 1. Get Token (Request Permission if needed)
            let token = fcmToken;
            if (notificationPermission !== 'granted' || !token) {
                token = await requestPermission();
            }

            // 2. Register to Backend
            if (token && REGISTER_API_URL) {
                console.log("Registering token to backend:", token);
                // use no-cors mode logic or simple text/plain post to avoid CORS preflight issues with GAS
                await axios.post(REGISTER_API_URL, JSON.stringify({ token: token }), {
                    headers: { 'Content-Type': 'text/plain' }
                });
                alert("通知設定を完了しました！");
            } else {
                console.warn("Could not get token or backend URL missing");
            }
        } catch (e) {
            console.error("Registration failed", e);
            alert("通知設定に失敗しました。時間をおいて再度お試しください。");
        } finally {
            setIsRegistering(false);
        }
    };

    const isEnabled = notificationPermission === 'granted' && !!fcmToken;

    return (
        <button
            onClick={handleClick}
            disabled={isRegistering}
            className={`p-2 rounded-full transition-colors relative ${isEnabled
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            title={isEnabled ? "Notifications Enabled" : "Enable Notifications"}
        >
            {isRegistering ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                isEnabled ? <Bell size={20} /> : <BellOff size={20} />
            )}
        </button>
    );
};
