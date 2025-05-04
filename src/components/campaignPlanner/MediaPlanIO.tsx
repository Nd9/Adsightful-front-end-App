import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileInvoiceDollar, 
  faEdit, 
  faDownload, 
  faPlusSquare,
  faSyncAlt,
  faCheckCircle,
  faCalculator,
  faTimesCircle,
  faTrash,
  faRocket,
  faSpinner,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import PlatformCampaignCreator from './PlatformCampaignCreator';
import useOpenAI from '../../services/openai/useOpenAI';

// Define prop types for the component
interface MediaPlanIOProps {
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
  updateMediaPlan: (mediaPlan: any) => void;
}

// Default placement settings by platform
const PLATFORM_DEFAULTS: { [key: string]: { format: string; placement: string; cpm: number } } = {
  'facebook': { format: 'Feed', placement: 'Facebook News Feed', cpm: 7.19 },
  'instagram': { format: 'Feed', placement: 'Instagram Feed', cpm: 8.96 },
  'google': { format: 'Search', placement: 'Search Network', cpm: 2.41 },
  'youtube': { format: 'Video', placement: 'YouTube In-Stream', cpm: 6.49 },
  'tiktok': { format: 'Video', placement: 'TikTok For You Page', cpm: 10.28 },
  'linkedin': { format: 'Feed', placement: 'LinkedIn Feed', cpm: 6.59 },
  'twitter': { format: 'Feed', placement: 'Twitter Timeline', cpm: 6.46 },
  'pinterest': { format: 'Pin', placement: 'Pinterest Home Feed', cpm: 4.72 },
  'snapchat': { format: 'Story', placement: 'Snapchat Stories', cpm: 9.38 },
  'default': { format: 'Banner', placement: 'Display Network', cpm: 5.00 }
};

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

