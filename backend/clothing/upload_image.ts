import { api } from "encore.dev/api";
import { clothingImages } from "../storage";

interface UploadImageRequest {
  imageData: string; // base64 encoded image
  fileName: string;
}

interface UploadImageResponse {
  imageUrl: string;
}

// Uploads a clothing image to storage.
export const uploadImage = api<UploadImageRequest, UploadImageResponse>(
  { expose: true, method: "POST", path: "/clothing/upload" },
  async ({ imageData, fileName }): Promise<UploadImageResponse> => {
    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const timestamp = Date.now();
    const objectName = `${timestamp}-${fileName}`;
    
    await clothingImages.upload(objectName, buffer, {
      contentType: 'image/jpeg'
    });
    
    const imageUrl = clothingImages.publicUrl(objectName);
    
    return { imageUrl };
  }
);
