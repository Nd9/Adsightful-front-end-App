import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faDesktop, 
  faUsers,
  faChartBar,
  faSpinner,
  faPlus,
  faFolderOpen,
  faUpload,
  faEllipsisH,
  faInfoCircle,
  faExternalLinkAlt,
  faDownload,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import Card from './common/Card';
import Button from './common/Button';
import { authService } from '../services/auth';
import { audienceStrategyService, SavedStrategy } from '../services/audienceStrategy';
import { generateAdCreatives } from '../services/openai/imageGeneration';
import { checkOpenAIConfig } from '../services/openai/useOpenAI';

interface CreativeAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'ad';
  url: string;
  dimensions: string;
  platform: string;
  thumbnail: string;
  createdAt: string;
  prompt?: string;
}

const CreativeAssetLibrary: React.FC = () => {
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<SavedStrategy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assets, setAssets] = useState<CreativeAsset[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos' | 'ads'>('all');
  const [selectedAsset, setSelectedAsset] = useState<CreativeAsset | null>(null);
  const [showAssetDetail, setShowAssetDetail] = useState(false);
  const [openAIConfig, setOpenAIConfig] = useState<ReturnType<typeof checkOpenAIConfig> | null>(null);

  // Load saved strategies and check OpenAI config when component mounts
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const strategies = audienceStrategyService.getUserStrategies(user.id);
      setSavedStrategies(strategies);
    }
    
    // Check OpenAI configuration
    const config = checkOpenAIConfig();
    setOpenAIConfig(config);
    console.log('OpenAI Configuration:', config);
  }, []);

  // Generate ad creatives using OpenAI
  const generateCreatives = async () => {
    if (!selectedStrategy) {
      console.error('No strategy selected');
      return;
    }
    
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user found');
      return;
    }
    
    console.log('Generating creatives with strategy:', selectedStrategy.name);
    console.log('User:', user.email, user.companyName);
    
    setIsGenerating(true);
    
    try {
      // Call OpenAI image generation service
      console.log('Calling generateAdCreatives...');
      const results = await generateAdCreatives(selectedStrategy, user);
      console.log('Generated results:', results);
      
      if (results.length === 0) {
        console.error('No results returned from generateAdCreatives');
        return;
      }
      
      // Convert results to asset format
      const newAssets: CreativeAsset[] = results.map((result, index) => ({
        id: `generated-${Date.now()}-${index}`,
        name: `${result.platform} Ad - ${selectedStrategy.audienceBrief.personas[0].name}`,
        type: 'ad',
        url: result.url,
        dimensions: result.dimensions,
        platform: result.platform,
        thumbnail: result.url,
        createdAt: new Date().toISOString(),
        prompt: result.prompt
      }));
      
      console.log('Created new assets:', newAssets.length);
      
      // Add new assets to the list
      setAssets(prev => [...prev, ...newAssets]);
    } catch (error) {
      console.error('Failed to generate creatives:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct test of API connection
  const testApiConnection = async () => {
    setIsGenerating(true);
    console.log('Testing OpenAI API connection...');
    
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      console.log('API Key present:', !!apiKey);
      console.log('API Key length:', apiKey?.length || 0);
      
      // Use the OpenAI SDK directly to test connection
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('OpenAI API test response:', data);
      
      if (response.ok) {
        alert('OpenAI API connection successful! See console for details.');
      } else {
        alert(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('API test failed:', error);
      alert(`API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const viewAssetDetail = (asset: CreativeAsset) => {
    setSelectedAsset(asset);
    setShowAssetDetail(true);
  };

  const closeAssetDetail = () => {
    setShowAssetDetail(false);
    setSelectedAsset(null);
  };

  const downloadAsset = (asset: CreativeAsset) => {
    // Create a temporary anchor element to download the image
    const a = document.createElement('a');
    a.href = asset.url;
    a.download = `${asset.platform}-ad-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredAssets = activeTab === 'all' 
    ? assets 
    : assets.filter(asset => asset.type === activeTab.slice(0, -1)); // Remove 's' from the end

  // Render asset detail modal
  const renderAssetDetailModal = () => {
    if (!selectedAsset) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-900">{selectedAsset.name}</h3>
            <button
              onClick={closeAssetDetail}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                <img 
                  src={selectedAsset.url} 
                  alt={selectedAsset.name}
                  className="w-full object-contain"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => downloadAsset(selectedAsset)}
                  className="flex items-center"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download
                </Button>
                
                <Button
                  variant="secondary"
                  className="flex items-center"
                  onClick={() => window.open(selectedAsset.url, '_blank', 'noopener,noreferrer')}
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                  Open Original
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Asset Details</h4>
              
              <table className="w-full mb-6">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-sm font-medium text-gray-500">Platform</td>
                    <td className="py-2 text-sm text-gray-800">{selectedAsset.platform}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-sm font-medium text-gray-500">Dimensions</td>
                    <td className="py-2 text-sm text-gray-800">{selectedAsset.dimensions}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-sm font-medium text-gray-500">Created</td>
                    <td className="py-2 text-sm text-gray-800">{new Date(selectedAsset.createdAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              
              {selectedAsset.prompt && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-2" />
                    Generation Prompt
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700 h-64 overflow-y-auto">
                    {selectedAsset.prompt}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateMockAssetsWithoutStrategy = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('No user found for mock generation');
      return;
    }

    setIsGenerating(true);

    try {
      // Get dimensions for different platforms
      const platforms = ['Facebook', 'Instagram', 'LinkedIn', 'Google'];
      const newAssets: CreativeAsset[] = platforms.map((platform, index) => {
        let dimensions = '1200x628';
        let imageUrl = 'https://via.placeholder.com/1200x628/007BFF/FFFFFF';
        
        switch (platform) {
          case 'Instagram':
            dimensions = '1080x1080';
            imageUrl = 'https://via.placeholder.com/1080x1080/E1306C/FFFFFF';
            break;
          case 'LinkedIn':
            dimensions = '1200x627';
            imageUrl = 'https://via.placeholder.com/1200x627/0077B5/FFFFFF';
            break;
          case 'Google':
            dimensions = '300x250';
            imageUrl = 'https://via.placeholder.com/300x250/4285F4/FFFFFF';
            break;
        }
        
        // Add text to the placeholder image
        imageUrl += `?text=${encodeURIComponent(`${user.companyName} - ${platform} Ad`)}`;
        
        return {
          id: `mock-${Date.now()}-${index}`,
          name: `${platform} Ad - Sample`,
          type: 'ad',
          url: imageUrl,
          dimensions,
          platform,
          thumbnail: imageUrl,
          createdAt: new Date().toISOString(),
          prompt: `Mock ${platform} ad for ${user.companyName}`
        };
      });
      
      console.log('Created mock assets:', newAssets.length);
      setAssets(prev => [...prev, ...newAssets]);
    } catch (error) {
      console.error('Failed to generate mock assets:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Creative Asset Library</h2>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            className="flex items-center"
            onClick={testApiConnection}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
            Test API
          </Button>
          
          <Button
            variant="secondary"
            className="flex items-center"
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Upload
          </Button>
          
          <Button
            variant="secondary"
            className="flex items-center"
          >
            <FontAwesomeIcon icon={faFolderOpen} className="mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* OpenAI API Key Warning */}
      {openAIConfig && !openAIConfig.isConfigured && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>OpenAI API key not configured.</strong> To fix this issue:
              </p>
              <ol className="list-decimal pl-5 mt-2 text-sm text-yellow-700">
                <li>Create a file named <code>.env</code> in the root directory of the project</li>
                <li>Add your OpenAI API key: <code>REACT_APP_OPENAI_API_KEY=your_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
              <p className="text-sm text-yellow-700 mt-2">
                Until then, mock images will be generated instead of real AI-generated creatives.
              </p>
              <div className="mt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={testApiConnection}
                  className="text-xs"
                >
                  Test API Connection
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Audience Strategy Selector */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faUsers} className="text-blue-500 mr-2" />
              Audience Strategies
            </h3>
            
            {savedStrategies.length > 0 ? (
              <div className="space-y-3">
                {savedStrategies.map(strategy => (
                  <div 
                    key={strategy.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedStrategy?.id === strategy.id 
                        ? 'bg-blue-50 border border-blue-300' 
                        : 'bg-white border border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => setSelectedStrategy(strategy)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{strategy.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(strategy.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </div>
                    </div>
                    
                    {strategy.description && (
                      <p className="text-sm text-gray-600 mt-2">{strategy.description}</p>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      {strategy.audienceBrief.personas.length} personas
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No saved audience strategies found.</p>
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const event = new CustomEvent('setCurrentPage', { detail: 'audience-research' });
                      window.dispatchEvent(event);
                    }}
                  >
                    Create Strategy
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={generateMockAssetsWithoutStrategy}
                  >
                    Generate Test Images
                  </Button>
                </div>
              </div>
            )}

            {selectedStrategy && (
              <div className="mt-4">
                <Button
                  onClick={generateCreatives}
                  disabled={isGenerating}
                  fullWidth
                  className="flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Generating OpenAI Images...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Generate OpenAI Creatives
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Creative Assets */}
        <div className="lg:col-span-3">
          <Card>
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'all' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Assets
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'images' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('images')}
              >
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                Images
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'videos' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('videos')}
              >
                <FontAwesomeIcon icon={faDesktop} className="mr-2" />
                Videos
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'ads' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('ads')}
              >
                <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                Ads
              </button>
            </div>

            {filteredAssets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredAssets.map(asset => (
                  <div 
                    key={asset.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => viewAssetDetail(asset)}
                  >
                    <div className="relative">
                      <img 
                        src={asset.thumbnail} 
                        alt={asset.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {asset.dimensions}
                      </div>
                      <div className="absolute top-2 right-2">
                        <button 
                          className="bg-white rounded-full p-1 text-gray-600 hover:text-gray-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewAssetDetail(asset);
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800">{asset.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {asset.platform}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faImage} className="text-gray-400 h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No creative assets yet</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Select an audience strategy and generate creative assets optimized for your target audience.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {showAssetDetail && selectedAsset && renderAssetDetailModal()}
    </div>
  );
};

export default CreativeAssetLibrary; 