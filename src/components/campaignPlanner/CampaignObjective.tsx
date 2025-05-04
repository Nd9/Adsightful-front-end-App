import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faShoppingCart, 
  faBullhorn,
  faInfoCircle,
  faSpinner,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import useOpenAI from '../../services/openai/useOpenAI';

interface CampaignObjectiveProps {
  objective: string;
  updateObjective: (objective: string) => void;
  websiteUrl?: string;
  industry?: string;
  competitorUrls?: string[];
}

// Define objectives with descriptions
const OBJECTIVES = [
  {
    id: 'engagement',
    title: 'Engagement',
    icon: faChartLine,
    description: 'Increase interactions with your content, such as likes, comments, shares, and clicks.',
    examples: 'Social media engagement, website clicks, video views',
    color: 'blue'
  },
  {
    id: 'conversion',
    title: 'Conversions',
    icon: faShoppingCart,
    description: 'Drive valuable actions on your website or app, such as purchases, sign-ups, or leads.',
    examples: 'Online sales, form submissions, app installs',
    color: 'green'
  },
  {
    id: 'awareness',
    title: 'Brand Awareness',
    icon: faBullhorn,
    description: 'Increase visibility and recognition of your brand among potential customers.',
    examples: 'Reach, impressions, brand recall, brand lift',
    color: 'purple'
  }
];

// Map of industry to recommended objective
const INDUSTRY_OBJECTIVE_MAP: Record<string, string> = {
  'E-commerce': 'conversion',
  'Technology': 'conversion',
  'Healthcare': 'awareness',
  'Finance': 'conversion',
  'Education': 'engagement',
  'Travel': 'awareness',
  'Food & Beverage': 'engagement',
  'Real Estate': 'conversion',
  'Manufacturing': 'awareness',
  'Media & Entertainment': 'engagement',
  'Automotive': 'conversion',
  'Fashion & Apparel': 'awareness',
  'Beauty & Cosmetics': 'engagement',
  'Home & Garden': 'conversion',
  'Sports & Fitness': 'engagement',
  'Professional Services': 'conversion',
  'Non-Profit': 'awareness',
  'Arts & Crafts': 'engagement',
  'Agriculture': 'awareness'
};

