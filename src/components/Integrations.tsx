import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlug, 
  faLink,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook,
  faGoogle,
  faTwitter,
  faLinkedin,
  faPinterest,
  faTiktok,
  faSnapchat,
  faAmazon
} from '@fortawesome/free-brands-svg-icons';

const Integrations: React.FC = () => {
  // State to track which platforms are integrated
  const [integratedPlatforms, setIntegratedPlatforms] = useState<{[key: string]: boolean}>({
    'facebook': false,
    'google': false,
    'twitter': false,
    'linkedin': false,
    'pinterest': false,
    'tiktok': false,
    'snapchat': false,
    'amazon': false
  });

  // Function to handle integration button click
  const handleIntegration = (platform: string) => {
    setIntegratedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  // Ad platforms data
  const adPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook Ads',
      icon: faFacebook,
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      description: 'Connect your Facebook Ads account to synchronize campaign data and analytics.'
    },
    {
      id: 'google',
      name: 'Google Ads',
      icon: faGoogle,
      color: 'bg-red-500',
      textColor: 'text-red-500',
      description: 'Integrate with Google Ads to import campaigns, ad groups, and performance metrics.'
    },
    {
      id: 'twitter',
      name: 'Twitter Ads',
      icon: faTwitter,
      color: 'bg-blue-400',
      textColor: 'text-blue-400',
      description: 'Sync your Twitter advertising campaigns and audience data.'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Ads',
      icon: faLinkedin,
      color: 'bg-blue-700',
      textColor: 'text-blue-700',
      description: 'Connect to LinkedIn Campaign Manager for B2B advertising analytics.'
    },
    {
      id: 'pinterest',
      name: 'Pinterest Ads',
      icon: faPinterest,
      color: 'bg-red-600',
      textColor: 'text-red-600',
      description: 'Import your Pinterest advertising data for comprehensive analytics.'
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads',
      icon: faTiktok,
      color: 'bg-black',
      textColor: 'text-black',
      description: 'Connect your TikTok Ads Manager to track performance and audience engagement.'
    },
    {
      id: 'snapchat',
      name: 'Snapchat Ads',
      icon: faSnapchat,
      color: 'bg-yellow-400',
      textColor: 'text-yellow-400',
      description: 'Integrate with Snapchat Ads to monitor campaign performance.'
    },
    {
      id: 'amazon',
      name: 'Amazon Ads',
      icon: faAmazon,
      color: 'bg-yellow-700',
      textColor: 'text-yellow-700',
      description: 'Connect to Amazon Advertising console to track sponsored products and display ads.'
    }
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Integrations Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPlug} className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Ad Platform Integrations</h1>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FontAwesomeIcon icon={faLink} className="h-5 w-5 text-gray-500 mr-2" />
              Sync All Connected
            </button>
          </div>
        </div>
        
        {/* Integration Status Card */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Integration Status</h2>
          <div className="flex flex-wrap gap-2">
            {adPlatforms.map(platform => (
              <span 
                key={`status-${platform.id}`}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  integratedPlatforms[platform.id] 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={platform.icon} className="h-3 w-3" />
                {platform.name}
                {integratedPlatforms[platform.id] && (
                  <FontAwesomeIcon icon={faCheck} className="h-3 w-3 ml-1" />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Ad Platform Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adPlatforms.map(platform => (
            <div key={platform.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className={`${platform.color} h-2`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-lg bg-opacity-10 ${platform.color.replace('bg-', 'bg-opacity-10 ')} ${platform.textColor}`}>
                    <FontAwesomeIcon icon={platform.icon} className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      integratedPlatforms[platform.id]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {integratedPlatforms[platform.id] ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{platform.description}</p>
                <button
                  onClick={() => handleIntegration(platform.id)}
                  className={`w-full flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    integratedPlatforms[platform.id]
                      ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 text-blue-700 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={integratedPlatforms[platform.id] ? faPlug : faPlug} 
                    className="mr-2 h-4 w-4" 
                  />
                  {integratedPlatforms[platform.id] ? 'Disconnect' : 'Integrate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* API Documentation Link */}
        <div className="mt-8 flex justify-center">
          <a 
            href="#" 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View API Documentation and Advanced Integration Options
          </a>
        </div>
      </div>
    </main>
  );
};

export default Integrations; 