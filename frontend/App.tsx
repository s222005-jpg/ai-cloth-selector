import { useState } from 'react';
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
  const [userId] = useState('user-123'); // In a real app, this would come from auth
  const { toast } = useToast();

  const showToast = (title: string, description?: string) => {
    toast({ title, description });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Cloth Selecter.AI
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Smart clothing recommendations based on Hong Kong weather
          </p>
          <WeatherDisplay />
        </header>

        <Navigation 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />

        <main className="mt-8">
          {currentView === 'camera' && (
            <Camera userId={userId} onSuccess={showToast} />
          )}
          {currentView === 'clothing' && (
            <ClothingList userId={userId} />
          )}
          {currentView === 'recommendations' && (
            <RecommendationLadder userId={userId} />
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
