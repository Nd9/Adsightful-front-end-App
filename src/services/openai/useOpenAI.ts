import { useState, useCallback } from 'react';
import openAIService, { CampaignInputData } from './index';

/**
 * Hook for using OpenAI service within React components
 */
export const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Analyze campaign data
  const analyzeCampaign = useCallback(async (campaignData: CampaignInputData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await openAIService.analyzeCampaignData(campaignData);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);
  
  // Generate media plan
  const generateMediaPlan = useCallback(async (campaignData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await openAIService.generateMediaPlan(campaignData);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);
  
  // Generate creative recommendations
  const generateCreativeRecommendations = useCallback(async (campaignData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await openAIService.generateCreativeRecommendations(campaignData);
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);
  
  return {
    loading,
    error,
    analyzeCampaign,
    generateMediaPlan,
    generateCreativeRecommendations
  };
};

export default useOpenAI; 