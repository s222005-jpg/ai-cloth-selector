import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { Recommendation } from "./types";

interface GetLatestRecommendationsRequest {
  userId: Query<string>;
  limit?: Query<number>;
}

interface GetLatestRecommendationsResponse {
  recommendations: Recommendation[];
}

// Gets the latest recommendations for a user.
export const getLatest = api<GetLatestRecommendationsRequest, GetLatestRecommendationsResponse>(
  { expose: true, method: "GET", path: "/recommendations/latest" },
  async ({ userId, limit = 10 }): Promise<GetLatestRecommendationsResponse> => {
    const rows = await db.queryAll<any>`
      SELECT 
        r.*,
        c.name as clothing_name,
        c.description as clothing_description,
        c.category as clothing_category,
        c.color as clothing_color,
        c.image_url as clothing_image_url,
        c.warmth_level as clothing_warmth_level
      FROM recommendations r
      JOIN clothing_items c ON r.clothing_item_id = c.id
      WHERE r.user_id = ${userId}
      ORDER BY r.suitability_score DESC, r.created_at DESC
      LIMIT ${limit}
    `;
    
    const recommendations: Recommendation[] = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      clothingItemId: row.clothing_item_id,
      weatherTemp: row.weather_temp,
      weatherCondition: row.weather_condition,
      weatherHumidity: row.weather_humidity,
      weatherWindSpeed: row.weather_wind_speed,
      suitabilityScore: row.suitability_score,
      reasoning: row.reasoning,
      createdAt: row.created_at,
      clothingItem: {
        id: row.clothing_item_id,
        name: row.clothing_name,
        description: row.clothing_description,
        category: row.clothing_category,
        color: row.clothing_color,
        imageUrl: row.clothing_image_url,
        warmthLevel: row.clothing_warmth_level
      }
    }));
    
    return { recommendations };
  }
);
