# AI Campaign Planner - Implementation Guide

This document explains how the AI-powered campaign planner is implemented in the application, how it works, and how you can extend it with real OpenAI API integration.

## Overview

The AI Campaign Planner uses OpenAI's language models to provide intelligent recommendations for digital marketing campaigns. The system is designed to:

1. Analyze website URLs and industry information
2. Recommend campaign objectives based on business type
3. Suggest optimal platform mix for each campaign
4. Generate customized media plans with budget allocation
5. Provide creative guidance and recommendations

## Implementation Structure

The AI functionality is implemented with these key components:

- **`src/services/openai/`**: Core services for OpenAI API integration
  - **`index.ts`**: Main service for API communication
  - **`useOpenAI.ts`**: React hook for easy component integration
  - **`websiteAnalyzer.ts`**: Helper for website analysis

- **Components with AI integration**:
  - **`CampaignOverview.tsx`**: Website analysis and industry detection
  - **`CampaignObjective.tsx`**: Objective recommendations
  - **`PlatformSelection.tsx`**: Platform mix recommendations
  - **`MediaPlanIO.tsx`**: AI-powered media plan generation
  - **`CreativeGuidance.tsx`**: Creative recommendations

## OpenAI Integration

The current implementation includes all the structure needed for OpenAI integration but uses simulated data to avoid requiring an API key. To enable real OpenAI integration:

1. Copy `.env.example` to `.env` and add your OpenAI API key
2. Uncomment the actual API calls in the components (look for code blocks marked with `// In a real implementation...`)
3. Adjust the prompt templates in `src/services/openai/index.ts` as needed

## Using the AI Features

Each step of the campaign planner includes AI-powered features:

### 1. Campaign Overview
- Enter your website URL and click "Analyze Site" to get industry recommendations
- AI will suggest the most likely industry based on URL analysis

### 2. Campaign Objective
- AI recommends the best objective based on your industry
- Each objective includes industry-specific insights

### 3. Platform Selection
- AI suggests the optimal platform mix for your objective and industry
- Each platform includes rationales for why it's recommended

### 4. Media Plan
- Generate an AI-powered media plan with "Generate AI Media Plan"
- The plan includes intelligent budget allocation across platforms
- AI provides optimization insights for your media plan

## Extending the Implementation

You can enhance the AI capabilities by:

1. **Improving prompts**: Edit the prompt templates in `openAIService` for better results
2. **Adding more context**: Include more business data in the AI requests
3. **Implementing feedback loops**: Track which recommendations users accept/reject
4. **Adding industry-specific modules**: Create specialized recommendation engines for different industries

## Technical Details

The AI integration uses:

- React hooks pattern for state management
- Async/await for API communication
- TypeScript interfaces for type safety
- Singleton pattern for the OpenAI service

## Authentication & Security

In production, you should:

1. **Never expose your API key**: Move API calls to a backend service
2. **Rate limit requests**: Implement throttling to manage API costs
3. **Cache responses**: Store results for similar queries
4. **Add user authentication**: Restrict API access to authorized users

## Troubleshooting

Common issues:

- **API key not working**: Ensure your API key is correctly set in `.env` and the app is restarted
- **Rate limiting**: If you hit OpenAI's rate limits, implement exponential backoff
- **Response parsing errors**: Check the response format in the OpenAI dashboard

## Resource Usage

The implementation is designed to be cost-effective:

- Batches related requests where possible
- Uses the most appropriate models for each task
- Includes fallbacks if API calls fail 