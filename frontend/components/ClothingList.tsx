import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shirt, Palette, Thermometer, Shield, Wind } from 'lucide-react';
import backend from '~backend/client';

interface ClothingItem {
  id: number;
  name: string;
  description?: string;
  category: string;
  color?: string;
  material?: string;
  warmthLevel: number;
  waterResistance: boolean;
  windResistance: boolean;
  imageUrl: string;
  createdAt: Date;
}

interface ClothingListProps {
  userId: string;
}

export function ClothingList({ userId }: ClothingListProps) {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [userId]);

  const loadItems = async () => {
    try {
      const { items: clothingItems } = await backend.clothing.listItems({ userId });
      setItems(clothingItems);
    } catch (error) {
      console.error('Failed to load clothing items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWarmthLabel = (level: number) => {
    const labels = ['Very Light', 'Light', 'Medium', 'Warm', 'Very Warm'];
    return labels[level - 1] || 'Unknown';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground" aria-live="polite">
            Loading your clothing items...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            <Shirt className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
            <p>No clothing items yet.</p>
            <p className="text-sm mt-2">Use the camera to add your first item!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Wardrobe ({items.length} items)</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={item.imageUrl}
                alt={`${item.name} - ${item.description || item.category}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="capitalize">
                  {item.category}
                </Badge>
                {item.color && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Palette className="h-3 w-3" aria-hidden="true" />
                    {item.color}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Warmth: {getWarmthLabel(item.warmthLevel)}</span>
                </div>
                
                {item.material && (
                  <div className="flex items-center gap-2">
                    <Shirt className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>Material: {item.material}</span>
                  </div>
                )}
                
                <div className="flex gap-4">
                  {item.waterResistance && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Shield className="h-4 w-4" aria-hidden="true" />
                      <span>Water Resistant</span>
                    </div>
                  )}
                  {item.windResistance && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Wind className="h-4 w-4" aria-hidden="true" />
                      <span>Windproof</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
