import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shirt, Palette, Thermometer, Shield, Wind, Package, Sparkles, ChevronRight } from 'lucide-react';
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

  const getCategoryIcon = (category: string) => {
    return Shirt;
  };

  const getWarmthColor = (level: number) => {
    if (level <= 2) return 'from-blue-400 to-cyan-500';
    if (level <= 3) return 'from-green-400 to-emerald-500';
    return 'from-orange-400 to-red-500';
  };

  const getWarmthLabel = (level: number) => {
    if (level <= 2) return 'Cool';
    if (level <= 3) return 'Moderate';
    return 'Warm';
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-3xl rounded-3xl"></div>
        
        <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Digital Wardrobe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                    <div className="w-16 h-16 bg-white/20 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-32 h-4 bg-white/20 rounded"></div>
                      <div className="w-24 h-3 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-3xl rounded-3xl"></div>
        
        <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              Digital Wardrobe
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto p-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 w-fit">
                <Shirt className="h-12 w-12 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Your wardrobe is empty</h3>
                <p className="text-slate-400">
                  Start by capturing clothing images with our AI analyzer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-3xl rounded-3xl"></div>
      
      <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Package className="h-6 w-6 text-white" />
              </div>
              Digital Wardrobe
            </CardTitle>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
              <Sparkles className="h-3 w-3 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">{items.length} Items</span>
            </div>
          </div>
          <p className="text-slate-400 mt-2">
            Your AI-analyzed clothing collection with smart metadata
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {items.map((item, index) => {
              const CategoryIcon = getCategoryIcon(item.category);
              const warmthGradient = getWarmthColor(item.warmthLevel);
              const warmthLabel = getWarmthLabel(item.warmthLevel);
              
              return (
                <div
                  key={item.id}
                  className="group relative p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-102"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-start gap-6">
                    {/* Image */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                        <img
                          src={item.imageUrl}
                          alt={`${item.name} - ${item.description}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                        <CategoryIcon className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white truncate">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                      </div>

                      {/* Properties */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {item.color && (
                          <div className="flex items-center gap-2">
                            <Palette className="h-3 w-3 text-pink-400" />
                            <span className="text-xs text-slate-300 capitalize">{item.color}</span>
                          </div>
                        )}
                        
                        {item.material && (
                          <div className="flex items-center gap-2">
                            <Shirt className="h-3 w-3 text-blue-400" />
                            <span className="text-xs text-slate-300 capitalize">{item.material}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Thermometer className="h-3 w-3 text-orange-400" />
                          <span className="text-xs text-slate-300">{warmthLabel}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-300 capitalize">{item.category}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`bg-gradient-to-r ${warmthGradient} text-white border-0 text-xs`}
                        >
                          <Thermometer className="h-3 w-3 mr-1" />
                          Level {item.warmthLevel}
                        </Badge>
                        
                        {item.waterResistance && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-xs"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Water Resistant
                          </Badge>
                        )}
                        
                        {item.windResistance && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gradient-to-r from-gray-500 to-slate-600 text-white border-0 text-xs"
                          >
                            <Wind className="h-3 w-3 mr-1" />
                            Windproof
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}