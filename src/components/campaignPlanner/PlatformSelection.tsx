import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faCheck,
  faLightbulb,
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faGoogle, 
  faFacebook, 
  faLinkedin, 
  faTiktok, 
  faReddit, 
  faMicrosoft
} from '@fortawesome/free-brands-svg-icons';
import useOpenAI from '../../services/openai/useOpenAI';

interface PlatformSelectionProps {
  platforms: string[];
  updatePlatforms: (platforms: string[]) => void;
  objective?: string;
  industry?: string;
}

// Define platforms with details
const PLATFORMS = [
  {
    id: 'google',
    name: 'Google Ads',
    icon: faGoogle,
    description: 'Search, Display, YouTube, Shopping',
    strengths: 'High intent, diverse formats, precise targeting',
    color: 'red'
  },
  {
    id: 'meta',
    name: 'Meta (Facebook/Instagram)',
    icon: faFacebook,
    description: 'Feed, Stories, Reels, Messenger',
    strengths: 'Large audience, visual formats, detailed targeting',
    color: 'blue'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: faLinkedin,
    description: 'Feed, InMail, Text Ads',
    strengths: 'B2B targeting, professional audience, job titles',
    color: 'indigo'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: faTiktok,
    description: 'In-Feed, TopView, Branded Effects',
    strengths: 'Young audience, creative formats, trending content',
    color: 'black'
  },
  {
    id: 'microsoft',
    name: 'Microsoft Ads',
    icon: faMicrosoft,
    description: 'Search, Display, Native, LinkedIn',
    strengths: 'Professional audience, Bing network, less competition',
    color: 'cyan'
  },
  {
    id: 'reddit',
    name: 'Reddit Ads',
    icon: faReddit,
    description: 'Feed, Conversation, Display',
    strengths: 'Niche communities, engaged users, topic targeting',
    color: 'orange'
  }
];

// Recommended platform mixes by industry and objective
const RECOMMENDED_PLATFORMS: Record<string, Record<string, string[]>> = {
  'E-commerce': {
    'awareness': ['meta', 'tiktok', 'google'],
    'engagement': ['meta', 'tiktok', 'reddit'],
    'conversion': ['google', 'meta', 'microsoft']
  },
  'Technology': {
    'awareness': ['linkedin', 'google', 'meta'],
    'engagement': ['linkedin', 'reddit', 'meta'],
    'conversion': ['google', 'linkedin', 'microsoft']
  },
  'Healthcare': {
    'awareness': ['meta', 'google', 'microsoft'],
    'engagement': ['meta', 'linkedin', 'reddit'],
    'conversion': ['google', 'microsoft', 'linkedin']
  },
  'Finance': {
    'awareness': ['linkedin', 'google', 'meta'],
    'engagement': ['linkedin', 'meta', 'reddit'],
    'conversion': ['google', 'linkedin', 'microsoft']
  },
  'default': {
    'awareness': ['meta', 'google', 'tiktok'],
    'engagement': ['meta', 'reddit', 'tiktok'],
    'conversion': ['google', 'meta', 'microsoft']
  }
};

// Platform mix rationales by objective
const PLATFORM_RATIONALES: Record<string, Record<string, string>> = {
  'awareness': {
    'google': 'Use Google Display Network for broad reach and YouTube for impactful video content',
    'meta': 'Leverage Facebook and Instagram for wide audience coverage and visual storytelling',
    'tiktok': 'Reach younger demographics with viral, creative content',
    'linkedin': 'Target professional audiences and decision-makers',
    'reddit': 'Engage with niche interest communities'
  },
  'engagement': {
    'meta': 'Facebook and Instagram offer multiple engagement options from reactions to comments',
    'tiktok': 'Drive high engagement rates with interactive content formats',
    'reddit': 'Benefit from highly engaged communities with strong discussion culture',
    'linkedin': 'Engage professional audiences with thought leadership content'
  },
  'conversion': {
    'google': 'Target high-intent searches with immediate purchase or signup intent',
    'meta': 'Utilize retargeting capabilities and conversion-optimized campaigns',
    'microsoft': 'Reach professional audiences with lower CPC than Google',
    'linkedin': 'Generate high-quality B2B leads with precise targeting'
  },
  'default': {
    'google': 'Versatile platform with multiple ad formats and targeting options',
    'meta': 'Large audience reach with strong targeting capabilities',
    'linkedin': 'Best for B2B and professional targeting',
    'tiktok': 'Great for reaching younger demographics',
    'reddit': 'Engage with interest-based communities',
    'microsoft': 'Alternative to Google with professional audience reach'
  }
};

