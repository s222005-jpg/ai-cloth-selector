import { Button } from '@/components/ui/button';
import { Camera, Shirt, Trophy } from 'lucide-react';
import type { View } from '../App';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'camera' as View, label: 'Add Clothing', icon: Camera },
    { id: 'clothing' as View, label: 'My Clothes', icon: Shirt },
    { id: 'recommendations' as View, label: 'Recommendations', icon: Trophy },
  ];

  return (
    <nav className="flex flex-wrap gap-2 justify-center" role="navigation" aria-label="Main navigation">
      {navItems.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={currentView === id ? 'default' : 'outline'}
          onClick={() => onViewChange(id)}
          className="flex items-center gap-2 px-6 py-3 text-lg"
          aria-pressed={currentView === id}
          aria-label={label}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </Button>
      ))}
    </nav>
  );
}
