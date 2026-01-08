
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
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
              title="Visit Original Site"
            >
              <img src={`${import.meta.env.BASE_URL}roverport-icon.png`} alt="RoverPort" className="w-8 h-8 rounded-full" />
            </a>
          </div>
        </div>
      </header>

      <main className="py-8">
        <Feed />
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} RoverPort Viewer. Unofficial Viewer App. v1.0.1</p>
        </div>
      </footer>
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
