import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PlatformCampaignCreator from './PlatformCampaignCreator';

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

interface LaunchCampaignButtonProps {
  campaignData: CampaignData;
  buttonText?: string;
  size?: 'sm' | 'md' | 'lg';
  buttonStyle?: 'primary' | 'secondary' | 'outline' | 'danger' | 'warning' | 'info';
  iconPosition?: 'left' | 'right' | 'none';
  showIcon?: boolean;
  disabled?: boolean;
  tooltipText?: string;
  className?: string;
  skipIOCheck?: boolean;
  onBeforeLaunch?: () => boolean | Promise<boolean>;
  onLaunchSuccess?: (results: any) => void;
  onLaunchError?: (error: Error) => void;
}

const LaunchCampaignButton: React.FC<LaunchCampaignButtonProps> = ({
  campaignData,
  buttonText = 'Launch Campaign',
  size = 'md',
  buttonStyle = 'primary',
  iconPosition = 'left',
  showIcon = true,
  disabled = false,
  tooltipText = '',
  className = '',
  skipIOCheck = false,
  onBeforeLaunch,
  onLaunchSuccess,
  onLaunchError
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Function to generate button classes based on props
  const getButtonClasses = () => {
    let classes = 'rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center ';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += 'px-2.5 py-1.5 text-xs ';
        break;
      case 'lg':
        classes += 'px-6 py-3 text-base ';
        break;
      case 'md':
      default:
        classes += 'px-4 py-2 text-sm ';
    }
    
    // Style classes
    switch (buttonStyle) {
      case 'secondary':
        classes += 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 ';
        break;
      case 'outline':
        classes += 'border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500 ';
        break;
      case 'danger':
        classes += 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 ';
        break;
      case 'warning':
        classes += 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 ';
        break;
      case 'info':
        classes += 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500 ';
        break;
      case 'primary':
      default:
        classes += 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ';
    }
    
    // Add disabled styles
    if (disabled) {
      classes += 'opacity-60 cursor-not-allowed pointer-events-none ';
    }
    
    // Add any custom classes
    if (className) {
      classes += className;
    }
    
    return classes;
  };

  // Function to open campaign creator
  const openCampaignCreator = async () => {
    setValidationError(null);

    // Run pre-launch validation
    if (onBeforeLaunch) {
      const canProceed = await onBeforeLaunch();
      if (!canProceed) {
        return;
      }
    }

    // Validate media plan exists and has placements
    if (!campaignData.mediaPlan || !campaignData.mediaPlan.placements || campaignData.mediaPlan.placements.length === 0) {
      setValidationError('Cannot launch campaigns without a media plan and placements');
      return;
    }

    // Check if IO status is ready or signed (unless skipIOCheck is true)
    if (!skipIOCheck && campaignData.mediaPlan.ioStatus === 'draft') {
      setValidationError('Cannot launch campaigns when IO is still in draft status');
      return;
    }

    // Open the campaign creator modal
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to show/hide tooltip
  const handleMouseEnter = () => {
    if (tooltipText) {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  return (
    <>
      {/* Launch Button */}
      <div className="relative inline-block">
        <button
          className={getButtonClasses()}
          onClick={openCampaignCreator}
          disabled={disabled}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-testid="launch-campaign-button"
        >
          {showIcon && iconPosition === 'left' && (
            <FontAwesomeIcon icon={faRocket} className="mr-2 h-4 w-4" />
          )}
          {buttonText}
          {showIcon && iconPosition === 'right' && (
            <FontAwesomeIcon icon={faRocket} className="ml-2 h-4 w-4" />
          )}
        </button>
        
        {/* Tooltip */}
        {isTooltipVisible && tooltipText && (
          <div className="absolute z-10 transform -translate-x-1/2 left-1/2 bottom-full mb-2">
            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg max-w-xs">
              {tooltipText}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            </div>
          </div>
        )}
        
        {/* Validation Error */}
        {validationError && (
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
            {validationError}
          </div>
        )}
      </div>
      
      {/* Campaign Creator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal}></div>
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Platform Campaigns</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <PlatformCampaignCreator
                campaignData={campaignData}
                mediaPlan={campaignData.mediaPlan}
                onClose={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LaunchCampaignButton; 