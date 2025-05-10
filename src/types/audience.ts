export interface Persona {
  name: string;
  ageRange: string;
  role: string;
  painPoints: string[];
  motivations: string[];
  psychographics: string[];
  interests: string[];
  behaviors: string[];
  targetChannels: string[];
  searchKeywords: string[];
}

export interface FunnelMapping {
  awarenessObjection: string;
  considerationObjection: string;
  decisionObjection: string;
  ctas: {
    awareness: string[];
    consideration: string[];
    decision: string[];
  }
}

export interface ChannelStrategy {
  channel: string;
  audienceSegmentation: string[];
  targetingRecommendations: string[];
  creativeApproach: string;
  budgetAllocation: string;
  kpis: string[];
  bestPractices: string[];
}

export interface AudienceBrief {
  productSummary: string;
  personas: Persona[];
  funnel: FunnelMapping[];
  channelStrategies?: Record<string, ChannelStrategy>; // Maps channel name to strategy
}

export interface AudienceResearchInput {
  url?: string;
  rawText?: string;
} 