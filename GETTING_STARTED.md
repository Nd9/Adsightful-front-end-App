# Getting Started with AI Campaign Planner

This guide will help you get started with the AI Campaign Planner implementation in this project.

## What We've Implemented

We've set up the foundation for an AI-powered campaign planning system:

1. **OpenAI Service Layer**:
   - Core API service with TypeScript interfaces
   - React hook for component integration
   - Website analyzer utility

2. **AI-Powered Components**:
   - Website analysis in Campaign Overview
   - Industry-specific objective recommendations
   - Intelligent platform selection with rationales
   - Optimized media plan generation

## How to Use It

### 1. Set Up Your API Key

Before using the AI features with real OpenAI integration:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file and add your OpenAI API key
nano .env
```

### 2. Activate the Real API Calls

The current implementation includes commented code that shows where to make real OpenAI API calls. To activate them:

1. Open the following files:
   - `src/components/campaignPlanner/CampaignOverview.tsx`
   - `src/components/campaignPlanner/CampaignObjective.tsx`
   - `src/components/campaignPlanner/PlatformSelection.tsx`
   - `src/components/campaignPlanner/MediaPlanIO.tsx`

2. Look for commented code blocks marked with: 
   ```typescript
   // In a real implementation, we would use the OpenAI API here
   /*
     ... code to uncomment ...
   */
   ```

3. Uncomment these blocks to enable real API calls

### 3. Using the AI Features

Test the implementation by:

1. Entering a website URL and clicking "Analyze Site"
2. Observing the industry recommendations
3. Seeing objective recommendations based on your industry
4. Getting platform recommendations based on your objective
5. Generating an AI-powered media plan

## Next Steps

To enhance the implementation:

1. **Improve the prompts**:
   - Edit the prompt templates in `src/services/openai/index.ts`
   - Make them more specific to your business needs

2. **Add more AI touchpoints**:
   - Enhance the creative guidance with AI recommendations
   - Add AI-powered audience persona generation
   - Implement budget optimization suggestions

3. **Backend Integration**:
   - Move API calls to a backend service for security
   - Implement caching for similar requests
   - Add user authentication and rate limiting

## Troubleshooting

If you encounter issues:

- **API Key Problems**: Ensure your key is correctly formatted in .env
- **Parsing Errors**: Check the AI response format in the console
- **Performance Issues**: Consider implementing request batching or caching

## Documentation

For more details, see:

- `AI_CAMPAIGN_PLANNER.md` - Full implementation details
- OpenAI API documentation: https://platform.openai.com/docs/api-reference 