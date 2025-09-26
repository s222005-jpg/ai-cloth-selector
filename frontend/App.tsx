import { useState, useEffect } from 'react';
import { Camera } from './components/Camera';
import { ClothingList } from './components/ClothingList';
import { RecommendationLadder } from './components/RecommendationLadder';
import { WeatherDisplay } from './components/WeatherDisplay';
import { Navigation } from './components/Navigation';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export type View = 'camera' | 'clothing' | 'recommendations';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('camera');
  const [userId] = useState('user-123');
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const showToast = (title: string, description?: string) => {
    toast({ title, description });
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"></div>

      <div className={`relative z-10 container mx-auto px-4 py-8 max-w-6xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <header className="mb-12 text-center">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 tracking-tight">
              CLOTH SELECTER
              <span className="text-2xl md:text-3xl font-light block mt-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀɪ
              </span>
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl rounded-full opacity-50"></div>
          </div>
          <p className="text-slate-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Next-generation AI-powered wardrobe intelligence for Hong Kong's dynamic climate
          </p>
          <WeatherDisplay />
        </header>

        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />

        <main className="mt-12">
          <div className="transition-all duration-500 ease-in-out">
            {currentView === 'camera' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <Camera userId={userId} onSuccess={showToast} />
              </div>
            )}
            {currentView === 'clothing' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <ClothingList userId={userId} />
              </div>
            )}
            {currentView === 'recommendations' && (
              <div className="animate-in slide-in-from-right-4 duration-500">
                <RecommendationLadder userId={userId} />
              </div>
            )}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
