import { useState, useEffect } from 'react';
import { Share, Plus, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAInstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Check if already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) return;

        // Detect iOS
        const ua = window.navigator.userAgent;
        const isIOSDevice = /ipad|iphone|ipod/.test(ua.toLowerCase());
        setIsIOS(isIOSDevice);

        if (isIOSDevice) {
            // Show prompt for iOS users after a short delay
            // Check if user has dismissed it before (optional, using localStorage)
            const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
            if (!hasDismissed) {
                const timer = setTimeout(() => setShowPrompt(true), 3000);
                return () => clearTimeout(timer);
            }
        } else {
            // For Android/Desktop, listen to beforeinstallprompt
            const handleBeforeInstallPrompt = (e: any) => {
                e.preventDefault();
                setDeferredPrompt(e);
                const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
                if (!hasDismissed) {
                    setShowPrompt(true);
                }
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        }
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa_prompt_dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-8 md:w-96"
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 relative overflow-hidden">
                    {/* Background Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-start gap-4 pr-6">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg flex-shrink-0">
                            <img src="/pwa-192x192.png" alt="App Icon" className="w-8 h-8 rounded-md" />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                Install RoverPortGo
                            </h3>

                            {isIOS ? (
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                    <p>ホーム画面に追加して、アプリとして利用しましょう。</p>
                                    <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                                        1. <Share size={16} />（共有）をタップ
                                    </div>
                                    <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                                        2. <Plus size={16} className="border border-current rounded-sm p-[1px]" />「ホーム画面に追加」
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <p className="mb-3">
                                        より快適に記事を読むために、アプリをインストールしませんか？
                                    </p>
                                    <button
                                        onClick={handleInstallClick}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Download size={18} />
                                        インストール
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
