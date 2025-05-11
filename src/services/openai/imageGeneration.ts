import axios from 'axios';
import { SavedStrategy } from '../audienceStrategy';
import { User } from '../auth';

// Define environment variable for API key
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/images/generations';

// Add debug logging
console.log('OpenAI API Key available:', !!OPENAI_API_KEY);

export interface ImageGenerationResult {
  url: string;
  platform: string;
  dimensions: string;
  prompt: string;
}

/**
 * Generate creative images for ads using OpenAI's gpt-image-1
 */
export async function generateAdCreatives(
  strategy: SavedStrategy,
  user: User,
  platforms: string[] = ['Facebook', 'Instagram', 'LinkedIn', 'Google']
): Promise<ImageGenerationResult[]> {
  // Check if API key exists first
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found, using mock creatives instead');
    return generateMockCreatives(strategy, user, platforms);
  }

  try {
    // Generate one creative per platform in parallel
    const promises = platforms.map(platform => generateSingleCreative(strategy, user, platform));
    const creatives = await Promise.all(promises);
    const validCreatives = creatives.filter(c => c !== null) as ImageGenerationResult[];
    
    // If no valid creatives were generated, fall back to mock creatives
    if (validCreatives.length === 0) {
      console.warn('No valid creatives were generated, using mock creatives instead');
      return generateMockCreatives(strategy, user, platforms);
    }
    
    return validCreatives;
  } catch (error) {
    console.error('Error generating ad creatives:', error);
    return generateMockCreatives(strategy, user, platforms);
  }
}

/**
 * Generate a single creative for a specific platform
 */
