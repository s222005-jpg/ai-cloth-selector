import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import type { ClothingAnalysis } from "./types";

const geminiApiKey = secret("GeminiApiKey");

interface AnalyzeImageRequest {
  imageUrl: string;
}

interface AnalyzeImageResponse {
  analysis: ClothingAnalysis;
}

// Analyzes a clothing image and extracts clothing properties.
export const analyzeImage = api<AnalyzeImageRequest, AnalyzeImageResponse>(
  { expose: true, method: "POST", path: "/clothing/analyze" },
  async ({ imageUrl }): Promise<AnalyzeImageResponse> => {
    const apiKey = geminiApiKey();
    
    const prompt = `Analyze this clothing item and provide the following information in JSON format:
    {
      "category": "shirt|pants|jacket|dress|shoes|hat|accessories",
      "color": "primary color of the item",
      "material": "cotton|wool|synthetic|denim|leather|other",
      "warmthLevel": 1-5 (1=very light/summer, 5=very warm/winter),
      "waterResistance": true/false,
      "windResistance": true/false,
      "description": "brief description for screen reader users"
    }
    
    Be accurate and consider the clothing's suitability for different weather conditions.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: await getImageBase64(imageUrl)
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw APIError.internal(`Gemini API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw APIError.internal("Could not parse AI response");
      }
      
      const analysis = JSON.parse(jsonMatch[0]) as ClothingAnalysis;
      
      return { analysis };
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw APIError.internal("Failed to analyze clothing image");
    }
  }
);

async function getImageBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}
