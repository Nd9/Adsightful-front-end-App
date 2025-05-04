import axios from 'axios';

// Define environment variable for API key (will need to be set in .env file)
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// Interface for campaign input data that will be sent to OpenAI
export interface CampaignInputData {
  websiteUrl: string;
  industry: string;
  competitorUrls?: string[];
  objective?: string;
  budget?: {
    amount: number;
    duration: number;
    isDaily: boolean;
  };
}

// Generic response interface from the OpenAI API
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

/**
 * Service for interacting with OpenAI API
 */
class OpenAIService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key is not set. Please set REACT_APP_OPENAI_API_KEY environment variable.');
    }
  }
  
  /**
   * Analyze website and generate campaign recommendations
   */
  async analyzeCampaignData(campaignData: CampaignInputData): Promise<any> {
    try {
      // Create a prompt that describes the task for the AI
      const prompt = this.createCampaignAnalysisPrompt(campaignData);
      
      const response = await axios.post<OpenAIResponse>(
        API_ENDPOINT,
        {
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert digital marketing assistant that helps create effective ad campaigns. Provide data-driven recommendations based on industry knowledge, best practices, and the specific details provided.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Extract the content from the response
      const content = response.data.choices[0].message.content;
      
      // Parse the content into a structured format (if needed)
      // This will depend on how we structure the response from OpenAI
      return this.parseAIResponse(content);
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to analyze campaign data with AI');
    }
  }
  
  /**
   * Generate a media plan based on campaign parameters
   */
  async generateMediaPlan(campaignData: any): Promise<any> {
    try {
      // Create a prompt specific to media plan generation
      const prompt = this.createMediaPlanPrompt(campaignData);
      
      const response = await axios.post<OpenAIResponse>(
        API_ENDPOINT,
        {
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a media planning expert that creates optimized campaign budgets across platforms. Provide detailed allocation recommendations with expected performance metrics.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      const content = response.data.choices[0].message.content;
      return this.parseMediaPlanResponse(content);
      
    } catch (error) {
      console.error('Error generating media plan:', error);
      throw new Error('Failed to generate media plan with AI');
    }
  }
  
  /**
   * Generate creative recommendations based on campaign objectives and industry
   */
  async generateCreativeRecommendations(campaignData: any): Promise<any> {
    try {
      // Create a prompt for creative recommendations
      const prompt = this.createCreativePrompt(campaignData);
      
      const response = await axios.post<OpenAIResponse>(
        API_ENDPOINT,
        {
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a creative director specializing in digital advertising. Provide tailored creative recommendations that align with brand goals and target audience.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1200,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      const content = response.data.choices[0].message.content;
      return this.parseCreativeResponse(content);
      
    } catch (error) {
      console.error('Error generating creative recommendations:', error);
      throw new Error('Failed to generate creative recommendations with AI');
    }
  }
  
  // Helper methods to create prompts
  private createCampaignAnalysisPrompt(campaignData: CampaignInputData): string {
    return `
      I need comprehensive campaign recommendations for a business with the following details:
      
      Website: ${campaignData.websiteUrl}
      Industry: ${campaignData.industry}
      Competitor Websites: ${campaignData.competitorUrls?.join(', ') || 'None provided'}
      Campaign Objective: ${campaignData.objective || 'Not specified'}
      
      Please analyze this information and provide:
      1. Recommended campaign objective if not specified
      2. Target audience personas (3-5) that would be ideal for this business
      3. Recommended advertising platforms based on the industry and objective
      4. Key performance indicators (KPIs) to track
      5. Estimated performance metrics (CTR, conversion rate, etc.)
      
      Format your response as structured JSON for easier parsing.
    `;
  }
  
  private createMediaPlanPrompt(campaignData: any): string {
    return `
      I need a detailed media plan for a ${campaignData.industry} business with the following parameters:
      
      Campaign Objective: ${campaignData.objective}
      Total Budget: $${campaignData.budget.amount}${campaignData.budget.isDaily ? ' per day' : ' total'}
      Campaign Duration: ${campaignData.budget.duration} days
      Target Platforms: ${campaignData.platforms.join(', ')}
      Target Audience: ${JSON.stringify(campaignData.audiencePersona)}
      
      Please provide:
      1. Budget allocation across platforms (percentage and dollar amount)
      2. Recommended ad formats for each platform
      3. Recommended placements within each platform
      4. Estimated impressions, clicks, and conversions
      5. Estimated CPM, CPC, and CPA
      
      Format your response as structured JSON that can be parsed into a media plan.
    `;
  }
  
  private createCreativePrompt(campaignData: any): string {
    return `
      I need creative recommendations for a ${campaignData.industry} business with the following campaign:
      
      Campaign Objective: ${campaignData.objective}
      Target Audience: ${JSON.stringify(campaignData.audiencePersona)}
      Selected Platforms: ${campaignData.platforms.join(', ')}
      
      Please provide:
      1. 5-7 headline suggestions
      2. 3-5 ad copy variations
      3. 4-6 call-to-action recommendations
      4. Visual element recommendations for each platform
      5. Key messaging themes that would resonate with the audience
      
      Format your response as structured JSON that can be parsed into creative recommendations.
    `;
  }
  
  // Helper methods to parse responses
  private parseAIResponse(content: string): any {
    try {
      // Attempt to parse as JSON if the response is properly formatted
      return JSON.parse(content);
    } catch (error) {
      // If not JSON, return the raw content with some structure
      return {
        rawResponse: content,
        // Basic parsing logic could be added here based on expected format
        recommendations: this.extractRecommendations(content)
      };
    }
  }
  
  private parseMediaPlanResponse(content: string): any {
    try {
      return JSON.parse(content);
    } catch (error) {
      // Implement fallback parsing if not JSON
      return {
        rawResponse: content,
        // Basic parsing could be added here
      };
    }
  }
  
  private parseCreativeResponse(content: string): any {
    try {
      return JSON.parse(content);
    } catch (error) {
      // Implement fallback parsing if not JSON
      return {
        rawResponse: content,
        // Basic parsing could be added here
      };
    }
  }
  
  private extractRecommendations(content: string): any {
    // Simple extraction logic - this would be more sophisticated in production
    const sections: any = {};
    
    // Example: Extract audience personas
    const audienceMatch = content.match(/Target audience personas:(.*?)(?=\d\.|$)/s);
    if (audienceMatch && audienceMatch[1]) {
      sections.audiences = audienceMatch[1].trim();
    }
    
    // Example: Extract platforms
    const platformsMatch = content.match(/Recommended advertising platforms:(.*?)(?=\d\.|$)/s);
    if (platformsMatch && platformsMatch[1]) {
      sections.platforms = platformsMatch[1].trim();
    }
    
    return sections;
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService();
export default openAIService; 