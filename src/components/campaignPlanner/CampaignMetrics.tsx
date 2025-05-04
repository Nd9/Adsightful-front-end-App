import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faHandHoldingDollar, 
  faEye,
  faMousePointer,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import LaunchCampaignButton from './LaunchCampaignButton';

interface CampaignMetricsProps {
  campaignData: {
    websiteUrl: string;
    industry: string;
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
  };
}

// Function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Function to format large numbers with commas
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const CampaignMetrics: React.FC<CampaignMetricsProps> = ({ campaignData }) => {
  // Calculate total budget
  const getTotalBudget = () => {
    if (campaignData.budget.isDaily) {
      return campaignData.budget.amount * campaignData.budget.duration;
    }
    return campaignData.budget.amount;
  };
  
  // Calculate total impressions
  const getTotalImpressions = () => {
    if (!campaignData.mediaPlan || !campaignData.mediaPlan.placements) return 0;
    
    return campaignData.mediaPlan.placements.reduce((sum, placement) => {
      return sum + placement.impressions;
    }, 0);
  };
  
  // Calculate expected clicks (assuming 1% CTR)
  const getExpectedClicks = () => {
    const impressions = getTotalImpressions();
    return impressions * 0.01; // 1% CTR
  };
  
  // Calculate expected conversions (assuming 2% conversion rate on clicks)
  const getExpectedConversions = () => {
    const clicks = getExpectedClicks();
    return clicks * 0.02; // 2% conversion rate
  };
  
  // Calculate average CPC
  const getAverageCPC = () => {
    const totalBudget = getTotalBudget();
    const clicks = getExpectedClicks();
    return clicks > 0 ? totalBudget / clicks : 0;
  };
  
  // Calculate average CPA
  const getAverageCPA = () => {
    const totalBudget = getTotalBudget();
    const conversions = getExpectedConversions();
    return conversions > 0 ? totalBudget / conversions : 0;
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Campaign Metrics</h2>
        <LaunchCampaignButton 
          campaignData={campaignData} 
          buttonText="Setup Campaign" 
          buttonStyle="primary"
          size="sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Budget Metrics */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faHandHoldingDollar} className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-blue-800">Budget Metrics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Budget</span>
              <span className="text-sm font-semibold">{formatCurrency(getTotalBudget())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Daily Budget</span>
              <span className="text-sm font-semibold">{formatCurrency(campaignData.budget.isDaily ? campaignData.budget.amount : getTotalBudget() / campaignData.budget.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Campaign Duration</span>
              <span className="text-sm font-semibold">{campaignData.budget.duration} days</span>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-green-800">Performance Metrics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Est. Impressions</span>
              <span className="text-sm font-semibold">{formatNumber(getTotalImpressions())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Est. Clicks</span>
              <span className="text-sm font-semibold">{formatNumber(getExpectedClicks())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Est. Conversions</span>
              <span className="text-sm font-semibold">{formatNumber(getExpectedConversions())}</span>
            </div>
          </div>
        </div>
        
        {/* Efficiency Metrics */}
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
              <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-purple-800">Efficiency Metrics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. CPM</span>
              <span className="text-sm font-semibold">{getTotalImpressions() > 0 ? formatCurrency((getTotalBudget() / getTotalImpressions()) * 1000) : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. CPC</span>
              <span className="text-sm font-semibold">{getExpectedClicks() > 0 ? formatCurrency(getAverageCPC()) : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. CPA</span>
              <span className="text-sm font-semibold">{getExpectedConversions() > 0 ? formatCurrency(getAverageCPA()) : '—'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Platform Breakdown */}
      {campaignData.mediaPlan && campaignData.mediaPlan.placements && campaignData.mediaPlan.placements.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-medium text-gray-800 mb-4">Platform Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPM</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaignData.mediaPlan.placements.map((placement, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{placement.platform}</div>
                      <div className="text-gray-500 text-xs">{placement.format} - {placement.placement}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(placement.budget)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(placement.impressions)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ${placement.cpm.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <LaunchCampaignButton 
                        campaignData={campaignData}
                        buttonText="Setup"
                        buttonStyle="primary"
                        size="sm"
                        skipIOCheck={true}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {(!campaignData.mediaPlan || !campaignData.mediaPlan.placements || campaignData.mediaPlan.placements.length === 0) && (
        <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Media Plan Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please generate a media plan in the Media Plan & IO step before viewing platform metrics and setting up campaigns.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignMetrics; 