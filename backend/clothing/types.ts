export interface ClothingItem {
  id: number;
  userId: string;
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
  updatedAt: Date;
}

export interface ClothingAnalysis {
  category: string;
  color: string;
  material: string;
  warmthLevel: number;
  waterResistance: boolean;
  windResistance: boolean;
  description: string;
}
