import { useState, useEffect } from 'react';

export const usePWA = () => {
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        const checkPWA = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true; // For iOS legacy
            setIsPWA(isStandalone);
        };

        checkPWA();
        window.addEventListener('resize', checkPWA); // Sometimes mode changes on resize? unlikely but safe

        return () => window.removeEventListener('resize', checkPWA);
    }, []);

    return isPWA;
};
