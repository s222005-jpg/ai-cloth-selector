import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { ClothingItem } from "./types";

interface ListClothingItemsRequest {
  userId: Query<string>;
}

interface ListClothingItemsResponse {
  items: ClothingItem[];
}

// Lists all clothing items for a user.
export const listItems = api<ListClothingItemsRequest, ListClothingItemsResponse>(
  { expose: true, method: "GET", path: "/clothing/items" },
  async ({ userId }): Promise<ListClothingItemsResponse> => {
    const rows = await db.queryAll<any>`
      SELECT * FROM clothing_items 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    
    const items: ClothingItem[] = rows.map(row => ({
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
    }));
    
    return { items };
  }
);
