import { api } from "encore.dev/api";
import db from "../db";
import type { ClothingItem } from "./types";

interface CreateClothingItemRequest {
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
}

// Creates a new clothing item.
export const createItem = api<CreateClothingItemRequest, ClothingItem>(
  { expose: true, method: "POST", path: "/clothing/items" },
  async (req): Promise<ClothingItem> => {
    const row = await db.queryRow<any>`
      INSERT INTO clothing_items (
        user_id, name, description, category, color, material,
        warmth_level, water_resistance, wind_resistance, image_url
      ) VALUES (
        ${req.userId}, ${req.name}, ${req.description}, ${req.category},
        ${req.color}, ${req.material}, ${req.warmthLevel}, ${req.waterResistance},
        ${req.windResistance}, ${req.imageUrl}
      ) RETURNING *
    `;
    
    if (!row) {
      throw new Error("Failed to create clothing item");
    }
    
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      description: row.description,
      category: row.category,
      color: row.color,
      material: row.material,
      warmthLevel: row.warmth_level,
      waterResistance: row.water_resistance,
      windResistance: row.wind_resistance,
      imageUrl: row.image_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
);
