import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Trophy, Medal, Award, Target, Zap, Crown, Star, Sparkles, ChevronRight, Brain } from 'lucide-react';
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
    if (score >= 90) return 'from-yellow-400 to-orange-500';
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-blue-400 to-cyan-500';
    if (score >= 40) return 'from-purple-400 to-pink-500';
    return 'from-gray-400 to-slate-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Perfect Match';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good Choice';
    if (score >= 40) return 'Fair Option';
    return 'Poor Match';
  };

  const getScoreIcon = (score: number, rank: number) => {
    if (rank === 0 && score >= 90) return Crown;
    if (score >= 80) return Trophy;
    if (score >= 60) return Medal;
    return Award;
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl rounded-3xl"></div>
        
        <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4 p-6 rounded-xl bg-white/5">
                    <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                    <div className="w-16 h-16 bg-white/20 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="w-48 h-4 bg-white/20 rounded"></div>
                      <div className="w-32 h-3 bg-white/20 rounded"></div>
                      <div className="w-full h-2 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl rounded-3xl"></div>
      
      <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <Target className="h-6 w-6 text-white" />
              </div>
              AI Recommendations
            </CardTitle>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30">
              <Brain className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-emerald-300 font-medium">Neural Analysis</span>
            </div>
          </div>
          <p className="text-slate-400 mt-2">
            Weather-optimized clothing recommendations powered by advanced AI
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={generateNewRecommendations}
            disabled={generating}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            {generating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing Weather & Wardrobe...</span>
                <Brain className="h-4 w-4 animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Generate Smart Recommendations
                <Sparkles className="h-4 w-4" />
              </div>
            )}
          </Button>

          {recommendations.length === 0 ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="mx-auto p-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 w-fit">
                  <Target className="h-12 w-12 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
                  <p className="text-slate-400">
                    Generate AI-powered recommendations based on current weather
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-slate-300 font-medium">Ranked by Weather Suitability</span>
              </div>

              {recommendations.map((rec, index) => {
                const scoreGradient = getScoreColor(rec.suitabilityScore);
                const scoreLabel = getScoreLabel(rec.suitabilityScore);
                const ScoreIcon = getScoreIcon(rec.suitabilityScore, index);
                
                return (
                  <div
                    key={rec.id}
                    className="group relative p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 transition-all duration-300 hover:scale-102"
                    style={{ animationDelay: `${index * 100}ms` }}
                    role="article"
                    aria-label={`Recommendation ${index + 1}: ${rec.clothingItem?.name} with ${rec.suitabilityScore}% suitability`}
                  >
                    {/* Rank indicator */}
                    <div className="absolute -top-3 -left-3 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-start gap-6">
                      {/* Score badge */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${scoreGradient} shadow-lg`}>
                          <ScoreIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold bg-gradient-to-r ${scoreGradient} bg-clip-text text-transparent`}>
                            {rec.suitabilityScore}%
                          </div>
                          <div className="text-xs text-slate-400">{scoreLabel}</div>
                        </div>
                      </div>

                      {/* Clothing image */}
                      {rec.clothingItem && (
                        <div className="relative">
                          <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                            <img
                              src={rec.clothingItem.imageUrl}
                              alt={rec.clothingItem.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          {index === 0 && rec.suitabilityScore >= 90 && (
                            <div className="absolute -top-2 -right-2 p-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                              <Crown className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {rec.clothingItem?.name || 'Unknown Item'}
                            </h3>
                            {rec.clothingItem?.description && (
                              <p className="text-sm text-slate-400 mt-1">
                                {rec.clothingItem.description}
                              </p>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors duration-300" />
                        </div>

                        {/* AI Reasoning */}
                        <div className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-3 w-3 text-cyan-400" />
                            <span className="text-xs text-cyan-300 font-medium">AI Analysis</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {rec.reasoning}
                          </p>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Weather Suitability</span>
                            <span className="text-slate-300 font-medium">{rec.suitabilityScore}%</span>
                          </div>
                          <Progress 
                            value={rec.suitabilityScore} 
                            className="h-2 bg-white/10"
                            style={{
                              background: `linear-gradient(to right, rgb(${rec.suitabilityScore > 50 ? '34, 197, 94' : '239, 68, 68'}) ${rec.suitabilityScore}%, rgba(255,255,255,0.1) ${rec.suitabilityScore}%)`
                            }}
                          />
                        </div>

                        {/* Categories */}
                        {rec.clothingItem && (
                          <div className="flex gap-2 mt-3">
                            <Badge variant="secondary" className="bg-white/10 text-slate-300 border-white/20 text-xs">
                              {rec.clothingItem.category}
                            </Badge>
                            {rec.clothingItem.color && (
                              <Badge variant="secondary" className="bg-white/10 text-slate-300 border-white/20 text-xs">
                                {rec.clothingItem.color}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="bg-white/10 text-slate-300 border-white/20 text-xs">
                              Warmth Level {rec.clothingItem.warmthLevel}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}