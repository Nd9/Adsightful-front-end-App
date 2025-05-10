import axios from 'axios';
import { Persona, ChannelStrategy } from '../../types/audience';

// Define environment variable for API key
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/**
 * Generates a platform-specific advertising strategy for a given channel and persona
 */
export async function generateChannelStrategy(channel: string, persona: Persona): Promise<ChannelStrategy> {
  try {
    // Call OpenAI API with function calling
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert ${channel} advertising strategist with years of experience in digital marketing. 
            Create a comprehensive, platform-specific advertising strategy for the given target persona.
            Your strategy should include detailed audience segmentation, targeting recommendations, creative approach, 
            budget allocation advice, KPIs to track, and platform-specific best practices.
            Make all recommendations specific to ${channel} as an advertising platform.`
          },
          {
            role: 'user',
            content: `Create a detailed ${channel} advertising strategy for the following persona:
            
            Name: ${persona.name}
            Role: ${persona.role}
            Age Range: ${persona.ageRange}
            
            Pain Points: ${persona.painPoints.join(', ')}
            Motivations: ${persona.motivations.join(', ')}
            Psychographics: ${persona.psychographics.join(', ')}
            Interests: ${persona.interests.join(', ')}
            Behaviors: ${persona.behaviors.join(', ')}
            
            The strategy should be comprehensive and platform-specific, leveraging ${channel}'s unique targeting capabilities, ad formats, and best practices.`
          }
        ],
        functions: [
          {
            name: 'createChannelStrategy',
            description: `Generate a comprehensive ${channel} advertising strategy for the given persona`,
            parameters: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'The advertising channel for which the strategy is being created'
                },
                audienceSegmentation: {
                  type: 'array',
                  description: `Detailed ${channel}-specific audience segments to target based on the persona`,
                  items: { type: 'string' }
                },
                targetingRecommendations: {
                  type: 'array',
                  description: `Specific targeting parameters and options available on ${channel}`,
                  items: { type: 'string' }
                },
                creativeApproach: {
                  type: 'string',
                  description: `Recommended creative approach for ${channel} ads, including format, messaging, and creative elements`
                },
                budgetAllocation: {
                  type: 'string',
                  description: `Budget allocation recommendations specific to ${channel} advertising`
                },
                kpis: {
                  type: 'array',
                  description: `Key performance indicators to track for ${channel} campaigns`,
                  items: { type: 'string' }
                },
                bestPractices: {
                  type: 'array',
                  description: `${channel}-specific advertising best practices and optimization tips`,
                  items: { type: 'string' }
                }
              },
              required: ['channel', 'audienceSegmentation', 'targetingRecommendations', 'creativeApproach', 'budgetAllocation', 'kpis', 'bestPractices']
            }
          }
        ],
        function_call: { name: 'createChannelStrategy' },
        temperature: 0.7,
        max_tokens: 2500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    // Extract and parse the response
    const functionCall = response.data.choices[0].message.function_call;
    
    if (!functionCall || functionCall.name !== 'createChannelStrategy') {
      throw new Error(`Failed to generate ${channel} advertising strategy`);
    }
    
    // Parse the JSON arguments
    const channelStrategy: ChannelStrategy = JSON.parse(functionCall.arguments);
    
    // Validate the response
    if (!channelStrategy.channel || !channelStrategy.audienceSegmentation || !channelStrategy.targetingRecommendations) {
      throw new Error('Invalid channel strategy generated');
    }
    
    return channelStrategy;
  } catch (error) {
    console.error(`Error generating ${channel} strategy:`, error);
    
    // Fallback to a mock strategy if API call fails
    return createMockChannelStrategy(channel, persona);
  }
}

/**
 * Creates a mock channel strategy when the API call fails
 */
function createMockChannelStrategy(channel: string, persona: Persona): ChannelStrategy {
  return {
    channel,
    audienceSegmentation: [
      `${persona.role} in the ${persona.ageRange} age group`,
      `People with interests in: ${persona.interests.slice(0, 3).join(', ')}`,
      `Users experiencing: ${persona.painPoints.slice(0, 2).join(', ')}`,
      `Professionals with behaviors: ${persona.behaviors.slice(0, 2).join(', ')}`,
      `Individuals motivated by: ${persona.motivations.slice(0, 2).join(', ')}`
    ],
    targetingRecommendations: [
      `Use ${persona.searchKeywords.slice(0, 3).join(', ')} as primary keywords`,
      `Target users with job titles related to ${persona.role}`,
      `Create custom audiences based on website visitors interested in solutions to: ${persona.painPoints[0]}`,
      `Develop lookalike audiences from your existing customers that match this persona`,
      `Geographical targeting should focus on urban areas with high concentration of ${persona.role} professionals`
    ],
    creativeApproach: `Create ads that directly address the ${persona.painPoints[0]} pain point with visuals that appeal to ${persona.psychographics[0]}. Use messaging that emphasizes ${persona.motivations[0]} and include clear CTAs related to their stage in the buyer journey.`,
    budgetAllocation: `Allocate 30% of budget to prospecting new users, 50% to retargeting engaged users, and 20% to conversion campaigns. Start with a test budget of $1000 for two weeks to gauge performance metrics.`,
    kpis: [
      'Click-through rate (CTR) of 2% or higher',
      'Conversion rate of 5% on landing pages',
      'Cost per acquisition (CPA) under $50',
      'Return on ad spend (ROAS) of 3:1 or better',
      'Engagement rate above industry average (4% for this sector)'
    ],
    bestPractices: [
      `For ${channel}, use square or vertical video formats for best engagement`,
      `Update ad creatives every 2 weeks to prevent ad fatigue`,
      `A/B test different value propositions focusing on ${persona.motivations.slice(0, 2).join(' vs. ')}`,
      `Include social proof elements that address ${persona.painPoints[0]}`,
      `Set up automated rules to shift budget to best-performing ad sets`,
      `Implement remarketing campaigns for users who engaged but didn't convert`
    ]
  };
} 