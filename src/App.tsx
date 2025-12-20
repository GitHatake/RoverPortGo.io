
import { Feed } from './components/Feed';
import { Compass } from 'lucide-react';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { NotificationButton } from './components/NotificationButton';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            <Compass size={28} />
            <span>RoverPortGo</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationButton />
            <a
              href="https://roverport.rcjweb.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Visit Original Site &rarr;
            </a>
          </div>
        </div>
      </header>

      <main className="py-8">
        <Feed />
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} RoverPort Viewer. Unofficial Viewer App.</p>
        </div>
      </footer>
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
