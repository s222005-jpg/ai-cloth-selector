import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { weather } from "~encore/clients";

const geminiApiKey = secret("GeminiApiKey");
import { clothing } from "~encore/clients";
import db from "../db";
import type { Recommendation } from "./types";

interface GenerateRecommendationsRequest {
  userId: string;
}

interface GenerateRecommendationsResponse {
  recommendations: Recommendation[];
}

// Generates clothing recommendations based on current weather.
export const generate = api<GenerateRecommendationsRequest, GenerateRecommendationsResponse>(
  { expose: true, method: "POST", path: "/recommendations/generate" },
  async ({ userId }): Promise<GenerateRecommendationsResponse> => {
    // Get current weather
    const weatherData = await weather.getCurrentWeather();
    
    // Get user's clothing items
    const { items } = await clothing.listItems({ userId });
    
    if (items.length === 0) {
      return { recommendations: [] };
    }
    
    // Generate recommendations for each item
    const recommendations: Recommendation[] = [];
    
    for (const item of items) {
      const { score, reasoning } = await evaluateClothing(item, weatherData);
      
      // Store recommendation
      const row = await db.queryRow<any>`
        INSERT INTO recommendations (
          user_id, clothing_item_id, weather_temp, weather_condition,
          weather_humidity, weather_wind_speed, suitability_score, reasoning
        ) VALUES (
          ${userId}, ${item.id}, ${weatherData.temperature}, ${weatherData.condition},
          ${weatherData.humidity}, ${weatherData.windSpeed}, ${score}, ${reasoning}
        ) RETURNING *
      `;
      
      if (row) {
        recommendations.push({
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
            id: item.id,
            name: item.name,
            description: item.description,
            category: item.category,
            color: item.color,
            imageUrl: item.imageUrl,
            warmthLevel: item.warmthLevel
          }
        });
      }
    }
    
    // Sort by suitability score (highest first)
    recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    
    return { recommendations };
  }
);

async function evaluateClothing(item: any, weather: any): Promise<{ score: number; reasoning: string }> {
  const apiKey = geminiApiKey();
  
  const prompt = `Evaluate this clothing item for the current weather conditions in Hong Kong:

Weather:
- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
- Condition: ${weather.condition} (${weather.description})
- Humidity: ${weather.humidity}%
- Wind Speed: ${weather.windSpeed} m/s

Clothing Item:
- Name: ${item.name}
- Category: ${item.category}
- Material: ${item.material}
- Warmth Level: ${item.warmthLevel}/5
- Water Resistant: ${item.waterResistance}
- Wind Resistant: ${item.windResistance}
- Color: ${item.color}

Provide a JSON response with:
{
  "score": 1-100 (suitability score),
  "reasoning": "brief explanation for blind users about why this item is/isn't suitable"
}

Consider comfort, weather appropriateness, and practical factors for Hong Kong's climate.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }
    
    const result = JSON.parse(jsonMatch[0]);
    return {
      score: Math.max(1, Math.min(100, result.score)),
      reasoning: result.reasoning
    };
  } catch (error) {
    console.error("Error evaluating clothing:", error);
    return {
      score: 50,
      reasoning: "Unable to evaluate this item due to an error."
    };
  }
}