async function generateSingleCreative(
  strategy: SavedStrategy,
  user: User,
  platform: string
): Promise<ImageGenerationResult | null> {
  try {
    // Get persona from the strategy (use first persona for simplicity)
    const persona = strategy.audienceBrief.personas[0];
    
    // Build a prompt based on strategy, company, and platform
    const prompt = createPrompt(strategy, user, platform, persona);
    
    // Set the dimensions based on the platform
    const dimensions = getPlatformDimensions(platform);
    
    console.log(`Generating creative for ${platform} with API key ${OPENAI_API_KEY ? 'present' : 'missing'}`);
    
    // Check if API key is available
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key is not set. Please add REACT_APP_OPENAI_API_KEY to your .env file');
      return null;
    }
    
    console.log(`Prompt for ${platform}:`, prompt);
    
    try {
      // Call OpenAI API to generate the image
      console.log('Calling OpenAI API...');
      const response = await axios.post(
        API_ENDPOINT,
        {
          model: "gpt-image-1",
          prompt,
          n: 1,
          size: dimensions.apiSize,
          quality: "standard",
          response_format: "url"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      
      console.log('OpenAI API response status:', response.status);
      console.log('OpenAI API response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        return {
          url: response.data.data[0].url,
          platform,
          dimensions: dimensions.displaySize,
          prompt
        };
      } else {
        console.error('Unexpected response format from OpenAI API:', response.data);
      }
    } catch (apiError: any) {
      // Handle API-specific errors
      console.error(`OpenAI API error for ${platform}:`, apiError);
      
      // Log more detailed error information if available
      if (apiError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', apiError.response.data);
        console.error('Error response status:', apiError.response.status);
        console.error('Error response headers:', apiError.response.headers);
      } else if (apiError.request) {
        // The request was made but no response was received
        console.error('Error request (no response received):', apiError.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', apiError.message);
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error generating ${platform} creative:`, error);
    return null;
  }
}

/**
 * Create a detailed prompt for the image generation API
 */
function createPrompt(
  strategy: SavedStrategy,
  user: User,
  platform: string,
  persona: any
): string {
  // Extract key details
  const companyName = user.companyName;
  const painPoints = persona.painPoints[0];
  const motivation = persona.motivations[0];
  const interest = persona.interests[0];
  const psychographic = persona.psychographics[0];
  
  // Create a base prompt tailored to the platform
  let basePrompt = '';
  
  switch (platform) {
    case 'Facebook':
      basePrompt = `Create a Facebook ad for ${companyName} that addresses the pain point of "${painPoints}". The ad should appeal to ${psychographic} personalities. Make it visually engaging for a feed placement with the company name visible. Dimensions 1200x628.`;
      break;
    case 'Instagram':
      basePrompt = `Design an Instagram post ad for ${companyName} focusing on the interest in "${interest}". Use vibrant colors and lifestyle imagery that would appeal to ${persona.role}s. Include subtle branding. Square format 1080x1080.`;
      break;
    case 'LinkedIn':
      basePrompt = `Create a professional LinkedIn ad for ${companyName} that speaks to ${persona.role}s. Address the professional motivation of "${motivation}". Use a clean, corporate style with appropriate branding. Dimensions 1200x627.`;
      break;
    case 'Google':
      basePrompt = `Design a Google Display ad for ${companyName} that clearly communicates a solution to "${painPoints}". Make it clean and action-oriented with a clear value proposition. Dimensions 300x250.`;
      break;
    default:
      basePrompt = `Create a digital ad for ${companyName} targeted at ${persona.role}s who are interested in ${interest} and motivated by ${motivation}. Include clear branding and a professional look.`;
  }
  
  // Enhance the prompt with product and audience-specific details
  return `${basePrompt} 
  
The ad should be targeted at ${persona.name}, who is a ${persona.role} in the ${persona.ageRange} age range.

Product/Service description: ${strategy.audienceBrief.productSummary}

The ad should focus on the target audience's key pain point: "${painPoints}", 
and appeal to their motivation: "${motivation}".

Include a clear, professional design with the company name "${companyName}" visible.
Make the ad highly professional, modern, and suitable for digital advertising.`;
}

/**
 * Get the appropriate dimensions for different platforms
 */
function getPlatformDimensions(platform: string): { apiSize: string; displaySize: string } {
  switch (platform) {
    case 'Facebook':
      return { apiSize: '1024x1024', displaySize: '1200x628' };
    case 'Instagram':
      return { apiSize: '1024x1024', displaySize: '1080x1080' };
    case 'LinkedIn':
      return { apiSize: '1024x1024', displaySize: '1200x627' };
    case 'Google':
      return { apiSize: '1024x1024', displaySize: '300x250' };
    default:
      return { apiSize: '1024x1024', displaySize: '1200x628' };
  }
}

/**
 * Generate mock creatives when API fails (for demo/development)
 */
function generateMockCreatives(
  strategy: SavedStrategy,
  user: User,
  platforms: string[]
): ImageGenerationResult[] {
  console.log('Generating mock creatives as fallback');
  
  // Ensure we have at least a basic persona structure to work with
  const personas = strategy.audienceBrief?.personas || [];
  const defaultPersona = {
    name: 'Sample User',
    role: 'Professional',
    ageRange: '25-45',
    painPoints: ['Efficiency'],
    motivations: ['Success'],
    interests: ['Technology'],
    psychographics: ['Analytical']
  };
  const persona = personas.length > 0 ? personas[0] : defaultPersona;
  
  return platforms.map(platform => {
    const dimensions = getPlatformDimensions(platform);
    
    // Use a safe prompt creation approach that won't crash if data is missing
    let prompt;
    try {
      prompt = createPrompt(strategy, user, platform, persona);
    } catch (error) {
      console.error('Failed to create prompt for mock creative:', error);
      prompt = `Generate a sample ${platform} ad for ${user.companyName || 'Company'}`;
    }
    
    // Different placeholder image sizes for different platforms
    let placeholder = 'https://via.placeholder.com/';
    switch (platform) {
      case 'Facebook':
        placeholder += '1200x628/007BFF/FFFFFF';
        break;
      case 'Instagram':
        placeholder += '1080x1080/E1306C/FFFFFF';
        break;
      case 'LinkedIn':
        placeholder += '1200x627/0077B5/FFFFFF';
        break;
      case 'Google':
        placeholder += '300x250/4285F4/FFFFFF';
        break;
      default:
        placeholder += '1200x628/007BFF/FFFFFF';
    }
    
    // Add text to the placeholder image
    const companyName = user.companyName || 'Company';
    placeholder += `?text=${encodeURIComponent(`${companyName} - ${platform} Ad`)}`;
    
    return {
      url: placeholder,
      platform,
      dimensions: dimensions.displaySize,
      prompt
    };
  });
} 