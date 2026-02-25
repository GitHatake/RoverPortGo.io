import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCcw, X } from 'lucide-react';

export const ReloadPrompt = () => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
            // Check for updates every hour
            if (r) {
                setInterval(() => {
                    r.update();
                }, 60 * 60 * 1000);
            }
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setNeedRefresh(false);
    };

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            {(needRefresh) && (
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <RefreshCcw size={20} className="animate-spin-slow" />
                        <div className="text-sm font-medium">
                            <span className="block font-bold">New version available!</span>
                            <span>Tap to update now.</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="bg-white text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-gray-100 transition-colors"
                            onClick={() => updateServiceWorker(true)}
                        >
                            Update
                        </button>
                        <button
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            onClick={close}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
