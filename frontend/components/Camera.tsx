import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera as CameraIcon, Upload, Plus } from 'lucide-react';
import backend from '~backend/client';

interface CameraProps {
  userId: string;
  onSuccess: (title: string, description?: string) => void;
}

export function Camera({ userId, onSuccess }: CameraProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [clothingName, setClothingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeAndSave = async () => {
    if (!selectedFile || !clothingName.trim()) {
      onSuccess('Error', 'Please select an image and enter a name for the clothing item.');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          
          // Upload image
          const { imageUrl } = await backend.clothing.uploadImage({
            imageData: base64Data,
            fileName: selectedFile.name
          });

          // Analyze image
          const { analysis } = await backend.clothing.analyzeImage({ imageUrl });

          // Create clothing item
          await backend.clothing.createItem({
            userId,
            name: clothingName,
            description: analysis.description,
            category: analysis.category,
            color: analysis.color,
            material: analysis.material,
            warmthLevel: analysis.warmthLevel,
            waterResistance: analysis.waterResistance,
            windResistance: analysis.windResistance,
            imageUrl
          });

          onSuccess('Clothing Added', `${clothingName} has been analyzed and added to your wardrobe!`);
          
          // Reset form
          setSelectedFile(null);
          setPreview(null);
          setClothingName('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error processing clothing:', error);
          onSuccess('Error', 'Failed to process the clothing item. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error processing clothing:', error);
      onSuccess('Error', 'Failed to process the clothing item. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CameraIcon className="h-5 w-5" aria-hidden="true" />
          Add New Clothing Item
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="clothing-name">Clothing Name</Label>
          <Input
            id="clothing-name"
            placeholder="e.g., Blue Cotton T-Shirt"
            value={clothingName}
            onChange={(e) => setClothingName(e.target.value)}
            aria-describedby="name-help"
          />
          <p id="name-help" className="text-sm text-muted-foreground">
            Give your clothing item a descriptive name
          </p>
        </div>

        <div className="space-y-4">
          <Label htmlFor="photo-input">Take Photo or Upload Image</Label>
          <input
            id="photo-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            aria-describedby="photo-help"
          />
          
          {preview ? (
            <div className="space-y-4">
              <img 
                src={preview} 
                alt="Preview of selected clothing item"
                className="w-full max-w-md mx-auto rounded-lg border"
              />
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleCapture}
                  aria-label="Take new photo"
                >
                  <CameraIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                  Retake
                </Button>
                <Button 
                  onClick={handleAnalyzeAndSave}
                  disabled={isAnalyzing || !clothingName.trim()}
                  aria-label={isAnalyzing ? 'Analyzing clothing item' : 'Analyze and save clothing item'}
                >
                  {isAnalyzing ? (
                    'Analyzing...'
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      Add to Wardrobe
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleCapture} 
              className="w-full py-8"
              variant="outline"
              aria-label="Take photo of clothing item"
            >
              <div className="flex flex-col items-center gap-2">
                <CameraIcon className="h-8 w-8" aria-hidden="true" />
                <span>Take Photo</span>
                <span className="text-sm text-muted-foreground">
                  or tap to select from gallery
                </span>
              </div>
            </Button>
          )}
          
          <p id="photo-help" className="text-sm text-muted-foreground">
            Take a clear photo of the clothing item against a plain background for best analysis results
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
