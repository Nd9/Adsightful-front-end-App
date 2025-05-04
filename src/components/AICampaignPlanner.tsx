import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronRight, 
  faChevronLeft, 
  faInfoCircle,
  faBuilding,
  faShoppingBag,
  faUsers,
  faSearch,
  faChartLine,
  faHandPointRight,
  faCommentDots
} from '@fortawesome/free-solid-svg-icons';

// Step components
import CampaignOverview from './campaignPlanner/CampaignOverview';
import CampaignObjective from './campaignPlanner/CampaignObjective';
import PlatformSelection from './campaignPlanner/PlatformSelection';
import AudienceSelection from './campaignPlanner/AudienceSelection';
import BudgetAndGeo from './campaignPlanner/BudgetAndGeo';
import CreativeGuidance from './campaignPlanner/CreativeGuidance';
import CampaignSummary from './campaignPlanner/CampaignSummary';
import MediaPlanIO from './campaignPlanner/MediaPlanIO';
import CreativeAssetLibrary from './campaignPlanner/CreativeAssetLibrary';

// Common components
import StepIndicator, { Step } from './common/StepIndicator';
import Button from './common/Button';
import Card from './common/Card';

// Import predefined personas from AudienceSelection
import { PREDEFINED_PERSONAS } from './campaignPlanner/AudienceSelection';

// Define the steps
const STEPS: Step[] = [
  { id: 'overview', label: 'Overview', description: 'Basic campaign information' },
  { id: 'objective', label: 'Objective', description: 'Campaign goals' },
  { id: 'platform', label: 'Platform', description: 'Where to advertise' },
  { id: 'audience', label: 'Audience', description: 'Who to target' },
  { id: 'budget', label: 'Budget & Geo', description: 'Investment & regions' },
  { id: 'summary', label: 'Summary', description: 'Campaign overview' }
];

// Define campaign state interface
interface CampaignState {
  websiteUrl: string;
  industry: string;
  competitorUrls: string[];
  objective: string;
  platforms: string[];
  audiencePersona: {
    name: string;
    ageRange: [number, number];
    gender: string[];
    interests: string[];
    behaviors: string[];
  };
  budget: {
    amount: number;
    isDaily: boolean;
    duration: number;
    countries: string[];
    regions: string[];
  };
  creative: {
    formats: string[];
    message: string;
    cta: string;
    uploadedSamples: string[];
  };
  mediaPlan: {
    placements: {
      platform: string;
      format: string;
      placement: string;
      budget: number;
      impressions: number;
      cpm: number;
    }[];
    startDate: string;
    endDate: string;
    ioNumber: string;
    ioStatus: 'draft' | 'ready' | 'signed';
  };
  brandAssets?: {
    logo: string | null;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    tone: {
      voice: string;
      personality: string[];
      keywords: string[];
    };
    creativeAssets: Array<{
      id: string;
      type: 'image' | 'video';
      url: string;
      name: string;
      tags: string[];
      aiGenerated: boolean;
      dateCreated: string;
    }>;
  };
}

// Define the component props interface
interface AICampaignPlannerProps {
  pageName?: string;
}

