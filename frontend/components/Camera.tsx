import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera as CameraIcon, Upload, Plus, Zap, Brain, Sparkles, Image, Scan } from 'lucide-react';
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
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          
          const { imageUrl } = await backend.clothing.uploadImage({
            imageData: base64Data,
            fileName: selectedFile.name
          });

          const { analysis } = await backend.clothing.analyzeImage({ imageUrl });

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

          onSuccess('Neural Analysis Complete', `${clothingName} has been analyzed and added to your digital wardrobe!`);
          
          setSelectedFile(null);
          setPreview(null);
          setClothingName('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error) {
          console.error('Error processing clothing:', error);
          onSuccess('Analysis Failed', 'Failed to process the clothing item. Please try again.');
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
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-3xl"></div>
      
      <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-medium">
              <Brain className="h-3 w-3" />
              AI POWERED
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Scan className="h-6 w-6 text-white" />
            </div>
            Neural Clothing Analyzer
          </CardTitle>
          <p className="text-slate-400 mt-2">
            Advanced AI vision technology for intelligent wardrobe analysis
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="clothing-name" className="text-slate-200 font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Clothing Item Name
            </Label>
            <Input
              id="clothing-name"
              type="text"
              placeholder="e.g., Blue Cotton T-Shirt"
              value={clothingName}
              onChange={(e) => setClothingName(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/50 rounded-xl"
              aria-describedby="clothing-name-help"
            />
            <p id="clothing-name-help" className="text-xs text-slate-400">
              Give your clothing item a descriptive name for easy identification
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-slate-200 font-medium flex items-center gap-2">
              <Image className="h-4 w-4 text-purple-400" />
              Image Capture
            </Label>
            
            {preview ? (
              <div className="relative group">
                <div className="relative rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                  <img
                    src={preview}
                    alt="Clothing preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                      Ready for analysis
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCapture}
                  className="mt-4 w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <div 
                onClick={handleCapture}
                className="group relative border-2 border-dashed border-white/30 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400 hover:bg-white/5 transition-all duration-300"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
                aria-label="Upload clothing image"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative space-y-4">
                  <div className="mx-auto p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 w-fit group-hover:scale-110 transition-transform duration-300">
                    <CameraIcon className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium mb-2">
                      Capture or Upload Clothing Image
                    </p>
                    <p className="text-sm text-slate-400">
                      AI will analyze material, style, and weather suitability
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Zap className="h-3 w-3" />
                    Instant AI Analysis
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select clothing image file"
            />
          </div>

          <Button
            onClick={handleAnalyzeAndSave}
            disabled={!selectedFile || !clothingName.trim() || isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            aria-describedby="analyze-button-help"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Neural Processing...</span>
                <Brain className="h-4 w-4 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Analyze & Add to Wardrobe
                <Plus className="h-4 w-4" />
              </div>
            )}
          </Button>
          
          <p id="analyze-button-help" className="text-xs text-slate-400 text-center">
            AI will analyze fabric type, warmth level, and weather resistance
          </p>
        </CardContent>
      </Card>
    </div>
  );
}