const MediaPlanIO: React.FC<MediaPlanIOProps> = ({ 
  mediaPlan, 
  campaignData, 
  updateMediaPlan 
}) => {
  const [editMode, setEditMode] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingPlacement, setEditingPlacement] = useState<any | null>(null);
  const [showCampaignCreator, setShowCampaignCreator] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  
  // Initialize OpenAI hook
  const { loading, error, generateMediaPlan: generateAIMediaPlan } = useOpenAI();
  
  // Handle generating an AI-powered media plan
  const generateMediaPlan = async () => {
    setGeneratingPlan(true);
    setAiSuggestions([]);
    
    try {
      // Ensure we have platforms selected
      if (!campaignData.platforms || campaignData.platforms.length === 0) {
        alert('Please select at least one platform in the Platform Selection step before generating a media plan.');
        setGeneratingPlan(false);
        return;
      }
      
      // In a production environment, this would call the OpenAI service
      // to generate a tailored media plan based on the campaign data
      let result;
      
      try {
        // Call the OpenAI service to generate a media plan
        result = await generateAIMediaPlan(campaignData);
        
        // If we have a valid result from OpenAI
        if (result) {
          // Process the AI response
          processAIMediaPlan(result);
        } else {
          // Fallback to the default generation if OpenAI call failed
          fallbackMediaPlanGeneration();
        }
      } catch (error) {
        console.error('Error calling OpenAI service:', error);
        // Fallback to the default generation
        fallbackMediaPlanGeneration();
      }
      
    } catch (error) {
      console.error('Error generating media plan:', error);
      alert('There was an error generating the media plan. Please check the console for details.');
    } finally {
      setGeneratingPlan(false);
      setShowAiSuggestions(true);
    }
  };
  
  // Process the AI-generated media plan
  const processAIMediaPlan = (aiResult: any) => {
    try {
      // For development purposes, we'll simulate AI suggestions
      // In production, this would parse the actual OpenAI response
      
      const suggestions = [
        "Based on recent performance data, increase budget allocation for Meta platforms by 15% for better ROAS.",
        "Your target audience demographics align better with Instagram than Facebook - consider a 60/40 split in favor of Instagram.",
        "For your industry, video formats typically outperform static ads by 32%. Consider allocating more budget to video placements.",
        "Competitor analysis suggests LinkedIn could deliver better qualified leads for your B2B offering.",
        "Historical CPM trends indicate January-February prices are 20% lower than Q4 - consider increasing budget during this period."
      ];
      
      setAiSuggestions(suggestions);
      
      // Calculate total budget
      const totalBudget = campaignData.budget.isDaily 
        ? campaignData.budget.amount * campaignData.budget.duration 
        : campaignData.budget.amount;
      
      // Create optimized platform allocations based on industry and objective
      // In a real implementation, this would come from the AI
      const platformAllocations = optimizePlatformAllocations(
        campaignData.platforms, 
        campaignData.industry, 
        campaignData.objective, 
        totalBudget
      );
      
      // Create the placements with optimized budgets
      const newPlacements = platformAllocations.map(({ platform, allocation }) => {
        // Get the default settings for this platform
        const defaults = PLATFORM_DEFAULTS[platform.toLowerCase()] || PLATFORM_DEFAULTS.default;
        
        // Calculate budget based on the optimized allocation
        const platformBudget = totalBudget * allocation;
        
        // Calculate impressions based on CPM
        const impressions = (platformBudget / defaults.cpm) * 1000;
        
        // Return the placement object
        return {
          platform: platform,
          format: defaults.format,
          placement: defaults.placement,
          budget: platformBudget,
          impressions: impressions,
          cpm: defaults.cpm
        };
      });
      
      // Generate dates
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + (campaignData.budget.duration * 24 * 60 * 60 * 1000))
        .toISOString().split('T')[0];
      
      // Generate IO number if needed
      const ioNumber = mediaPlan.ioNumber || `IO-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Create the complete media plan object
      const updatedMediaPlan = {
        ...mediaPlan,
        placements: newPlacements,
        startDate,
        endDate,
        ioNumber,
        ioStatus: 'draft'
      };
      
      // Update the media plan
      updateMediaPlan(updatedMediaPlan);
      
    } catch (error) {
      console.error('Error processing AI media plan:', error);
      // Fall back to default generation
      fallbackMediaPlanGeneration();
    }
  };
  
  // Default media plan generation (fallback if AI fails)
  const fallbackMediaPlanGeneration = () => {
    // Calculate total budget
    const totalBudget = campaignData.budget.isDaily 
      ? campaignData.budget.amount * campaignData.budget.duration 
      : campaignData.budget.amount;
    
    // Create a new placements array with even budget distribution
    const newPlacements = campaignData.platforms.map(platform => {
      // Get the default settings for this platform or use default if not found
      const defaults = PLATFORM_DEFAULTS[platform.toLowerCase()] || PLATFORM_DEFAULTS.default;
      
      // Calculate budget allocation - divide evenly among platforms
      const platformBudget = totalBudget / campaignData.platforms.length;
      
      // Calculate impressions based on CPM
      const impressions = (platformBudget / defaults.cpm) * 1000;
      
      // Return the placement object
      return {
        platform: platform,
        format: defaults.format,
        placement: defaults.placement,
        budget: platformBudget,
        impressions: impressions,
        cpm: defaults.cpm
      };
    });
    
    // Generate dates
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + (campaignData.budget.duration * 24 * 60 * 60 * 1000))
      .toISOString().split('T')[0];
    
    // Generate IO number if needed
    const ioNumber = mediaPlan.ioNumber || `IO-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Create the complete media plan object
    const updatedMediaPlan = {
      ...mediaPlan,
      placements: newPlacements,
      startDate,
      endDate,
      ioNumber,
      ioStatus: 'draft'
    };
    
    // Update the media plan
    updateMediaPlan(updatedMediaPlan);
    
    // Add some generic suggestions
    setAiSuggestions([
      "Consider allocating budget based on platform performance in your industry.",
      "For best results, maintain a consistent presence across all selected platforms.",
      "Monitor performance closely in the first week to identify optimization opportunities."
    ]);
  };
  
  // Optimize platform allocations based on industry and objective
  const optimizePlatformAllocations = (
    platforms: string[], 
    industry: string, 
    objective: string, 
    totalBudget: number
  ): Array<{ platform: string; allocation: number }> => {
    // This is a simplified allocation logic
    // In a real implementation, this would use data-driven allocation from the AI
    
    const allocations: Record<string, Record<string, Record<string, number>>> = {
      'E-commerce': {
        'awareness': {
          'facebook': 0.25,
          'instagram': 0.35,
          'google': 0.15,
          'youtube': 0.15,
          'tiktok': 0.10,
        },
        'conversion': {
          'facebook': 0.20,
          'instagram': 0.20,
          'google': 0.40,
          'youtube': 0.10,
          'tiktok': 0.10,
        },
        'engagement': {
          'facebook': 0.20,
          'instagram': 0.40,
          'google': 0.10,
          'youtube': 0.15,
          'tiktok': 0.15,
        }
      },
      'Technology': {
        'awareness': {
          'linkedin': 0.30,
          'google': 0.25,
          'youtube': 0.25,
          'facebook': 0.10,
          'twitter': 0.10,
        },
        'conversion': {
          'linkedin': 0.40,
          'google': 0.35,
          'youtube': 0.15,
          'facebook': 0.05,
          'twitter': 0.05,
        },
        'engagement': {
          'linkedin': 0.35,
          'twitter': 0.20,
          'youtube': 0.20,
          'facebook': 0.15,
          'google': 0.10,
        }
      }
    };
    
    // Default allocations if industry or objective not found
    const defaultAllocations: Record<string, number> = {
      'facebook': 0.20,
      'instagram': 0.20,
      'google': 0.20,
      'youtube': 0.15,
      'tiktok': 0.10,
      'linkedin': 0.05,
      'twitter': 0.05,
      'pinterest': 0.03,
      'snapchat': 0.02,
    };
    
    // Get the industry-specific allocations or use defaults
    const industryAllocations = allocations[industry]?.[objective] || defaultAllocations;
    
    // Calculate allocations for selected platforms
    let selectedPlatformAllocations = platforms.map(platform => {
      // Get the allocation for this platform or use a default value
      const allocation = industryAllocations[platform.toLowerCase()] || 
                         defaultAllocations[platform.toLowerCase()] || 
                         (1 / platforms.length); // Even split if no data
      
      return {
        platform,
        allocation
      };
    });
    
    // Normalize allocations to ensure they sum to 1
    const totalAllocation = selectedPlatformAllocations.reduce(
      (sum, { allocation }) => sum + allocation, 
      0
    );
    
    // Adjust allocations to sum to 1
    selectedPlatformAllocations = selectedPlatformAllocations.map(item => ({
      platform: item.platform,
      allocation: item.allocation / totalAllocation
    }));
    
    return selectedPlatformAllocations;
  };
  
  // Calculate totals for the media plan
  const calculateTotals = () => {
    return mediaPlan.placements.reduce(
      (acc, placement) => {
        return {
          budget: acc.budget + placement.budget,
          impressions: acc.impressions + placement.impressions
        };
      },
      { budget: 0, impressions: 0 }
    );
  };
  
  // Handle adding a new placement
  const handleAddPlacement = () => {
    if (campaignData.platforms.length === 0) {
      alert('Please select at least one platform in the Platform Selection step.');
      return;
    }
    
    const defaultPlatform = campaignData.platforms[0];
    const defaults = PLATFORM_DEFAULTS[defaultPlatform.toLowerCase()] || PLATFORM_DEFAULTS.default;
    
    const newPlacement = {
      platform: defaultPlatform,
      format: defaults.format,
      placement: defaults.placement,
      budget: 0,
      impressions: 0,
      cpm: defaults.cpm
    };
    
    updateMediaPlan({
      ...mediaPlan,
      placements: [...mediaPlan.placements, newPlacement]
    });
    
    // Go into edit mode for the new placement
    setEditMode(true);
    setEditingRowIndex(mediaPlan.placements.length);
    setEditingPlacement(newPlacement);
  };
  
  // Handle removing a placement
  const handleRemovePlacement = (index: number) => {
    const updatedPlacements = [...mediaPlan.placements];
    updatedPlacements.splice(index, 1);
    
    updateMediaPlan({
      ...mediaPlan,
      placements: updatedPlacements
    });
  };
  
  // Handle editing a placement
  const handleEditPlacement = (index: number) => {
    setEditMode(true);
    setEditingRowIndex(index);
    setEditingPlacement({...mediaPlan.placements[index]});
  };
  
  // Handle saving an edited placement
  const handleSavePlacement = () => {
    if (editingRowIndex === null || !editingPlacement) return;
    
    const updatedPlacements = [...mediaPlan.placements];
    
    // Calculate impressions based on budget and CPM
    const impressions = (editingPlacement.budget / editingPlacement.cpm) * 1000;
    editingPlacement.impressions = impressions;
    
    updatedPlacements[editingRowIndex] = editingPlacement;
    
    updateMediaPlan({
      ...mediaPlan,
      placements: updatedPlacements
    });
    
    setEditMode(false);
    setEditingRowIndex(null);
    setEditingPlacement(null);
  };
  
  // Handle canceling placement edit
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingRowIndex(null);
    setEditingPlacement(null);
  };
  
  // Handle changes to the editing placement
  const handleEditingChange = (field: string, value: any) => {
    if (!editingPlacement) return;
    
    setEditingPlacement({
      ...editingPlacement,
      [field]: value
    });
  };
  
  // Handle updating IO status
  const handleUpdateIOStatus = (status: 'draft' | 'ready' | 'signed') => {
    updateMediaPlan({
      ...mediaPlan,
      ioStatus: status
    });
  };
  
  // Check if the media plan is empty
  const isMediaPlanEmpty = mediaPlan.placements.length === 0;
  
  // Get total budget and impressions
  const totals = calculateTotals();
  
  // Generate download links for the media plan and IO
  const handleDownloadMediaPlan = () => {
    // Create CSV content for media plan
    let csvContent = "Platform,Format,Placement,Budget,CPM,Estimated Impressions\n";
    
    // Add each placement as a row in the CSV
    mediaPlan.placements.forEach(placement => {
      csvContent += `${placement.platform},${placement.format},${placement.placement},${placement.budget.toFixed(2)},${placement.cpm.toFixed(2)},${Math.round(placement.impressions)}\n`;
    });
    
    // Add totals row
    csvContent += `TOTAL,,,${totals.budget.toFixed(2)},${totals.impressions > 0 ? ((totals.budget / totals.impressions) * 1000).toFixed(2) : 0},${Math.round(totals.impressions)}\n`;
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MediaPlan_${mediaPlan.ioNumber}_${new Date().toISOString().split('T')[0]}.csv`);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadIO = () => {
    // In a real application, this would generate a PDF with the IO details
    // For this example, we'll just create a simple text representation as a downloadable file
    
    // Format dates
    const startDate = new Date(mediaPlan.startDate).toLocaleDateString();
    const endDate = new Date(mediaPlan.endDate).toLocaleDateString();
    
    // Create IO content with formatting
    let ioContent = `
INSERTION ORDER (IO)
====================

IO Number: ${mediaPlan.ioNumber}
Status: ${mediaPlan.ioStatus.toUpperCase()}
Date Created: ${new Date().toLocaleDateString()}

CAMPAIGN DETAILS
---------------
Campaign Timeline: ${startDate} to ${endDate}
Total Budget: ${formatCurrency(totals.budget)}
Estimated Impressions: ${formatNumber(totals.impressions)}

MEDIA PLACEMENTS
---------------
`;

    // Add each placement
    mediaPlan.placements.forEach((placement, index) => {
      ioContent += `
Placement ${index + 1}:
  Platform: ${placement.platform}
  Format: ${placement.format}
  Placement: ${placement.placement}
  Budget: ${formatCurrency(placement.budget)}
  CPM: $${placement.cpm.toFixed(2)}
  Estimated Impressions: ${formatNumber(placement.impressions)}
`;
    });

    // Add signature section
    ioContent += `
AUTHORIZATION
------------
This Insertion Order represents an agreement between the Advertiser and Publisher.

Advertiser: ________________________     Date: __________

Publisher: _________________________     Date: __________
`;

    // Create a download link for text file
    const blob = new Blob([ioContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `InsertionOrder_${mediaPlan.ioNumber}_${new Date().toISOString().split('T')[0]}.txt`);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to open campaign creator
  const openCampaignCreator = () => {
    // Check if media plan has valid placements
    if (!mediaPlan || !mediaPlan.placements || mediaPlan.placements.length === 0) {
      alert('Please generate a media plan first before creating campaigns.');
      return;
    }
    
    // Validate that each placement has the required data
    const invalidPlacements = mediaPlan.placements.filter(
      p => !p.platform || !p.format || !p.placement || p.budget <= 0
    );
    
    if (invalidPlacements.length > 0) {
      alert('Some placements in your media plan are incomplete. Please ensure all placements have a platform, format, placement, and budget greater than zero.');
      return;
    }
    
    // All checks passed, open the campaign creator
    console.log('Opening campaign creator with media plan:', mediaPlan);
    setShowCampaignCreator(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Media Plan & Insertion Order</h2>
        <p className="text-gray-600 mt-2">
          Generate and customize your media plan and insertion order
        </p>
      </div>
      
      {isMediaPlanEmpty ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FontAwesomeIcon icon={faFileInvoiceDollar} className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Media Plan Yet</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Generate an AI-powered media plan based on your campaign objectives, platforms, and budget.
          </p>
          <button
            onClick={generateMediaPlan}
            disabled={generatingPlan}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {generatingPlan ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                Generate AI Media Plan
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Media Plan Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Media Plan</h3>
              </div>
              <div className="flex space-x-2">
                {!editMode && (
                  <>
                    <button
                      onClick={handleAddPlacement}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faPlusSquare} className="h-3 w-3 mr-1" />
                      Add Placement
                    </button>
                    <button
                      onClick={generateMediaPlan}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faSyncAlt} className={`h-3 w-3 mr-1 ${generatingPlan ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                    <button
                      onClick={handleDownloadMediaPlan}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faDownload} className="h-3 w-3 mr-1" />
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Media Plan Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format / Placement
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPM
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Impressions
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mediaPlan.placements.map((placement, index) => (
                    <tr key={index} className={`${editingRowIndex === index ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {editingRowIndex === index ? (
                          <select
                            value={editingPlacement?.platform || ''}
                            onChange={(e) => handleEditingChange('platform', e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {campaignData.platforms.map((platform) => (
                              <option key={platform} value={platform}>{platform}</option>
                            ))}
                          </select>
                        ) : (
                          placement.platform
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {editingRowIndex === index ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingPlacement?.format || ''}
                              onChange={(e) => handleEditingChange('format', e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Format"
                            />
                            <input
                              type="text"
                              value={editingPlacement?.placement || ''}
                              onChange={(e) => handleEditingChange('placement', e.target.value)}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Placement"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">{placement.format}</div>
                            <div className="text-xs">{placement.placement}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {editingRowIndex === index ? (
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              value={editingPlacement?.budget || 0}
                              onChange={(e) => handleEditingChange('budget', parseFloat(e.target.value) || 0)}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        ) : (
                          formatCurrency(placement.budget)
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {editingRowIndex === index ? (
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={editingPlacement?.cpm || 0}
                              onChange={(e) => handleEditingChange('cpm', parseFloat(e.target.value) || 0)}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        ) : (
                          `$${placement.cpm.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(placement.impressions)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        {editingRowIndex === index ? (
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={handleSavePlacement}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon icon={faTimesCircle} className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleEditPlacement(index)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemovePlacement(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Totals row */}
                  <tr className="bg-gray-50 font-medium">
                    <td colSpan={2} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Total
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(totals.budget)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {totals.budget > 0 && totals.impressions > 0 
                        ? `$${((totals.budget / totals.impressions) * 1000).toFixed(2)}`
                        : '—'
                      }
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(totals.impressions)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Insertion Order */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-700">Insertion Order (IO)</h3>
              </div>
              <button
                onClick={handleDownloadIO}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faDownload} className="h-3 w-3 mr-1" />
                Download IO
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Campaign Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">IO Number:</span>
                      <span className="text-gray-900 font-medium">{mediaPlan.ioNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Start Date:</span>
                      <input
                        type="date"
                        value={mediaPlan.startDate}
                        onChange={(e) => updateMediaPlan({...mediaPlan, startDate: e.target.value})}
                        className="text-gray-900 border-0 p-0 bg-transparent text-right focus:ring-0"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">End Date:</span>
                      <input
                        type="date"
                        value={mediaPlan.endDate}
                        onChange={(e) => updateMediaPlan({...mediaPlan, endDate: e.target.value})}
                        className="text-gray-900 border-0 p-0 bg-transparent text-right focus:ring-0"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Budget:</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(totals.budget)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-700 mb-2">IO Status</h4>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpdateIOStatus('draft')}
                        className={`flex-1 py-2 text-xs font-medium rounded-l-md ${
                          mediaPlan.ioStatus === 'draft'
                            ? 'bg-blue-100 text-blue-800 border border-blue-500'
                            : 'bg-gray-100 text-gray-500 border border-gray-300'
                        }`}
                      >
                        Draft
                      </button>
                      <button
                        onClick={() => handleUpdateIOStatus('ready')}
                        className={`flex-1 py-2 text-xs font-medium ${
                          mediaPlan.ioStatus === 'ready'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-500'
                            : 'bg-gray-100 text-gray-500 border border-gray-300'
                        }`}
                      >
                        Ready for Signature
                      </button>
                      <button
                        onClick={() => handleUpdateIOStatus('signed')}
                        className={`flex-1 py-2 text-xs font-medium rounded-r-md ${
                          mediaPlan.ioStatus === 'signed'
                            ? 'bg-green-100 text-green-800 border border-green-500'
                            : 'bg-gray-100 text-gray-500 border border-gray-300'
                        }`}
                      >
                        Signed
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      {mediaPlan.ioStatus === 'draft' && 'IO is being prepared and is not yet ready for signature.'}
                      {mediaPlan.ioStatus === 'ready' && 'IO is ready and awaiting signature from advertiser.'}
                      {mediaPlan.ioStatus === 'signed' && 'IO has been signed and campaign is ready to launch.'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional IO notes */}
              <div className="mt-4">
                <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any special instructions or notes for the campaign..."
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Create Campaigns Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={openCampaignCreator}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FontAwesomeIcon icon={faRocket} className="h-4 w-4 mr-2" />
              Create Platform Campaigns
            </button>
          </div>
          
          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faCalculator} className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">AI Recommendations</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Based on your inputs, here are our recommendations for optimizing your media plan:</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Your budget allocation is {
                      totals.budget > 0 
                        ? Math.round((totals.budget / (
                            campaignData.budget.isDaily 
                              ? campaignData.budget.amount * campaignData.budget.duration 
                              : campaignData.budget.amount
                          )) * 100) 
                        : 0
                    }% of your total campaign budget.</li>
                    <li>Consider allocating more budget to high-performing platforms for your industry.</li>
                    <li>For best results, we recommend a minimum campaign duration of 30 days.</li>
                    <li>Download your media plan to share with stakeholders and approvers.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Media Plan Suggestions */}
      {showAiSuggestions && aiSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">AI Optimization Insights</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="space-y-1 list-disc list-inside">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Campaign Creator Modal */}
      {showCampaignCreator && (
        <PlatformCampaignCreator
          campaignData={campaignData}
          mediaPlan={campaignData.mediaPlan}
          onClose={() => setShowCampaignCreator(false)}
        />
      )}
    </div>
  );
};

export default MediaPlanIO; 