import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Trophy, Medal, Award } from 'lucide-react';
import backend from '~backend/client';

interface Recommendation {
  id: number;
  suitabilityScore: number;
  reasoning: string;
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

interface RecommendationLadderProps {
  userId: string;
}

export function RecommendationLadder({ userId }: RecommendationLadderProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadLatestRecommendations();
  }, [userId]);

  const loadLatestRecommendations = async () => {
    try {
      const { recommendations: recs } = await backend.recommendations.getLatest({ userId });
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewRecommendations = async () => {
    setGenerating(true);
    try {
      const { recommendations: newRecs } = await backend.recommendations.generate({ userId });
      setRecommendations(newRecs);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return Trophy;
      case 1:
        return Medal;
      case 2:
        return Award;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground" aria-live="polite">
            Loading recommendations...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weather Recommendations</h2>
        <Button 
          onClick={generateNewRecommendations}
          disabled={generating}
          aria-label={generating ? 'Generating recommendations' : 'Generate new recommendations'}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} aria-hidden="true" />
          {generating ? 'Generating...' : 'Refresh'}
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" aria-hidden="true" />
              <p>No recommendations available.</p>
              <p className="text-sm mt-2">Add some clothing items first, then generate recommendations!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground text-center mb-6">
            Ranked by suitability for today's weather in Hong Kong
          </p>
          
          {recommendations.map((rec, index) => {
            const RankIcon = getRankIcon(index);
            return (
              <Card key={rec.id} className={index < 3 ? 'border-primary/50' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {RankIcon && (
                        <RankIcon 
                          className={`h-5 w-5 ${
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400' : 
                            'text-orange-600'
                          }`} 
                          aria-hidden="true" 
                        />
                      )}
                      <span className="text-muted-foreground text-sm font-normal">
                        #{index + 1}
                      </span>
                      {rec.clothingItem?.name}
                    </CardTitle>
                    <Badge 
                      variant={rec.suitabilityScore >= 80 ? 'default' : 'secondary'}
                      className={getScoreColor(rec.suitabilityScore)}
                    >
                      {rec.suitabilityScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    {rec.clothingItem?.imageUrl && (
                      <img
                        src={rec.clothingItem.imageUrl}
                        alt={rec.clothingItem.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    )}
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Suitability:</span>
                        <span className={`text-sm font-bold ${getScoreColor(rec.suitabilityScore)}`}>
                          {getScoreLabel(rec.suitabilityScore)}
                        </span>
                      </div>
                      
                      <Progress 
                        value={rec.suitabilityScore} 
                        className="h-2"
                        aria-label={`Suitability score: ${rec.suitabilityScore} out of 100`}
                      />
                      
                      {rec.clothingItem && (
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {rec.clothingItem.category}
                          </Badge>
                          {rec.clothingItem.color && (
                            <Badge variant="outline" className="text-xs">
                              {rec.clothingItem.color}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">AI Recommendation:</p>
                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
