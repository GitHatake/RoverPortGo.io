import { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../lib/firebase';
import { VAPID_KEY } from '../lib/firebase';

export const usePushNotifications = () => {
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);
    const [fcmToken, setFcmToken] = useState<string | null>(localStorage.getItem('fcm_token'));

    useEffect(() => {
        // Double check permission on mount (state init covers most cases, but good for safety)
        const currentPermission = Notification.permission;
        setNotificationPermission(currentPermission);

        const storedToken = localStorage.getItem('fcm_token');
        if (storedToken) {
            console.log("Loaded token from storage:", storedToken);
            setFcmToken(storedToken);
        }

        // Background verification
        if (currentPermission === 'granted') {
            console.log('Permission granted, verifying token...');
            requestForToken(VAPID_KEY).then(token => {
                if (token) {
                    console.log('Token verified:', token);
                    setFcmToken(token);
                    localStorage.setItem('fcm_token', token);
                } else {
                    console.warn('No token retrieved from FCM despite permission.');
                    // Don't clear immediately unless we are sure, to avoid flickering. 
                    // But if permissions are revoked, we should clear?
                    // Actually if permission is granted but getToken returns null, it might be a temporary network issue.
                    // Keep the stored token for UI stability.
                }
            }).catch(err => {
                console.error('Token verification failed:', err);
            });
        }
    }, []);

    const requestPermission = async (): Promise<string | null> => {
        try {
            let token: string | null = null;
            if (Notification.permission === 'granted') {
                console.log('Permission already granted, requesting token...');
                token = await requestForToken(VAPID_KEY);
            } else {
                console.log('Requesting permission...');
                const permission = await Notification.requestPermission();
                console.log('Permission result:', permission);
                setNotificationPermission(permission);
                if (permission === 'granted') {
                    console.log('Permission granted, requesting token...');
                    token = await requestForToken(VAPID_KEY);
                }
            }

            if (token) {
                console.log('Token received:', token);
                setFcmToken(token);
                localStorage.setItem('fcm_token', token);
                return token;
            }
            return null;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return null;
        }
    };

    useEffect(() => {
        // Listen for foreground messages
        onMessageListener().then((payload: any) => {
            console.log('Foreground message received:', payload);
            // You can show a toast here if you want
            // For now, we rely on system notifications which show up if app is in background,
            // or we can manually trigger a notification or UI alert for foreground.
            if (payload?.notification) {
                new Notification(payload.notification.title, {
                    body: payload.notification.body,
                    icon: '/pwa-192x192.png',
                });
            }
        });

        // Note: onMessageListener returns a promise that resolves to payload, 
        // but the actual listener set up inside firebase.ts might need valid unsubscription handling 
        // if implemented strictly. For this simple implementation, valid enough.

        return () => {
            // Cleanup if needed
        };
    }, []);

    return { requestPermission, notificationPermission, fcmToken };
};
