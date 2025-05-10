import axios from 'axios';
import { AudienceBrief, AudienceResearchInput } from '../../types/audience';

// Define environment variable for API key
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/**
 * Scrapes content from a given URL using a serverless function
 * Note: In a production environment, you would implement this using a serverless function
 * that uses puppeteer or similar to scrape the website content.
 */
async function scrapeWebsite(url: string): Promise<string> {
  try {
    // For a real implementation, you would call your serverless function here
    // For MVP, we'll use a simple fetch to get HTML content
    // Note: This will likely be blocked by CORS in a browser environment
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (data && data.contents) {
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Extract relevant text content
      const h1Elements = Array.from(doc.querySelectorAll('h1')).map(el => el.textContent);
      const h2Elements = Array.from(doc.querySelectorAll('h2')).map(el => el.textContent);
      const pElements = Array.from(doc.querySelectorAll('p')).map(el => el.textContent);
      const liElements = Array.from(doc.querySelectorAll('li')).map(el => el.textContent);
      
      // Combine all text content into a single string
      return [
        `URL: ${url}`,
        `Title: ${doc.title}`,
        `H1: ${h1Elements.join(' | ')}`,
        `H2: ${h2Elements.join(' | ')}`,
        `Paragraphs: ${pElements.join(' ')}`,
        `List Items: ${liElements.join(' | ')}`
      ].join('\n\n');
    }
    
    throw new Error('Failed to scrape website content');
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website content');
  }
}

/**
 * Runs audience research using OpenAI API
 */
export async function runAudienceResearch({ url, rawText }: AudienceResearchInput): Promise<AudienceBrief> {
  try {
    let contentToAnalyze = '';
    
    // If URL is provided, scrape the content
    if (url) {
      try {
        contentToAnalyze = await scrapeWebsite(url);
      } catch (error) {
        console.error('Error scraping website:', error);
        throw new Error('Failed to scrape website content. Please provide raw text instead.');
      }
    } else if (rawText) {
      // Use the provided raw text
      contentToAnalyze = rawText;
    } else {
      throw new Error('Either URL or raw text must be provided');
    }
    
    // Call OpenAI API with function calling
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert marketing and audience research assistant. Given a landing page or product description text, analyze it to identify the core product/service offering, the target audience, and map out compelling buyer personas with detailed psychographics, channel preferences, and search behavior patterns.`
          },
          {
            role: 'user',
            content: contentToAnalyze
          }
        ],
        functions: [
          {
            name: 'generateAudienceBrief',
            description: 'Generate a comprehensive audience brief with buyer personas and funnel mapping',
            parameters: {
              type: 'object',
              properties: {
                productSummary: {
                  type: 'string',
                  description: 'A concise 2-3 sentence summary of what the product/service does and its core value proposition'
                },
                personas: {
                  type: 'array',
                  description: 'Three distinct buyer personas who would be interested in this product/service',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'A descriptive name for this persona (e.g., "Time-strapped Marketing Director")'
                      },
                      ageRange: {
                        type: 'string', 
                        description: 'The typical age range for this persona (e.g., "30-45")'
                      },
                      role: {
                        type: 'string',
                        description: 'The job title or life role of this persona'
                      },
                      painPoints: {
                        type: 'array',
                        description: 'The key pain points this persona experiences that the product can solve',
                        items: { type: 'string' }
                      },
                      motivations: {
                        type: 'array',
                        description: 'What motivates this persona to seek solutions',
                        items: { type: 'string' }
                      },
                      psychographics: {
                        type: 'array',
                        description: 'Psychological characteristics, attitudes, values, lifestyle traits, and social aspirations',
                        items: { type: 'string' }
                      },
                      interests: {
                        type: 'array',
                        description: 'Specific topics, hobbies, or activities this persona is interested in',
                        items: { type: 'string' }
                      },
                      behaviors: {
                        type: 'array',
                        description: 'Behavioral patterns, purchasing habits, and digital behavior traits',
                        items: { type: 'string' }
                      },
                      targetChannels: {
                        type: 'array',
                        description: 'Online advertising platforms and digital channels best suited to reach this persona (e.g., Google Ads, Facebook Ads, LinkedIn Ads, Instagram Ads, TikTok Ads, Programmatic Display, Native Advertising, YouTube Ads)',
                        items: { type: 'string' }
                      },
                      searchKeywords: {
                        type: 'array',
                        description: 'Keywords and phrases this persona likely uses when searching online',
                        items: { type: 'string' }
                      }
                    },
                    required: ['name', 'ageRange', 'role', 'painPoints', 'motivations', 'psychographics', 'interests', 'behaviors', 'targetChannels', 'searchKeywords']
                  }
                },
                funnel: {
                  type: 'array',
                  description: 'Maps each persona through the marketing funnel stages',
                  items: {
                    type: 'object',
                    properties: {
                      awarenessObjection: {
                        type: 'string',
                        description: 'The primary objection or question at the Awareness stage'
                      },
                      considerationObjection: {
                        type: 'string', 
                        description: 'The primary objection or question at the Consideration stage'
                      },
                      decisionObjection: {
                        type: 'string',
                        description: 'The primary objection or question at the Decision stage'
                      },
                      ctas: {
                        type: 'object',
                        properties: {
                          awareness: {
                            type: 'array',
                            description: 'Compelling CTAs for the Awareness stage',
                            items: { type: 'string' }
                          },
                          consideration: {
                            type: 'array',
                            description: 'Compelling CTAs for the Consideration stage',
                            items: { type: 'string' }
                          },
                          decision: {
                            type: 'array',
                            description: 'Compelling CTAs for the Decision stage',
                            items: { type: 'string' }
                          }
                        },
                        required: ['awareness', 'consideration', 'decision']
                      }
                    },
                    required: ['awarenessObjection', 'considerationObjection', 'decisionObjection', 'ctas']
                  }
                }
              },
              required: ['productSummary', 'personas', 'funnel']
            }
          }
        ],
        function_call: { name: 'generateAudienceBrief' },
        temperature: 0.7,
        max_tokens: 4000
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
    
    if (!functionCall || functionCall.name !== 'generateAudienceBrief') {
      throw new Error('Failed to generate audience brief');
    }
    
    // Parse the JSON arguments
    const audienceBrief: AudienceBrief = JSON.parse(functionCall.arguments);
    
    // Validate the response
    if (!audienceBrief.productSummary || !audienceBrief.personas || !audienceBrief.funnel || 
        audienceBrief.personas.length === 0 || audienceBrief.funnel.length === 0) {
      throw new Error('Invalid audience brief generated');
    }
    
    return audienceBrief;
  } catch (error) {
    console.error('Error generating audience brief:', error);
    throw new Error('Failed to generate audience brief');
  }
} 