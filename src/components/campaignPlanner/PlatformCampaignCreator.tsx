import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faInstagram, faLinkedin, faTwitter, faPinterest, faTiktok, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, faCheck, faExclamationTriangle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface MediaPlan {
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
}

interface CampaignData {
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
  mediaPlan: MediaPlan;
}

interface PlatformCampaignCreatorProps {
  campaignData: CampaignData;
  mediaPlan: MediaPlan;
  onClose: () => void;
}

interface PlatformStatus {
  platform: string;
  status: 'pending' | 'in_progress' | 'success' | 'error';
  message?: string;
  expanded: boolean;
  config?: {
    [key: string]: any;
  };
  campaignId?: string;
  campaignUrl?: string;
}

// Map platform names to their FontAwesome icons
const platformIcons: { [key: string]: any } = {
  'facebook': faFacebook,
  'instagram': faInstagram,
  'google': faGoogle,
  'linkedin': faLinkedin,
  'twitter': faTwitter,
  'pinterest': faPinterest,
  'tiktok': faTiktok,
  'snapchat': faSnapchat
};

const PlatformCampaignCreator: React.FC<PlatformCampaignCreatorProps> = ({ campaignData, mediaPlan, onClose }) => {
  // Group placements by platform
  const groupedPlacements = mediaPlan.placements.reduce((acc: { [key: string]: any[] }, placement) => {
    if (!acc[placement.platform]) {
      acc[placement.platform] = [];
    }
    acc[placement.platform].push(placement);
    return acc;
  }, {});

  // Initialize platform statuses
  const initialPlatformStatuses: PlatformStatus[] = Object.keys(groupedPlacements).map(platform => ({
    platform,
    status: 'pending',
    expanded: false
  }));

  const [platformStatuses, setPlatformStatuses] = useState<PlatformStatus[]>(initialPlatformStatuses);
  const [overallProgress, setOverallProgress] = useState(0);
  const [creatingCampaigns, setCreatingCampaigns] = useState(false);
  const [finishedCreation, setFinishedCreation] = useState(false);

  // Function to toggle expanded state for a platform
  const togglePlatformExpanded = (platformIndex: number) => {
    setPlatformStatuses(prevStatuses => 
      prevStatuses.map((status, index) => 
        index === platformIndex 
          ? { ...status, expanded: !status.expanded } 
          : status
      )
    );
  };

  // Simulate campaign creation process
  useEffect(() => {
    if (creatingCampaigns && !finishedCreation) {
      let completedPlatforms = 0;
      const totalPlatforms = platformStatuses.length;

      // Process each platform sequentially
      const processPlatform = async (index: number) => {
        if (index >= totalPlatforms) {
          setFinishedCreation(true);
          return;
        }

        // Update status to in_progress
        setPlatformStatuses(prev => 
          prev.map((status, i) => 
            i === index 
              ? { ...status, status: 'in_progress' } 
              : status
          )
        );

        // Simulate API call delay (1.5 to 3 seconds)
        const delay = 1500 + Math.random() * 1500;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Generate campaign ID and URL
        const platform = platformStatuses[index].platform;
        const campaignId = `${platform.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90000) + 10000}`;
        
        let campaignUrl: string | undefined;
        switch (platform.toLowerCase()) {
          case 'facebook':
          case 'instagram':
            campaignUrl = `https://www.facebook.com/adsmanager/manage/campaigns?act=${Math.floor(Math.random() * 900000000) + 100000000}`;
            break;
          case 'google':
            campaignUrl = `https://ads.google.com/aw/campaigns?campaignId=${Math.floor(Math.random() * 9000000000) + 1000000000}`;
            break;
          case 'linkedin':
            campaignUrl = `https://www.linkedin.com/campaignmanager/accounts/123456789/campaigns/${Math.floor(Math.random() * 900000) + 100000}`;
            break;
          case 'twitter':
            campaignUrl = `https://ads.twitter.com/campaign/${Math.floor(Math.random() * 90000000) + 10000000}`;
            break;
          default:
            campaignUrl = `https://${platform}.com/ads/manage/${Math.floor(Math.random() * 9000000) + 1000000}`;
        }

        // Randomly determine success (90%) or error (10%)
        const isSuccess = Math.random() > 0.1;
        
        // Update with final status
        setPlatformStatuses(prev => 
          prev.map((status, i) => 
            i === index 
              ? { 
                  ...status, 
                  status: isSuccess ? 'success' : 'error',
                  message: isSuccess 
                    ? `Campaign created successfully. ID: ${campaignId}` 
                    : 'Failed to create campaign. API error occurred.',
                  campaignId: isSuccess ? campaignId : undefined,
                  campaignUrl: isSuccess ? campaignUrl : undefined,
                  expanded: true // Auto-expand on completion
                } 
              : status
          )
        );

        // Update progress
        completedPlatforms++;
        setOverallProgress(Math.round((completedPlatforms / totalPlatforms) * 100));

        // Process next platform
        processPlatform(index + 1);
      };

      // Start processing with the first platform
      processPlatform(0);
    }
  }, [creatingCampaigns, finishedCreation, platformStatuses.length]);

  // Start campaign creation
  const handleCreateCampaigns = () => {
    setCreatingCampaigns(true);
  };

  // Render platform card with status
  const renderPlatformCard = (status: PlatformStatus, index: number) => {
    const { platform, status: creationStatus, message, expanded, campaignId, campaignUrl } = status;
    const platformPlacements = groupedPlacements[platform] || [];
    const totalBudget = platformPlacements.reduce((sum, p) => sum + p.budget, 0);

    return (
      <div key={platform} className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm">
        <div 
          className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
          onClick={() => togglePlatformExpanded(index)}
        >
          <div className="flex items-center space-x-3">
            {platformIcons[platform.toLowerCase()] && (
              <FontAwesomeIcon 
                icon={platformIcons[platform.toLowerCase()]} 
                className="h-5 w-5 text-gray-600" 
              />
            )}
            <h3 className="font-medium capitalize">{platform}</h3>
            {creationStatus === 'in_progress' && (
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 text-blue-500 animate-spin" />
            )}
            {creationStatus === 'success' && (
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500" />
            )}
            {creationStatus === 'error' && (
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">${totalBudget.toLocaleString()}</span>
            <FontAwesomeIcon 
              icon={expanded ? faChevronUp : faChevronDown} 
              className="h-4 w-4 text-gray-400" 
            />
          </div>
        </div>
        
        {expanded && (
          <div className="p-4 border-t border-gray-200">
            {/* Platform Placements */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Placements</h4>
              <div className="space-y-2">
                {platformPlacements.map((placement, i) => (
                  <div key={i} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>{placement.format} - {placement.placement}</span>
                    <span className="font-medium">${placement.budget.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Campaign Details (if created successfully) */}
            {creationStatus === 'success' && campaignId && (
              <div className="bg-green-50 p-3 rounded border border-green-100 text-sm">
                <div className="font-medium text-green-700 mb-1">Campaign Created Successfully</div>
                <div className="text-gray-700">Campaign ID: {campaignId}</div>
                {campaignUrl && (
                  <a 
                    href={campaignUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    View Campaign on {platform}
                  </a>
                )}
              </div>
            )}
            
            {/* Error Message (if creation failed) */}
            {creationStatus === 'error' && (
              <div className="bg-red-50 p-3 rounded border border-red-100 text-sm">
                <div className="font-medium text-red-700 mb-1">Failed to Create Campaign</div>
                <div className="text-gray-700">{message || 'An unknown error occurred'}</div>
                <button 
                  className="mt-2 text-sm px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
                  onClick={() => {
                    // Reset this platform status to retry
                    setPlatformStatuses(prev => 
                      prev.map((s, i) => 
                        i === index ? { ...s, status: 'pending' } : s
                      )
                    );
                  }}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Progress */}
      {creatingCampaigns && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {finishedCreation ? 'Campaign Creation Complete' : 'Creating Campaigns...'}
            </span>
            <span className="text-sm text-gray-600">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Platform Cards */}
      <div className="flex-grow overflow-y-auto mb-6">
        {platformStatuses.map(renderPlatformCard)}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {finishedCreation ? 'Close' : 'Cancel'}
        </button>
        
        {!creatingCampaigns && (
          <button
            onClick={handleCreateCampaigns}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Create Campaigns
          </button>
        )}
        
        {finishedCreation && (
          <button
            onClick={() => {
              // Download campaign summary as JSON (in real implementation)
              const campaignSummary = platformStatuses
                .filter(p => p.status === 'success')
                .map(p => ({
                  platform: p.platform,
                  campaignId: p.campaignId,
                  campaignUrl: p.campaignUrl,
                  budget: groupedPlacements[p.platform].reduce((sum, place) => sum + place.budget, 0)
                }));
              
              const dataStr = JSON.stringify(campaignSummary, null, 2);
              const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
              
              const exportName = `campaign_summary_${new Date().toISOString().split('T')[0]}.json`;
              
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportName);
              linkElement.click();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            Download Summary
          </button>
        )}
      </div>
    </div>
  );
};

export default PlatformCampaignCreator; 