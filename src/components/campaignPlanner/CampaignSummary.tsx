import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload, 
  faCopy, 
  faCheckCircle,
  faChartLine,
  faBullseye,
  faPalette,
  faDollarSign,
  faRocket,
  faUsers,
  faGlobe,
  faLayerGroup,
  faLink,
  faHandPointRight,
  faPaintBrush
} from '@fortawesome/free-solid-svg-icons';
import PlatformCampaignCreator from './PlatformCampaignCreator';

interface CampaignSummaryProps {
  campaignData: {
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
    creative?: {
      formats: string[];
      message: string;
      cta: string;
      uploadedSamples: string[];
    };
    mediaPlan?: {
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
  };
}

// Platform name mapping
const PLATFORM_NAMES: {[key: string]: string} = {
  'google': 'Google Ads',
  'meta': 'Meta (Facebook/Instagram)',
  'linkedin': 'LinkedIn',
  'tiktok': 'TikTok',
  'microsoft': 'Microsoft Ads',
  'reddit': 'Reddit Ads'
};

// Format name mapping
const FORMAT_NAMES: {[key: string]: string} = {
  'single-image': 'Single Image',
  'video': 'Video',
  'carousel': 'Carousel',
  'stories': 'Stories',
  'text': 'Text Ads'
};

// Objective name mapping
const OBJECTIVE_NAMES: {[key: string]: string} = {
  'engagement': 'Engagement',
  'conversion': 'Conversions',
  'awareness': 'Brand Awareness',
  'leads': 'Lead Generation',
  'traffic': 'Website Traffic',
  'app-installs': 'App Installs',
  'product-sales': 'Product Sales'
};

const CampaignSummary: React.FC<CampaignSummaryProps> = ({ campaignData }) => {
  const [copied, setCopied] = useState(false);
  const [showCampaignCreator, setShowCampaignCreator] = useState(false);

  // Generate total budget
  const getTotalBudget = () => {
    if (campaignData.budget.isDaily) {
      return campaignData.budget.amount * campaignData.budget.duration;
    }
    return campaignData.budget.amount;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  // Add a function to calculate media plan totals
  const getMediaPlanTotals = () => {
    if (!campaignData.mediaPlan || !campaignData.mediaPlan.placements || campaignData.mediaPlan.placements.length === 0) {
      return { budget: 0, impressions: 0 };
    }

    return campaignData.mediaPlan.placements.reduce(
      (acc, placement) => {
        return {
          budget: acc.budget + placement.budget,
          impressions: acc.impressions + placement.impressions
        };
      },
      { budget: 0, impressions: 0 }
    );
  };

  // Add a function to handle media plan download
  const handleDownloadMediaPlan = () => {
    // Create CSV content for media plan
    let csvContent = "Platform,Format,Placement,Budget,CPM,Estimated Impressions\n";
    
    if (campaignData.mediaPlan && campaignData.mediaPlan.placements && campaignData.mediaPlan.placements.length > 0) {
      // Add each placement as a row in the CSV
      campaignData.mediaPlan.placements.forEach(placement => {
        csvContent += `${placement.platform},${placement.format},${placement.placement},${placement.budget.toFixed(2)},${placement.cpm.toFixed(2)},${Math.round(placement.impressions)}\n`;
      });
      
      // Add totals row
      const totals = getMediaPlanTotals();
      csvContent += `TOTAL,,,${totals.budget.toFixed(2)},${totals.impressions > 0 ? ((totals.budget / totals.impressions) * 1000).toFixed(2) : 0},${Math.round(totals.impressions)}\n`;
      
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MediaPlan_${campaignData.mediaPlan.ioNumber}_${new Date().toISOString().split('T')[0]}.csv`);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Generate platform budget allocation
  const generatePlatformBudgets = () => {
    const totalBudget = getTotalBudget();
    const platforms = campaignData.platforms;
    
    if (platforms.length === 0) return [];
    
    // Generate a weight for each platform based on suitability for the objective
    const platformWeights: {[key: string]: number} = {
      'google': (campaignData.objective === 'conversion' || campaignData.objective === 'traffic') ? 0.3 : 0.15,
      'meta': (campaignData.objective === 'awareness' || campaignData.objective === 'engagement') ? 0.3 : 0.2,
      'linkedin': (campaignData.objective === 'leads' && campaignData.industry === 'b2b') ? 0.4 : 0.1,
      'tiktok': (campaignData.objective === 'awareness' || campaignData.objective === 'engagement') ? 0.25 : 0.1,
      'microsoft': (campaignData.objective === 'conversion' && campaignData.industry === 'b2b') ? 0.25 : 0.1,
      'reddit': 0.05
    };
    
    // Sum the weights of selected platforms
    const totalWeight = platforms.reduce((sum, platform) => sum + (platformWeights[platform] || 0.1), 0);
    
    // Calculate budget allocation
    return platforms.map(platform => {
      const weight = platformWeights[platform] || 0.1;
      const allocation = (weight / totalWeight) * totalBudget;
      return {
        platform,
        platformName: PLATFORM_NAMES[platform] || platform,
        budget: allocation,
        percentage: (weight / totalWeight) * 100
      };
    });
  };

  // Generate campaign name taxonomy
  const generateCampaignNames = () => {
    const platforms = campaignData.platforms;
    if (platforms.length === 0) return [];
    
    // Extract company name from website URL
    const companyName = campaignData.websiteUrl
      ? campaignData.websiteUrl
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .split('.')[0]
          .toUpperCase()
      : 'BRAND';
    
    const objective = campaignData.objective.substring(0, 3).toUpperCase();
    const audienceCode = campaignData.audiencePersona.name.replace(/\s+/g, '_').substring(0, 5).toUpperCase();
    const geo = campaignData.budget.countries.length > 0 ? 
      campaignData.budget.countries[0].substring(0, 2).toUpperCase() : 'US';
    
    const date = new Date().toISOString().slice(0, 7).replace(/-/g, '');
    
    return platforms.map(platform => {
      // Use full platform name instead of abbreviation
      const platformFullName = (PLATFORM_NAMES[platform] || platform)
        .replace(/\s+/g, '')  // Remove spaces
        .replace(/\(|\)|\//g, '')  // Remove parentheses and slashes
        .toUpperCase();  // Convert to uppercase
      
      return {
        platform,
        platformName: PLATFORM_NAMES[platform] || platform,
        campaignName: `${companyName}_${platformFullName}_${objective}_${audienceCode}_${geo}_${date}`,
        description: `${PLATFORM_NAMES[platform] || platform} campaign for ${OBJECTIVE_NAMES[campaignData.objective] || campaignData.objective} targeting ${campaignData.audiencePersona.name}`
      };
    });
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const platformBudgets = generatePlatformBudgets();
    const campaignNames = generateCampaignNames();
    
    // Create a summary text
    const summary = `
CAMPAIGN SUMMARY
===============

Website: ${campaignData.websiteUrl}
Industry: ${campaignData.industry}
Campaign Objective: ${OBJECTIVE_NAMES[campaignData.objective] || campaignData.objective}

PLATFORMS:
${campaignData.platforms.map(p => PLATFORM_NAMES[p] || p).join(', ')}

TARGET AUDIENCE:
${campaignData.audiencePersona.name}
Age Range: ${campaignData.audiencePersona.ageRange[0]}-${campaignData.audiencePersona.ageRange[1]}
Gender: ${campaignData.audiencePersona.gender.join(', ') || 'All'}
Interests: ${campaignData.audiencePersona.interests.join(', ')}
Behaviors: ${campaignData.audiencePersona.behaviors.join(', ')}

BUDGET & GEOGRAPHY:
Budget: ${formatCurrency(campaignData.budget.amount)} ${campaignData.budget.isDaily ? 'daily' : 'total'}
Duration: ${campaignData.budget.duration} days
Total Investment: ${formatCurrency(getTotalBudget())}
Countries: ${campaignData.budget.countries.join(', ')}
${campaignData.budget.regions.length > 0 ? `Regions: ${campaignData.budget.regions.join(', ')}` : ''}

PLATFORM ALLOCATION:
${platformBudgets.map(p => `${p.platformName}: ${formatCurrency(p.budget)} (${p.percentage.toFixed(1)}%)`).join('\n')}

SUGGESTED CAMPAIGN NAMES:
${campaignNames.map(c => `${c.platformName}: ${c.campaignName}`).join('\n')}
`;

    // Copy to clipboard
    navigator.clipboard.writeText(summary);
    
    // Show copied indicator
    setCopied(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Open campaign creator
  const openCampaignCreator = () => {
    // Check if media plan exists and has placements
    if (!campaignData.mediaPlan || !campaignData.mediaPlan.placements || campaignData.mediaPlan.placements.length === 0) {
      alert('Please create a media plan first before launching campaigns. Go to the Media Plan & IO step to generate one.');
      return;
    }

    // Check if creative exists
    if (!campaignData.creative) {
      alert('Please create creative guidance first before launching campaigns.');
      return;
    }
    
    // Validate that each placement has valid data
    const invalidPlacements = campaignData.mediaPlan.placements.filter(
      p => !p.platform || !p.format || !p.placement || p.budget <= 0
    );
    
    if (invalidPlacements.length > 0) {
      alert('Some placements in your media plan are incomplete. Please ensure all placements have a platform, format, placement, and budget greater than zero.');
      return;
    }
    
    // Show warning if IO is not signed
    if (campaignData.mediaPlan.ioStatus !== 'signed') {
      const proceed = window.confirm('The insertion order is not signed yet. It is recommended to get the IO signed before launching campaigns. Do you want to proceed anyway?');
      if (!proceed) return;
    }
    
    // All checks passed, open the campaign creator
    console.log('Opening campaign creator with media plan:', campaignData.mediaPlan);
    setShowCampaignCreator(true);
  };

  // Generate platform budgets and campaign names
  const platformBudgets = generatePlatformBudgets();
  const campaignNames = generateCampaignNames();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Campaign Summary</h2>
        <p className="text-gray-600 mt-2">Review your campaign plan and budget allocation</p>
      </div>
      
      {/* Summary Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleCopySummary}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {copied ? (
            <>
              <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCopy} className="h-4 w-4 mr-2 text-gray-500" />
              Copy Summary
            </>
          )}
        </button>
      </div>
      
      {/* Campaign Overview */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-4 sm:px-6 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faRocket} className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-blue-900">Campaign Overview</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Campaign Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-base font-medium text-gray-900">{campaignData.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="text-base font-medium text-gray-900 break-all">{campaignData.websiteUrl || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Objective</p>
                  <p className="text-base font-medium text-gray-900">{OBJECTIVE_NAMES[campaignData.objective] || campaignData.objective}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Budget & Duration</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatCurrency(campaignData.budget.amount)} {campaignData.budget.isDaily ? '(daily)' : '(total)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-base font-medium text-gray-900">{campaignData.budget.duration} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Investment</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(getTotalBudget())}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Audience Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-4 sm:px-6 bg-purple-50 border-b border-purple-100">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-purple-900">Target Audience</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Audience Persona</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Persona Name</p>
                  <p className="text-base font-medium text-gray-900">{campaignData.audiencePersona.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age Range</p>
                  <p className="text-base font-medium text-gray-900">
                    {campaignData.audiencePersona.ageRange[0]} - {campaignData.audiencePersona.ageRange[1]}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-base font-medium text-gray-900">
                    {campaignData.audiencePersona.gender.length > 0 
                      ? campaignData.audiencePersona.gender.join(', ') 
                      : 'All Genders'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Targeting Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Interests</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignData.audiencePersona.interests.length > 0 ? (
                      campaignData.audiencePersona.interests.map((interest, index) => (
                        <span 
                          key={`interest-${index}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No interests specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Behaviors</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaignData.audiencePersona.behaviors.length > 0 ? (
                      campaignData.audiencePersona.behaviors.map((behavior, index) => (
                        <span 
                          key={`behavior-${index}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {behavior}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No behaviors specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Platform Allocation */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-4 sm:px-6 bg-green-50 border-b border-green-100">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-green-900">Budget Allocation</h3>
          </div>
        </div>
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Platform Distribution</h4>
          
          {campaignData.platforms.length > 0 ? (
            <div className="space-y-4">
              {platformBudgets.map((platform, index) => (
                <div key={`platform-${index}`} className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{platform.platformName}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(platform.budget)} ({platform.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${platform.percentage}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No platforms selected</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Geographic Targeting</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Countries</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {campaignData.budget.countries.length > 0 ? (
                    campaignData.budget.countries.map((country, index) => (
                      <span 
                        key={`country-${index}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <FontAwesomeIcon icon={faGlobe} className="h-3 w-3 mr-1" />
                        {country}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No countries specified</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Regions</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {campaignData.budget.regions.length > 0 ? (
                    campaignData.budget.regions.map((region, index) => (
                      <span 
                        key={`region-${index}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {region}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No specific regions</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaign Naming */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-4 sm:px-6 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLayerGroup} className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="text-lg font-medium text-amber-900">Campaign Naming Taxonomy</h3>
          </div>
        </div>
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Suggested Campaign Names</h4>
          
          {campaignData.platforms.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Platform</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Campaign Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {campaignNames.map((campaign, index) => (
                    <tr key={`campaign-${index}`}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {campaign.platformName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 font-mono">
                        {campaign.campaignName}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700">
                        {campaign.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No platforms selected</p>
            </div>
          )}
          
          <div className="mt-6 bg-amber-50 rounded-lg p-4">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faHandPointRight} className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-medium text-amber-800">Naming Convention Format</h5>
                <p className="mt-1 text-sm text-amber-700">
                  CompanyName_PLATFORM_OBJECTIVE_AUDIENCE_GEO_DATE
                </p>
                <p className="mt-2 text-xs text-amber-600">
                  This taxonomy ensures consistency across campaigns and makes reporting and analysis easier.
                  The company name is derived from your website URL, and we use the full platform name for better clarity.
                  The format includes essential information about your campaign's purpose, target audience, and timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div className="text-center max-w-md">
          <p className="text-sm text-gray-500">
            This is a summary of your campaign plan. You can use the "Copy Summary" button to copy all details to your clipboard.
            The budget allocations and naming conventions are AI-generated suggestions that you can adjust as needed.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <button
          onClick={handleCopySummary}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} className="h-4 w-4 mr-2" />
          {copied ? 'Copied to Clipboard' : 'Copy Campaign Brief'}
        </button>
        
        <button
          onClick={() => {
            const event = new CustomEvent('setCurrentPage', { detail: 'creative-assets' });
            window.dispatchEvent(event);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FontAwesomeIcon icon={faPaintBrush} className="h-4 w-4 mr-2" />
          Creative planning
        </button>
      </div>
      
      {/* Campaign Creator Modal */}
      {showCampaignCreator && campaignData.creative && campaignData.mediaPlan && (
        <PlatformCampaignCreator
          campaignData={{
            ...campaignData,
            creative: campaignData.creative,
            mediaPlan: campaignData.mediaPlan
          }}
          mediaPlan={campaignData.mediaPlan}
          onClose={() => setShowCampaignCreator(false)}
        />
      )}
    </div>
  );
};

export default CampaignSummary; 