const CampaignObjective: React.FC<CampaignObjectiveProps> = ({ 
  objective, 
  updateObjective,
  websiteUrl,
  industry,
  competitorUrls = []
}) => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [loadingRecommendation, setLoadingRecommendation] = useState<boolean>(false);
  const [recommendedObjective, setRecommendedObjective] = useState<string>('');
  const [customRecommendation, setCustomRecommendation] = useState<string>('');
  
  // Get the OpenAI hook
  const { loading, error, analyzeCampaign } = useOpenAI();
  
  // Generate recommendation based on website and industry
  useEffect(() => {
    if (industry && !objective && !loadingRecommendation) {
      generateRecommendation();
    }
  }, [industry, websiteUrl]);
  
  // Generate an objective recommendation
  const generateRecommendation = async () => {
    setLoadingRecommendation(true);
    
    try {
      // In a production environment, this would call the OpenAI API
      // For now, we'll use a simple mapping based on industry
      
      if (industry) {
        // Get objective recommendation based on industry
        const recommendedObj = INDUSTRY_OBJECTIVE_MAP[industry] || 'awareness';
        setRecommendedObjective(recommendedObj);
        
        // Generate custom recommendation text
        let customRec = '';
        
        switch (recommendedObj) {
          case 'engagement':
            customRec = `For ${industry} businesses, engagement campaigns typically yield 32% higher ROI than awareness campaigns. Focus on building relationships with your audience through interactive content.`;
            break;
          case 'conversion':
            customRec = `${industry} businesses see the best results with conversion-focused campaigns. We recommend starting with bottom-funnel tactics to capitalize on existing demand.`;
            break;
          case 'awareness':
            customRec = `In the ${industry} industry, building brand awareness is critical for long-term success. Focus on reaching new audiences and communicating your unique value proposition.`;
            break;
          default:
            customRec = `Based on your industry, we've recommended the best objective for your campaign.`;
        }
        
        setCustomRecommendation(customRec);
        
        // In a real implementation, we would use the OpenAI API here
        // You could implement it like this:
        /*
        if (websiteUrl && industry) {
          const result = await analyzeCampaign({
            websiteUrl,
            industry,
          });
          
          if (result && result.recommendedObjective) {
            setRecommendedObjective(result.recommendedObjective);
            setCustomRecommendation(result.objectiveRationale || '');
          }
        }
        */
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
    } finally {
      setLoadingRecommendation(false);
    }
  };
  
  // Apply the recommended objective
  const applyRecommendedObjective = () => {
    if (recommendedObjective) {
      updateObjective(recommendedObjective);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">What's your campaign objective?</h2>
        <p className="text-gray-600 mt-2">
          Choose the primary goal you want to achieve with this campaign
        </p>
      </div>

      {/* AI Recommendation */}
      {(recommendedObjective && !objective) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">AI Recommendation</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>Based on your {industry} industry, we recommend a <strong>{OBJECTIVES.find(obj => obj.id === recommendedObjective)?.title || 'Recommended'}</strong> objective.</p>
                <p className="mt-1">{customRecommendation}</p>
                <button
                  onClick={applyRecommendedObjective}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                >
                  Use this recommendation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OBJECTIVES.map((obj) => (
          <div
            key={obj.id}
            onClick={() => updateObjective(obj.id)}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              objective === obj.id
                ? `border-${obj.color}-500 bg-${obj.color}-50 shadow-md`
                : obj.id === recommendedObjective && !objective
                ? `border-${obj.color}-300 bg-${obj.color}-50 shadow-sm`
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  objective === obj.id
                    ? `bg-${obj.color}-100 text-${obj.color}-600`
                    : obj.id === recommendedObjective && !objective
                    ? `bg-${obj.color}-100 text-${obj.color}-500`
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={obj.icon} className="h-8 w-8" />
              </div>
              <h3 className={`text-lg font-medium ${
                objective === obj.id 
                  ? `text-${obj.color}-700` 
                  : obj.id === recommendedObjective && !objective
                  ? `text-${obj.color}-600`
                  : 'text-gray-900'
              }`}>
                {obj.title}
                {obj.id === recommendedObjective && !objective && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Recommended
                  </span>
                )}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{obj.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                <span className="font-medium">Examples:</span> {obj.examples}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Box */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">Campaign Strategy Insights</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                {loadingRecommendation && (
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Analyzing your business to generate recommendations...
                  </span>
                )}
                {!loadingRecommendation && !objective && !recommendedObjective && (
                  "Select an objective to see AI-powered campaign recommendations."
                )}
                {objective === 'engagement' && (
                  <>
                    Engagement campaigns work best when you have compelling content and want to build a relationship with your audience. Great for growing brand loyalty and community.
                    {industry && (
                      <span className="block mt-2">
                        In the {industry} industry, engagement campaigns typically focus on {
                          industry === 'E-commerce' 
                            ? 'product demonstrations and user-generated content' 
                            : (industry === 'Technology' 
                                ? 'educational content and thought leadership' 
                                : 'community building and brand storytelling')
                        }.
                      </span>
                    )}
                  </>
                )}
                {objective === 'conversion' && (
                  <>
                    Conversion campaigns are ideal when you have a clear call-to-action and want to generate leads or sales. Best for businesses with established products or services.
                    {industry && (
                      <span className="block mt-2">
                        For {industry} businesses, conversion campaigns typically prioritize {
                          industry === 'E-commerce' 
                            ? 'product catalog ads and retargeting' 
                            : (industry === 'Finance' 
                                ? 'lead forms and service comparison tools' 
                                : 'direct response ads with strong offers')
                        }.
                      </span>
                    )}
                  </>
                )}
                {objective === 'awareness' && (
                  <>
                    Brand awareness campaigns help you reach new audiences who aren't familiar with your brand yet. Recommended for new businesses or product launches.
                    {industry && (
                      <span className="block mt-2">
                        In the {industry} space, successful awareness campaigns often utilize {
                          industry === 'Fashion & Apparel' 
                            ? 'influencer partnerships and visual storytelling' 
                            : (industry === 'Healthcare' 
                                ? 'educational content and testimonials' 
                                : 'broad reach formats and memorable creative')
                        }.
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignObjective; 