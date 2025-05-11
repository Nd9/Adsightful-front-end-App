import axios from 'axios';
import { SavedStrategy } from '../audienceStrategy';
import { User } from '../auth';

// Define environment variable for API key
const BFL_API_KEY = process.env.REACT_APP_BFL_API_KEY;
const API_ENDPOINT = 'https://api.us1.bfl.ai/v1/flux-pro-1.1';
const RESULT_ENDPOINT = 'https://api.us1.bfl.ai/v1/get_result';

// Add debug logging
console.log('BlackForest Labs API Key available:', !!BFL_API_KEY);

export interface ImageGenerationResult {
  url: string;
  platform: string;
  dimensions: string;
  prompt: string;
}

/**
 * Generate creative images for ads using BlackForest Labs' FLUX1
 */
export async function generateAdCreatives(
  strategy: SavedStrategy,
  user: User,
  platforms: string[] = ['Facebook', 'Instagram', 'LinkedIn', 'Google']
): Promise<ImageGenerationResult[]> {
  // Check if API key exists first
  if (!BFL_API_KEY) {
    console.warn('BlackForest Labs API key not found, using mock creatives instead');
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
    
    console.log(`Generating creative for ${platform} with API key ${BFL_API_KEY ? 'present' : 'missing'}`);
    
    // Check if API key is available
    if (!BFL_API_KEY) {
      console.error('BlackForest Labs API key is not set. Please add REACT_APP_BFL_API_KEY to your .env file');
      return null;
    }
    
    console.log(`Prompt for ${platform}:`, prompt);
    
    try {
      // Step 1: Create a request to generate the image
      console.log('Calling BlackForest Labs FLUX API...');
      const requestResponse = await axios.post(
        API_ENDPOINT,
        {
          prompt,
          width: parseInt(dimensions.displaySize.split('x')[0]),
          height: parseInt(dimensions.displaySize.split('x')[1])
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'x-key': BFL_API_KEY
          }
        }
      );
      
      console.log('BlackForest Labs API request response:', requestResponse.data);
      const requestId = requestResponse.data.id;
      
      if (!requestId) {
        console.error('No request ID received from BlackForest Labs API');
        return null;
      }
      
      // Step 2: Poll for the result
      const imageUrl = await pollForResult(requestId);
      if (!imageUrl) {
        console.error('Failed to get image URL from BlackForest Labs API');
        return null;
      }
      
      return {
        url: imageUrl,
        platform,
        dimensions: dimensions.displaySize,
        prompt
      };
      
    } catch (apiError: any) {
      // Handle API-specific errors
      console.error(`BlackForest Labs API error for ${platform}:`, apiError);
      
      // Log more detailed error information if available
      if (apiError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', apiError.response.data);
        console.error('Error response status:', apiError.response.status);
        console.error('Error response headers:', apiError.response.headers);
        
        // Check for specific error codes
        if (apiError.response.status === 429) {
          console.error('Rate limit exceeded. Maximum of 24 active tasks allowed.');
        } else if (apiError.response.status === 402) {
          console.error('Insufficient credits. Please add more credits at https://api.us1.bfl.ai');
        }
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
 * Poll for the result of a BlackForest Labs FLUX API request
 */
async function pollForResult(requestId: string, maxAttempts = 60, delayMs = 1000): Promise<string | null> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(RESULT_ENDPOINT, {
        headers: {
          'accept': 'application/json',
          'x-key': BFL_API_KEY
        },
        params: {
          id: requestId
        }
      });
      
      console.log(`Poll attempt ${attempts + 1}:`, response.data);
      
      if (response.data.status === 'Ready') {
        return response.data.result.sample;
      } else if (response.data.status === 'Failed') {
        console.error('Image generation failed:', response.data);
        return null;
      }
      
      // Wait before the next polling attempt
      await new Promise(resolve => setTimeout(resolve, delayMs));
      attempts++;
    } catch (error) {
      console.error('Error polling for result:', error);
      return null;
    }
  }
  
  console.error('Exceeded maximum polling attempts');
  return null;
}

/**
 * Create a detailed prompt for the image generation API following industry design standards
 */
function createPrompt(
  strategy: SavedStrategy,
  user: User,
  platform: string,
  persona: any
): string {
  // Extract key details
  const companyName = user.companyName || 'Brand';
  const painPoints = persona.painPoints?.[0] || 'efficiency';
  const motivation = persona.motivations?.[0] || 'success';
  const interest = persona.interests?.[0] || 'technology';
  const psychographic = persona.psychographics?.[0] || 'analytical';
  const productSummary = strategy.audienceBrief?.productSummary || `${companyName}'s solution`;
  
  // Define platform-specific details
  let adSize = '';
  let designStyle = '';
  let ctaText = 'Learn More';
  let colorPalette = '';
  
  switch (platform) {
    case 'Facebook':
      adSize = '1200x628 Facebook landscape';
      designStyle = 'Clean, engaging, conversation-starting';
      ctaText = 'Learn More';
      colorPalette = '#1877F2 (Facebook blue), #FFFFFF (white), #4267B2 (dark blue)';
      break;
    case 'Instagram':
      adSize = '1080x1080 Instagram square';
      designStyle = 'Vibrant, visual-first, lifestyle-oriented';
      ctaText = 'Shop Now';
      colorPalette = '#E1306C (Instagram pink), #F77737 (orange), #FFFFFF (white)';
      break;
    case 'LinkedIn':
      adSize = '1200x627 LinkedIn landscape';
      designStyle = 'Professional, corporate, authoritative';
      ctaText = 'Discover More';
      colorPalette = '#0077B5 (LinkedIn blue), #FFFFFF (white), #313335 (dark gray)';
      break;
    case 'Google':
      adSize = '300x250 Google Display';
      designStyle = 'Clean, action-oriented, solution-focused';
      ctaText = 'Get Started';
      colorPalette = '#4285F4 (Google blue), #FFFFFF (white), #34A853 (green)';
      break;
    default:
      adSize = '1200x628 landscape banner';
      designStyle = 'Professional, clean, modern';
      ctaText = 'Learn More';
      colorPalette = '#007BFF (blue), #FFFFFF (white), #212529 (dark)';
  }
  
  // Build the structured prompt
  const structuredPrompt = `
🔧 System Prompt:
You are a senior brand designer creating high-performing digital ad banners.

Audience: ${persona.name}, a ${persona.role} in the ${persona.ageRange} age range who is concerned about "${painPoints}", motivated by "${motivation}", and interested in "${interest}". They have a ${psychographic} personality.

Brand: ${companyName}

Product: ${productSummary}

Value Proposition: Solution for "${painPoints}" that delivers "${motivation}"

Tone & Style: ${designStyle}

Primary CTA: ${ctaText}

Ad Format: ${adSize}

🎨 Design Guidelines:
- Use a clean, modern layout with a clear visual hierarchy
- Emphasize the product benefits visually
- CTA must be bold, high-contrast, and easy to spot (bottom-right or center)
- Maintain generous white space. Keep copy minimal and legible
- Typography: Sans-serif, bold for headlines
- Color Palette: ${colorPalette}
- Composition: Use the Z-pattern or split-screen layout if product + text are both important

🖼️ Output Goal:
Generate a professional, human-designed ad creative that looks like it was created by a professional designer. It should appear as a polished, premium ad that would be approved by a marketing team. Make it visually appeal to the audience's tastes, highlight the product's unique selling point, and drive clicks via a compelling call-to-action.

Include the company name "${companyName}" visibly in the design, and make sure the ad follows standard industry practices for ${platform} advertising.
`;

  return structuredPrompt;
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