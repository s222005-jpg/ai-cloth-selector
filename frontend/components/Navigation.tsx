import { Button } from '@/components/ui/button';
import { Camera, Shirt, TrendingUp, Sparkles } from 'lucide-react';
import type { View } from '../App';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'camera' as View, label: 'Neural Capture', icon: Camera, description: 'AI-powered image analysis', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'clothing' as View, label: 'Digital Wardrobe', icon: Shirt, description: 'Smart inventory system', gradient: 'from-purple-500 to-pink-500' },
    { id: 'recommendations' as View, label: 'AI Recommendations', icon: TrendingUp, description: 'Intelligent style suggestions', gradient: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <nav className="relative" role="tablist">
      <div className="flex flex-col sm:flex-row gap-4 p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onViewChange(item.id)}
              className={`group relative flex-1 flex flex-col items-center gap-3 p-6 h-auto text-center transition-all duration-300 border border-transparent rounded-xl ${
                isActive 
                  ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg shadow-black/25 border-white/20 scale-105` 
                  : 'hover:bg-white/10 hover:border-white/20 hover:scale-102'
              }`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              aria-label={`${item.label}: ${item.description}`}
            >
              {/* Glow effect for active item */}
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 blur-xl rounded-xl`}></div>
              )}
              
              <div className="relative flex flex-col items-center gap-3">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  {isActive && <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />}
                </div>
                
                <div>
                  <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                  <div className={`text-xs mt-1 hidden sm:block transition-all duration-300 ${
                    isActive ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}