const AICampaignPlanner: React.FC<AICampaignPlannerProps> = ({ pageName }) => {
  // Current step state
  const [currentStep, setCurrentStep] = useState(0);
  
  // Show/hide executive summary details
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(true);

  // Campaign data state
  const [campaignData, setCampaignData] = useState<CampaignState>({
    websiteUrl: '',
    industry: '',
    competitorUrls: [],
    objective: '',
    platforms: [],
    audiencePersona: {
      name: '',
      ageRange: [18, 65],
      gender: [],
      interests: [],
      behaviors: []
    },
    budget: {
      amount: 500,
      isDaily: false,
      duration: 30,
      countries: [],
      regions: []
    },
    creative: {
      formats: [],
      message: '',
      cta: '',
      uploadedSamples: []
    },
    mediaPlan: {
      placements: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ioNumber: `IO-${Math.floor(100000 + Math.random() * 900000)}`,
      ioStatus: 'draft'
    },
    brandAssets: {
      logo: null,
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f97316',
        text: '#1f2937',
        background: '#ffffff'
      },
      tone: {
        voice: 'Professional',
        personality: ['Trustworthy', 'Innovative', 'Friendly'],
        keywords: ['quality', 'solution', 'innovative', 'trusted']
      },
      creativeAssets: []
    }
  });

  // Handle next step
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when changing steps
      window.scrollTo(0, 0);
    }
  };

  // Update campaign data
  const updateCampaignData = (data: Partial<CampaignState>) => {
    setCampaignData({ ...campaignData, ...data });
  };

  // Handle step change from stepper
  const handleStepChange = (stepIndex: number) => {
    // Only allow jumping to completed steps or the next step
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
      window.scrollTo(0, 0);
    }
  };

  // Check if current step is complete
  const isCurrentStepComplete = (): boolean => {
    switch (STEPS[currentStep].id) {
      case 'overview':
        // Make website URL optional for now
        return !!campaignData.industry;
      case 'objective':
        return true; // Make objective optional
      case 'platform':
        return true; // Make platform selection optional
      case 'audience':
        return true; // Make audience selection optional
      case 'budget':
        return true; // Make budget optional
      case 'creative':
        return true; // Make creative optional
      case 'mediaplan':
        return true; // Make media plan optional
      case 'summary':
        return true;
      default:
        return true; // Default to allowing next
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'overview':
        return (
          <CampaignOverview 
            campaignData={campaignData} 
            updateCampaignData={updateCampaignData} 
          />
        );
      case 'objective':
        return (
          <CampaignObjective 
            objective={campaignData.objective} 
            updateObjective={(objective) => updateCampaignData({ objective })} 
            websiteUrl={campaignData.websiteUrl}
            industry={campaignData.industry}
            competitorUrls={campaignData.competitorUrls}
          />
        );
      case 'platform':
        return (
          <PlatformSelection 
            platforms={campaignData.platforms} 
            updatePlatforms={(platforms) => updateCampaignData({ platforms })} 
            objective={campaignData.objective}
            industry={campaignData.industry}
          />
        );
      case 'audience':
        return (
          <AudienceSelection 
            audiencePersona={campaignData.audiencePersona} 
            updateAudiencePersona={(audiencePersona) => 
              updateCampaignData({ audiencePersona })} 
            campaignData={{
              audienceType: campaignData.audiencePersona.name ? 'predefined' : 'custom',
              selectedPersonaId: PREDEFINED_PERSONAS.find(p => p.name === campaignData.audiencePersona.name)?.id,
              customAudience: {
                interests: campaignData.audiencePersona.interests,
                behaviors: campaignData.audiencePersona.behaviors
              }
            }}
            updateCampaignData={(data) => {
              // If the audience type is predefined and has a selectedPersonaId,
              // find the persona and update audiencePersona accordingly
              if (data.audienceType === 'predefined' && data.selectedPersonaId) {
                const persona = PREDEFINED_PERSONAS.find(p => p.id === data.selectedPersonaId);
                if (persona) {
                  updateCampaignData({
                    audiencePersona: {
                      ...campaignData.audiencePersona,
                      name: persona.name,
                      interests: persona.interests,
                      behaviors: persona.behaviors
                    }
                  });
                }
              } else if (data.audienceType === 'custom' && data.customAudience) {
                // Handle custom audience updates
                updateCampaignData({
                  audiencePersona: {
                    ...campaignData.audiencePersona,
                    name: 'Custom Audience',
                    interests: data.customAudience.interests,
                    behaviors: data.customAudience.behaviors
                  }
                });
              }
            }}
          />
        );
      case 'budget':
        return (
          <BudgetAndGeo 
            budget={campaignData.budget} 
            updateBudget={(budget) => updateCampaignData({ budget })} 
          />
        );
      case 'creative':
        return (
          <CreativeGuidance 
            creative={campaignData.creative}
            industry={campaignData.industry} 
            updateCreative={(creative) => updateCampaignData({ creative })} 
          />
        );
      case 'mediaplan':
        return (
          <MediaPlanIO
            mediaPlan={campaignData.mediaPlan}
            campaignData={campaignData}
            updateMediaPlan={(mediaPlan) => updateCampaignData({ mediaPlan })}
          />
        );
      case 'summary':
        return (
          <CampaignSummary campaignData={campaignData} />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Render sub-page if pageName is provided
  if (pageName) {
    // For Campaign Planner menu item, show the actual campaign planner interface
    if (pageName === "Campaign Planner") {
      return (
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8 p-8 bg-white rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Your Campaign Planning Progress</h3>
              <StepIndicator 
                steps={STEPS} 
                currentStep={currentStep} 
                onChange={handleStepChange}
                clickable={true}
              />
            </div>

            {/* Executive Summary Section - Always Visible */}
            {currentStep > 0 && (
              <div className="mb-8 bg-white rounded-lg border-2 border-blue-200 shadow-md overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 mr-2 text-blue-600" />
                    Executive Summary
                    <span className="ml-2 text-sm text-blue-600 font-normal">(AI-Generated Analysis)</span>
                  </h3>
                </div>
                <div className="p-6 bg-white">
                  <div className="prose max-w-none">
                    {showExecutiveSummary && (
                      <>
                        <h4 className="text-md font-semibold text-blue-700 mb-3">
                          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500" />
                          Company Overview
                        </h4>
                        <p className="text-sm text-gray-700 mb-5 bg-gray-50 p-3 rounded border border-gray-100">
                          {campaignData.websiteUrl && campaignData.industry ? (
                            <>
                              Based on <span className="font-semibold">{campaignData.websiteUrl}</span> in the <span className="font-semibold">{campaignData.industry}</span> industry, your company appears to be a {
                                campaignData.industry === 'E-commerce' ? 'digital marketplace selling consumer products online' :
                                campaignData.industry === 'Technology' ? 'technology solutions provider offering software and digital services' :
                                campaignData.industry === 'Healthcare' ? 'healthcare service provider focused on patient wellbeing' :
                                campaignData.industry === 'Finance' ? 'financial services organization offering wealth management and financial products' :
                                campaignData.industry === 'Education' ? 'educational institution providing learning resources and courses' :
                                'business delivering specialized solutions to its customers'
                              }.
                            </>
                          ) : (
                            <>
                              <span className="text-blue-600 font-semibold">SAMPLE DATA:</span> Based on <span className="font-semibold">example.com</span> in the <span className="font-semibold">Technology</span> industry, your company appears to be a technology solutions provider offering software and digital services.
                              <div className="mt-2 text-xs text-gray-500 italic">
                                Please enter your website URL and industry on the Overview page for a personalized company analysis.
                              </div>
                            </>
                          )}
                        </p>

                        <h4 className="text-md font-semibold text-blue-700 mb-3">
                          <FontAwesomeIcon icon={faShoppingBag} className="mr-2 text-blue-500" />
                          Products & Services
                        </h4>
                        <p className="text-sm text-gray-700 mb-5 bg-gray-50 p-3 rounded border border-gray-100">
                          {campaignData.industry ? (
                            <>
                              Your organization likely offers {
                                campaignData.industry === 'E-commerce' ? 'a range of consumer products through your online storefront, with potential subscription services and loyalty programs.' :
                                campaignData.industry === 'Technology' ? 'SaaS solutions, digital tools, and technical support services tailored to business or consumer needs.' :
                                campaignData.industry === 'Healthcare' ? 'healthcare services, patient care solutions, and possibly wellness products or preventative care programs.' :
                                campaignData.industry === 'Finance' ? 'investment products, financial planning services, loans, and banking solutions.' :
                                campaignData.industry === 'Education' ? 'courses, learning materials, certification programs, and possibly tutoring or coaching services.' :
                                'specialized products and services aligned with your industry focus.'
                              }
                            </>
                          ) : (
                            <>
                              <span className="text-blue-600 font-semibold">SAMPLE DATA:</span> Your organization likely offers SaaS solutions, digital tools, and technical support services tailored to business or consumer needs.
                              <div className="mt-2 text-xs text-gray-500 italic">
                                Enter your industry in the Overview page for personalized products and services analysis.
                              </div>
                            </>
                          )}
                        </p>

                        <h4 className="text-md font-semibold text-blue-700 mb-3">
                          <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
                          Ideal Customer Profile
                        </h4>
                        <p className="text-sm text-gray-700 mb-5 bg-gray-50 p-3 rounded border border-gray-100">
                          {campaignData.industry ? (
                            <>
                              Your target audience likely consists of {
                                campaignData.industry === 'E-commerce' ? 'online shoppers aged 25-45 who are comfortable with digital transactions and value convenience and product quality.' :
                                campaignData.industry === 'Technology' ? 'business decision-makers and IT professionals seeking efficiency improvements and technical solutions to business challenges.' :
                                campaignData.industry === 'Healthcare' ? 'patients and health-conscious individuals looking for quality care and improved health outcomes.' :
                                campaignData.industry === 'Finance' ? 'individuals and businesses seeking financial stability, growth opportunities, and expert financial guidance.' :
                                campaignData.industry === 'Education' ? 'students, professionals seeking career advancement, and lifelong learners interested in skill development.' :
                                "customers with specific needs addressed by your company's offerings."
                              }
                            </>
                          ) : (
                            <>
                              <span className="text-blue-600 font-semibold">SAMPLE DATA:</span> Your target audience likely consists of business decision-makers and IT professionals seeking efficiency improvements and technical solutions to business challenges.
                              <div className="mt-2 text-xs text-gray-500 italic">
                                Complete your business profile in the Overview page to generate a personalized ideal customer profile.
                              </div>
                            </>
                          )}
                        </p>

                        <h4 className="text-md font-semibold text-blue-700 mb-3">
                          <FontAwesomeIcon icon={faSearch} className="mr-2 text-blue-500" />
                          Competitive Landscape
                        </h4>
                        <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded border border-gray-100">
                          {campaignData.industry ? (
                            <>
                              In the {campaignData.industry} industry, your competitors are generally {
                                campaignData.industry === 'E-commerce' ? 'focusing on mobile-first shopping experiences, personalization, and rapid delivery options. Major platforms are investing heavily in AI-powered recommendations and social commerce integration.' :
                                campaignData.industry === 'Technology' ? 'emphasizing cloud solutions, AI capabilities, and seamless integration. Ad campaigns highlight cost savings, efficiency gains, and competitive advantages through digital transformation.' :
                                campaignData.industry === 'Healthcare' ? 'advertising patient outcomes, accessibility, and specialized expertise. Digital marketing in this space centers on trust, expertise, and patient testimonials.' :
                                campaignData.industry === 'Finance' ? 'marketing security, growth potential, and personalized service. Industry leaders are increasingly utilizing targeted digital campaigns with educational content and financial tools.' :
                                campaignData.industry === 'Education' ? 'promoting career outcomes, flexibility, and unique learning methodologies. Online programs are heavily marketed through performance channels with emphasis on ROI and accessibility.' :
                                'utilizing both brand and performance marketing tactics appropriate to your specific market segment.'
                              }
                            </>
                          ) : (
                            <>
                              <span className="text-blue-600 font-semibold">SAMPLE DATA:</span> In the Technology industry, your competitors are generally emphasizing cloud solutions, AI capabilities, and seamless integration. Ad campaigns highlight cost savings, efficiency gains, and competitive advantages through digital transformation.
                              <div className="mt-2 text-xs text-gray-500 italic">
                                Add your industry and competitors in the Overview page for a personalized competitive analysis.
                              </div>
                            </>
                          )}
                        </div>
                        
                        {campaignData.competitorUrls && campaignData.competitorUrls.length > 0 && (
                          <div className="mt-3 bg-gray-50 p-3 rounded border border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Your identified competitors:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                              {campaignData.competitorUrls.map((url, index) => (
                                <li key={index}>
                                  <span className="font-medium text-blue-600">{url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0]}</span> 
                                  <span className="text-gray-700"> - {
                                    index % 3 === 0 ? 'Focuses on performance marketing with strong retargeting campaigns.' :
                                    index % 3 === 1 ? 'Investing in brand awareness with high-quality content and social media presence.' :
                                    'Balancing acquisition and retention strategies with loyalty programs.'
                                  }</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-2 mb-1">
                    <button 
                      onClick={() => setShowExecutiveSummary(prev => !prev)} 
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {showExecutiveSummary ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Step Content */}
            <Card className="mb-6">
              <div className="py-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {STEPS[currentStep].label}
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  {STEPS[currentStep].description}
                </p>
                
                {/* Step content */}
                {renderStep()}
              </div>
            </Card>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline"
                leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <Button 
                variant={currentStep === STEPS.length - 1 ? 'secondary' : 'primary'}
                rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
                onClick={handleNext}
                disabled={currentStep === STEPS.length - 1 || !isCurrentStepComplete()}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-8 rounded-lg shadow-lg border-0 text-base"
              >
                {currentStep === STEPS.length - 1 ? 'Finish' : 'Continue to Next Step'}
              </Button>
            </div>
          </div>
        </main>
      );
    }
    
    // For Creative Assets Library, show the dedicated component
    if (pageName === "Creative Assets Library") {
      // Create a default brandAssets if it doesn't exist
      const defaultBrandAssets = {
        logo: null,
        colors: {
          primary: '#3b82f6',
          secondary: '#10b981',
          accent: '#f97316',
          text: '#1f2937',
          background: '#ffffff'
        },
        tone: {
          voice: 'Professional',
          personality: ['Trustworthy', 'Innovative', 'Friendly'],
          keywords: ['quality', 'solution', 'innovative', 'trusted']
        },
        creativeAssets: []
      };
      
      return (
        <div className="container mx-auto py-8">
          <CreativeAssetLibrary 
            brandAssets={campaignData.brandAssets || defaultBrandAssets} 
            updateBrandAssets={(brandAssets) => updateCampaignData({ brandAssets })}
          />
        </div>
      );
    }
    
    // For other submenu items, show the placeholder
    return (
      <div className="container mx-auto py-8">
        <Card>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{pageName}</h1>
            <p className="text-gray-600">
              This is the {pageName} section of the AI Campaign Planner. 
              This feature is under development and will be available soon.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8 p-8 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Your Campaign Planning Progress</h3>
          <StepIndicator 
            steps={STEPS} 
            currentStep={currentStep} 
            onChange={handleStepChange}
            clickable={true}
          />
        </div>

        {/* Current Step Content */}
        <Card className="mb-6">
          <div className="py-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {STEPS[currentStep].label}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {STEPS[currentStep].description}
            </p>
            
            {/* Step content */}
            {renderStep()}
          </div>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline"
            leftIcon={<FontAwesomeIcon icon={faChevronLeft} />}
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button 
            variant={currentStep === STEPS.length - 1 ? 'secondary' : 'primary'}
            rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
            onClick={handleNext}
            disabled={currentStep === STEPS.length - 1 || !isCurrentStepComplete()}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-8 rounded-lg shadow-lg border-0 text-base"
          >
            {currentStep === STEPS.length - 1 ? 'Finish' : 'Continue to Next Step'}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AICampaignPlanner; 