const PlatformSelection: React.FC<PlatformSelectionProps> = ({ 
  platforms, 
  updatePlatforms,
  objective,
  industry
}) => {
  const [recommendedPlatforms, setRecommendedPlatforms] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [platformRationales, setPlatformRationales] = useState<Record<string, string>>({});
  const [showRecommendationBanner, setShowRecommendationBanner] = useState<boolean>(false);
  
  // Get the OpenAI hook
  const { loading, error, analyzeCampaign } = useOpenAI();
  
  // Generate platform recommendations based on industry and objective
  useEffect(() => {
    if (industry && objective && !loadingRecommendations && platforms.length === 0) {
      generatePlatformRecommendations();
    }
  }, [industry, objective]);
  
  // Toggle platform selection
  const togglePlatform = (platformId: string) => {
    if (platforms.includes(platformId)) {
      updatePlatforms(platforms.filter(id => id !== platformId));
    } else {
      updatePlatforms([...platforms, platformId]);
    }
  };
  
  // Generate platform recommendations
  const generatePlatformRecommendations = async () => {
    setLoadingRecommendations(true);
    
    try {
      // In a production environment, this would call the OpenAI API
      // For now, use predefined recommendations based on industry and objective
      
      // Get recommended platforms based on industry and objective
      const industryRecs = RECOMMENDED_PLATFORMS[industry || ''] || RECOMMENDED_PLATFORMS['default'];
      const recommendedPlatformsList = industryRecs[objective || ''] || industryRecs['awareness'] || [];
      
      // Get rationales for the recommended platforms
      const objectiveRationales = PLATFORM_RATIONALES[objective || ''] || PLATFORM_RATIONALES['default'];
      const rationales: Record<string, string> = {};
      
      recommendedPlatformsList.forEach(platform => {
        rationales[platform] = objectiveRationales[platform] || PLATFORM_RATIONALES['default'][platform] || '';
      });
      
      // Set state with recommendations
      setRecommendedPlatforms(recommendedPlatformsList);
      setPlatformRationales(rationales);
      setShowRecommendationBanner(true);
      
      // In a real implementation, we would use the OpenAI API
      /*
      if (industry && objective) {
        const result = await analyzeCampaign({
          industry,
          objective,
        });
        
        if (result && result.recommendedPlatforms) {
          setRecommendedPlatforms(result.recommendedPlatforms);
          setPlatformRationales(result.platformRationales || {});
        }
      }
      */
      
    } catch (error) {
      console.error('Error generating platform recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };
  
  // Apply all recommended platforms
  const applyRecommendedPlatforms = () => {
    if (recommendedPlatforms.length > 0) {
      updatePlatforms(recommendedPlatforms);
      setShowRecommendationBanner(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Select Advertising Platforms</h2>
        <p className="text-gray-600 mt-2">
          Choose the platforms where you want to run your campaign
        </p>
      </div>
      
      {/* AI Recommendation Banner */}
      {showRecommendationBanner && recommendedPlatforms.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">AI Platform Recommendation</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Based on your {industry} industry and {objective} objective, we recommend the following platform mix:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recommendedPlatforms.map(platformId => {
                    const platform = PLATFORMS.find(p => p.id === platformId);
                    return platform ? (
                      <span 
                        key={platformId} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <FontAwesomeIcon icon={platform.icon} className="mr-1 h-3 w-3" />
                        {platform.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <button
                  onClick={applyRecommendedPlatforms}
                  className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                >
                  Apply recommended platforms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              platforms.includes(platform.id)
                ? `border-${platform.color}-500 bg-${platform.color}-50`
                : recommendedPlatforms.includes(platform.id)
                ? `border-${platform.color}-300 bg-${platform.color}-50/30`
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
                platforms.includes(platform.id)
                  ? `bg-${platform.color}-100 text-${platform.color}-600`
                  : recommendedPlatforms.includes(platform.id)
                  ? `bg-${platform.color}-100/60 text-${platform.color}-500`
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <FontAwesomeIcon icon={platform.icon} className="h-6 w-6" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {platform.name}
                    {recommendedPlatforms.includes(platform.id) && !platforms.includes(platform.id) && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Recommended
                      </span>
                    )}
                  </h3>
                  {platforms.includes(platform.id) && (
                    <FontAwesomeIcon icon={faCheck} className={`h-5 w-5 text-${platform.color}-500`} />
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">{platform.description}</p>
                <p className="mt-2 text-xs text-gray-400">
                  <span className="font-medium">Strengths:</span> {platform.strengths}
                </p>
                {/* Show rationale if this is a recommended platform */}
                {recommendedPlatforms.includes(platform.id) && platformRationales[platform.id] && (
                  <p className="mt-2 text-xs text-blue-600 italic">
                    {platformRationales[platform.id]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendation Box */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">Platform Strategy</h3>
            <div className="mt-2 text-sm text-gray-500">
              {loadingRecommendations ? (
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  <span>Analyzing optimal platform mix...</span>
                </div>
              ) : platforms.length === 0 ? (
                <p>Select platforms to see AI recommendations for your campaign mix.</p>
              ) : (
                <div>
                  <p className="mb-2">Based on your selections, here's how to approach your campaign:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {platforms.includes('google') && (
                      <li>{objective === 'conversion' 
                          ? 'Prioritize Google Search campaigns for high-intent users ready to convert' 
                          : objective === 'awareness' 
                          ? 'Use Google Display Network and YouTube for broad reach and brand visibility'
                          : 'Utilize Google Ads for high-intent, search-based acquisition'}
                      </li>
                    )}
                    {platforms.includes('meta') && (
                      <li>{objective === 'engagement' 
                          ? 'Focus on Facebook and Instagram interactive formats to maximize audience engagement' 
                          : objective === 'conversion' 
                          ? "Implement Meta's conversion optimization with strong calls-to-action"
                          : "Leverage Meta's visual formats for creative storytelling and brand building"}
                      </li>
                    )}
                    {platforms.includes('linkedin') && (
                      <li>{objective === 'conversion' && industry === 'Technology' 
                          ? 'Prioritize LinkedIn for B2B lead generation with Lead Gen Forms' 
                          : objective === 'awareness' && industry === 'Finance'
                          ? 'Build authority in the financial sector through LinkedIn thought leadership'
                          : 'Target professional demographics through LinkedIn for industry-specific messaging'}
                      </li>
                    )}
                    {platforms.includes('tiktok') && (
                      <li>{objective === 'engagement' 
                          ? 'Create interactive TikTok campaigns that encourage user participation' 
                          : objective === 'awareness' 
                          ? 'Develop trending TikTok content to quickly increase brand visibility'
                          : "Create engaging video content for TikTok's younger audience"}
                      </li>
                    )}
                    {platforms.includes('microsoft') && (
                      <li>{objective === 'conversion' 
                          ? 'Target Microsoft Ads users with typically higher-than-average purchasing power' 
                          : 'Complement Google with Microsoft Ads to extend search reach and reduce CPCs'}
                      </li>
                    )}
                    {platforms.includes('reddit') && (
                      <li>{objective === 'engagement'
                          ? 'Create Reddit-specific content that encourages discussion and community interaction' 
                          : industry === 'Technology'
                          ? 'Target tech-savvy Reddit communities with specialized messaging'
                          : "Engage with niche communities through Reddit's topic targeting"}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelection; 