import { useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../lib/firebase';
import { VAPID_KEY } from '../lib/firebase';

export const usePushNotifications = () => {
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        // Check initial permission
        const currentPermission = Notification.permission;
        setNotificationPermission(currentPermission);

        // If permission is already granted, we should verify we have a token
        if (currentPermission === 'granted') {
            console.log('Permission granted on mount, fetching existing token...');
            requestForToken(VAPID_KEY).then(token => {
                if (token) {
                    console.log('Existing token restored:', token);
                    setFcmToken(token);
                } else {
                    console.log('No existing token found despite permission.');
                }
            }).catch(err => {
                console.error('Failed to restore token:', err);
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
