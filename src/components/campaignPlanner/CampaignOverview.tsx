import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlus, faTimes, faGlobe, faIndustry, faSpinner } from '@fortawesome/free-solid-svg-icons';
import InputField from '../common/InputField';
import Button from '../common/Button';
import useOpenAI from '../../services/openai/useOpenAI';
import { WebsiteAnalyzer } from '../../services/openai/websiteAnalyzer';

interface CampaignOverviewProps {
  campaignData: {
    websiteUrl: string;
    industry: string;
    competitorUrls: string[];
  };
  updateCampaignData: (data: any) => void;
}

// List of common industries
const INDUSTRIES = [
  "E-commerce",
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Travel",
  "Food & Beverage",
  "Real Estate",
  "Manufacturing",
  "Media & Entertainment",
  "Automotive",
  "Fashion & Apparel",
  "Beauty & Cosmetics",
  "Home & Garden",
  "Sports & Fitness",
  "Professional Services",
  "Non-Profit",
  "Arts & Crafts",
  "Agriculture",
  "Other"
];

const CampaignOverview: React.FC<CampaignOverviewProps> = ({ 
  campaignData, 
  updateCampaignData 
}) => {
  const [websiteUrlError, setWebsiteUrlError] = useState<string>('');
  const [industryError, setIndustryError] = useState<string>('');
  const [competitorError, setCompetitorError] = useState<string>('');
  const [newCompetitorUrl, setNewCompetitorUrl] = useState<string>('');
  const [analyzingWebsite, setAnalyzingWebsite] = useState<boolean>(false);
  const [industryRecommendation, setIndustryRecommendation] = useState<string>('');
  
  // Get the OpenAI hook
  const { loading, error, analyzeCampaign } = useOpenAI();
  
  // Handle website URL change
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCampaignData({ websiteUrl: e.target.value });
    
    // Clear error when user types
    if (websiteUrlError) {
      setWebsiteUrlError('');
    }
  };
  
  // Handle industry change
  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCampaignData({ industry: e.target.value });
    
    // Clear error when user selects an option
    if (industryError) {
      setIndustryError('');
    }
  };
  
  // Handle adding a competitor
  const handleAddCompetitor = () => {
    if (!newCompetitorUrl) {
      setCompetitorError('Please enter a competitor URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(newCompetitorUrl);
    } catch (e) {
      setCompetitorError('Please enter a valid URL');
      return;
    }
    
    // Check for duplicates
    if (campaignData.competitorUrls.includes(newCompetitorUrl)) {
      setCompetitorError('This competitor URL has already been added');
      return;
    }
    
    // Check if maximum reached
    if (campaignData.competitorUrls.length >= 5) {
      setCompetitorError('Maximum of 5 competitor URLs allowed');
      return;
    }
    
    // Add the competitor URL
    updateCampaignData({
      competitorUrls: [...campaignData.competitorUrls, newCompetitorUrl]
    });
    
    // Clear the input and any errors
    setNewCompetitorUrl('');
    setCompetitorError('');
  };
  
  // Handle removing a competitor
  const handleRemoveCompetitor = (url: string) => {
    updateCampaignData({
      competitorUrls: campaignData.competitorUrls.filter(u => u !== url)
    });
  };
  
  // Handle key press (Enter) for adding competitors
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCompetitor();
    }
  };

  // Handle website analysis
  const handleAnalyzeWebsite = async () => {
    if (!campaignData.websiteUrl) {
      setWebsiteUrlError('Please enter your website URL first');
      return;
    }
    
    try {
      // Validate URL format
      new URL(campaignData.websiteUrl);
      
      // Show analyzing state
      setAnalyzingWebsite(true);
      
      try {
        // Analyze website
        const analysis = await WebsiteAnalyzer.analyzeWebsite(campaignData.websiteUrl);
        
        // Detect industry if not already selected
        if (!campaignData.industry && analysis) {
          // In a real implementation, we would use the AI to determine the industry
          // For now, we'll use a simple mapping based on the URL
          let detectedIndustry = '';
          
          if (campaignData.websiteUrl.includes('shop') || campaignData.websiteUrl.includes('store')) {
            detectedIndustry = 'E-commerce';
          } else if (campaignData.websiteUrl.includes('tech')) {
            detectedIndustry = 'Technology';
          } else if (campaignData.websiteUrl.includes('health')) {
            detectedIndustry = 'Healthcare';
          } else {
            // Find the first matching industry in the URL
            const match = INDUSTRIES.find(industry => 
              campaignData.websiteUrl.toLowerCase().includes(industry.toLowerCase())
            );
            
            if (match) {
              detectedIndustry = match;
            }
          }
          
          if (detectedIndustry) {
            setIndustryRecommendation(detectedIndustry);
          }
        }
        
        // In a production environment, we would use the OpenAI API here
        // to analyze the website and provide recommendations
        
        // For demo purposes, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Error analyzing website:', error);
      } finally {
        setAnalyzingWebsite(false);
      }
      
    } catch (error) {
      setWebsiteUrlError('Please enter a valid URL');
    }
  };
  
  // Apply recommended industry
  const applyRecommendedIndustry = () => {
    if (industryRecommendation) {
      updateCampaignData({ industry: industryRecommendation });
      setIndustryRecommendation('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 max-w-3xl mx-auto">
        {/* Website URL Field */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-2">
            <h3 className="text-md font-medium text-gray-700 flex items-center">
              Your Website URL <span className="text-[#2563eb] ml-1">*</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              We'll analyze your website to provide better recommendations
            </p>
          </div>
          
          <div className="flex">
            <InputField
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={campaignData.websiteUrl}
              onChange={handleWebsiteChange}
              placeholder="https://example.com"
              error={websiteUrlError}
              leftIcon={<FontAwesomeIcon icon={faGlobe} className="text-[#2563eb]" />}
              isRequired={true}
              isFullWidth={true}
              className="flex-1"
              inputClassName="px-4 py-2.5 focus:border-[#2563eb] focus:ring-[#2563eb]"
            />
            
            <Button
              variant="secondary"
              onClick={handleAnalyzeWebsite}
              className="ml-2 whitespace-nowrap"
              disabled={analyzingWebsite || !campaignData.websiteUrl}
            >
              {analyzingWebsite ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Site'
              )}
            </Button>
          </div>
        </div>

        {/* Industry Selection Field */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-2">
            <h3 className="text-md font-medium text-gray-700 flex items-center">
              Industry <span className="text-[#2563eb] ml-1">*</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Select your business industry to receive tailored campaign recommendations
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faIndustry} className="text-[#2563eb]" />
            </div>
            
            <select
              id="industry"
              name="industry"
              value={campaignData.industry}
              onChange={handleIndustryChange}
              className={`pl-10 px-4 py-2.5 block w-full focus:ring-[#2563eb] focus:border-[#2563eb] border-gray-300 rounded-md shadow-sm ${industryError ? 'border-red-300' : ''}`}
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          
          {industryError && (
            <p className="mt-1 text-xs text-red-600">{industryError}</p>
          )}
          
          {/* Industry recommendation section */}
          {industryRecommendation && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-800">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                Based on your website, we recommend: <strong>{industryRecommendation}</strong>
              </p>
              <button 
                onClick={applyRecommendedIndustry}
                className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Use this recommendation
              </button>
            </div>
          )}
        </div>

        {/* Competitor Websites Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-2">
            <h3 className="text-md font-medium text-gray-700 flex items-center">
              Competitor Websites
              <div className="ml-2 group relative">
                <FontAwesomeIcon 
                  icon={faInfoCircle} 
                  className="h-4 w-4 text-gray-400 cursor-help" 
                />
                <div className="hidden group-hover:block absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg -ml-32">
                  Adding competitor URLs helps our AI analyze the market and suggest differentiating strategies
                </div>
              </div>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Optional: Add up to 5 competitor websites to help our AI craft better strategies
            </p>
          </div>
          
          <div className="flex rounded-md shadow-sm">
            <input
              type="url"
              value={newCompetitorUrl}
              onChange={(e) => setNewCompetitorUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="focus:ring-[#2563eb] focus:border-[#2563eb] flex-1 block w-full rounded-l-md border-gray-300 px-4 py-2.5"
              placeholder="https://competitor.com"
            />
            <Button
              variant="primary"
              onClick={handleAddCompetitor}
              className="rounded-l-none bg-[#2563eb] px-4"
              leftIcon={<FontAwesomeIcon icon={faPlus} />}
            >
              Add
            </Button>
          </div>
          
          {competitorError && (
            <p className="mt-2 text-xs text-red-600">{competitorError}</p>
          )}
          
          {/* List of Added Competitors */}
          {campaignData.competitorUrls.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Added Competitors:</p>
              <div className="flex flex-wrap gap-2">
                {campaignData.competitorUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-800"
                  >
                    <span className="truncate max-w-xs">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompetitor(url)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Recommendation Section */}
      {(campaignData.websiteUrl || campaignData.industry) && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-3xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">AI-Powered Insights</h3>
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  {!campaignData.industry && !campaignData.websiteUrl && (
                    "Enter your website URL and industry to get personalized recommendations."
                  )}
                  {campaignData.websiteUrl && !campaignData.industry && (
                    "Based on your website, we'll help you determine the best industry classification and campaign strategy."
                  )}
                  {campaignData.industry && !campaignData.websiteUrl && (
                    `As a ${campaignData.industry.toLowerCase()} business, we'll tailor your campaign strategy to industry best practices.`
                  )}
                  {campaignData.industry && campaignData.websiteUrl && (
                    `We'll analyze your ${campaignData.industry.toLowerCase()} website and create a customized campaign strategy.
                    ${campaignData.competitorUrls.length > 0 ? ` We'll also compare against your ${campaignData.competitorUrls.length} competitor(s) to find opportunities.` : ''}`
                  )}
                </p>
                {analyzingWebsite && (
                  <div className="mt-2 flex items-center text-blue-800">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Analyzing your website...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignOverview; 