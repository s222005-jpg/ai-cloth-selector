export interface Recommendation {
  id: number;
  userId: string;
  clothingItemId: number;
  weatherTemp: number;
  weatherCondition: string;
  weatherHumidity: number;
  weatherWindSpeed: number;
  suitabilityScore: number;
  reasoning: string;
  createdAt: Date;
  clothingItem?: {
    id: number;
    name: string;
    description?: string;
    category: string;
    color?: string;
    imageUrl: string;
    warmthLevel: number;
  };
}
