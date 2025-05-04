import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPalette,
  faChartPie,
  faBullseye,
  faImage,
  faVideo,
  faFont,
  faLightbulb,
  faRobot,
  faFilter,
  faSyncAlt,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faImages,
  faPercent,
  faDollarSign,
  faEye,
  faVolumeUp,
  faCommentAlt,
  faShare,
  faUserFriends,
  faCheckCircle,
  faExclamationTriangle,
  faTrophy,
  faHistory,
  faExchangeAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

// Creative Metrics component with role-based UI
const CreativeMetrics: React.FC = () => {
  // State to track selected role
  const [selectedRole, setSelectedRole] = useState<'designer' | 'marketing' | 'media'>('designer');
  
  // Helper function to get appropriate title based on role
  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'designer':
        return 'Creative Performance & Insights';
      case 'marketing':
        return 'Creative Strategy & Analysis';
      case 'media':
        return 'Creative Optimization & ROI';
      default:
        return 'Creative Metrics';
    }
  };

  // Role selection component
  const RoleSelector = () => (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">View dashboard as:</h3>
      <div className="flex flex-wrap gap-2">
        <button 
          className={`px-4 py-2 ${selectedRole === 'designer' ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium transition-colors duration-150`}
          onClick={() => setSelectedRole('designer')}
        >
          <FontAwesomeIcon icon={faPalette} className="mr-2" />
          Creative Director
        </button>
        <button 
          className={`px-4 py-2 ${selectedRole === 'marketing' ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium transition-colors duration-150`}
          onClick={() => setSelectedRole('marketing')}
        >
          <FontAwesomeIcon icon={faChartPie} className="mr-2" />
          Marketing Manager
        </button>
        <button 
          className={`px-4 py-2 ${selectedRole === 'media' ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium transition-colors duration-150`}
          onClick={() => setSelectedRole('media')}
        >
          <FontAwesomeIcon icon={faBullseye} className="mr-2" />
          Media Buyer
        </button>
      </div>
    </div>
  );

  // Creative Performance Overview
  const CreativePerformanceOverview = () => (
    <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Top Performing Creatives</h2>
        <p className="text-sm text-gray-500">Sorted by {selectedRole === 'designer' ? 'engagement rate' : selectedRole === 'marketing' ? 'ROAS' : 'CTR'}</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Creative Item 1 */}
          <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="h-20 w-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faImage} className="h-10 w-10 text-gray-400" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Summer Sale Banner</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FontAwesomeIcon icon={faArrowUp} className="h-3 w-3 mr-1" />
                  24%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Image • 1200x628px • Created 14d ago</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="text-xs">
                  <span className="text-gray-500">CTR:</span>
                  <span className="ml-1 font-medium text-gray-900">4.2%</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Conv Rate:</span>
                  <span className="ml-1 font-medium text-gray-900">2.8%</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">ROAS:</span>
                  <span className="ml-1 font-medium text-gray-900">3.4x</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creative Item 2 */}
          <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="h-20 w-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faVideo} className="h-10 w-10 text-gray-400" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Product Demo Video</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FontAwesomeIcon icon={faArrowUp} className="h-3 w-3 mr-1" />
                  18%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Video • 0:32 • Created 7d ago</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="text-xs">
                  <span className="text-gray-500">CTR:</span>
                  <span className="ml-1 font-medium text-gray-900">3.8%</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Completion:</span>
                  <span className="ml-1 font-medium text-gray-900">72%</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">ROAS:</span>
                  <span className="ml-1 font-medium text-gray-900">2.9x</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creative Item 3 */}
          <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="h-20 w-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faFont} className="h-10 w-10 text-gray-400" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Limited Time Offer</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <FontAwesomeIcon icon={faArrowDown} className="h-3 w-3 mr-1" />
                  5%
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Text Ad • Created 3d ago</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="text-xs">
                  <span className="text-gray-500">CTR:</span>
                  <span className="ml-1 font-medium text-gray-900">2.1%</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Conv Rate:</span>
                  <span className="ml-1 font-medium text-gray-900">1.5%</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">ROAS:</span>
                  <span className="ml-1 font-medium text-gray-900">1.7x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Creative Testing & Optimization
  const CreativeTestingOptimization = () => (
    <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">A/B Test Results</h2>
        <p className="text-sm text-gray-500">Key insights from recent creative tests</p>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          {/* Test Result 1 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Headline Test: Emotional vs. Feature-focused</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Variation A: "Transform Your Marketing Today"</p>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Variation B: "5 Powerful Features to Boost ROI"</p>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div style={{ width: "35%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-500"></div>
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">35%</span>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500">
                  <FontAwesomeIcon icon={faTrophy} className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>Winner: Variation A</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Statistical Confidence:</span>
                  <span className="ml-1 font-medium text-gray-900">96%</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-700">
                <FontAwesomeIcon icon={faLightbulb} className="h-3 w-3 text-yellow-500 mr-1" />
                <span>Emotional appeals outperform feature lists in this audience segment.</span>
              </div>
            </div>
          </div>
          
          {/* Test Result 2 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Image Test: Product vs. Lifestyle</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Variation A: Product on white background</p>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div style={{ width: "42%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-500"></div>
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Variation B: Product in lifestyle context</p>
                  <div className="mt-1 relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div style={{ width: "58%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-900">58%</span>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500">
                  <FontAwesomeIcon icon={faTrophy} className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>Winner: Variation B</span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Statistical Confidence:</span>
                  <span className="ml-1 font-medium text-gray-900">89%</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-700">
                <FontAwesomeIcon icon={faLightbulb} className="h-3 w-3 text-yellow-500 mr-1" />
                <span>Showing products in context helps customers visualize usage and increases CTR.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Creative Format Analysis
  const CreativeFormatAnalysis = () => (
    <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Format Performance Comparison</h2>
        <p className="text-sm text-gray-500">Analysis of creative formats across campaigns</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Format Card 1 */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faImage} className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Static Images</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Impressions</span>
                  <span className="text-xs font-medium text-gray-900">42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CTR</span>
                  <span className="text-xs font-medium text-gray-900">3.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CPA</span>
                  <span className="text-xs font-medium text-gray-900">$24.50</span>
                </div>
              </div>
            </div>
            
            {/* Format Card 2 */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faVideo} className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Video Ads</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Impressions</span>
                  <span className="text-xs font-medium text-gray-900">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CTR</span>
                  <span className="text-xs font-medium text-gray-900">4.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CPA</span>
                  <span className="text-xs font-medium text-gray-900">$18.75</span>
                </div>
              </div>
            </div>
            
            {/* Format Card 3 */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faVolumeUp} className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Audio Ads</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Impressions</span>
                  <span className="text-xs font-medium text-gray-900">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CTR</span>
                  <span className="text-xs font-medium text-gray-900">1.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CPA</span>
                  <span className="text-xs font-medium text-gray-900">$32.20</span>
                </div>
              </div>
            </div>
            
            {/* Format Card 4 */}
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faCommentAlt} className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Interactive</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Impressions</span>
                  <span className="text-xs font-medium text-gray-900">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CTR</span>
                  <span className="text-xs font-medium text-gray-900">5.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">CPA</span>
                  <span className="text-xs font-medium text-gray-900">$15.90</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Key Insight</h4>
                <p className="mt-1 text-xs text-gray-700">
                  {selectedRole === 'designer' ? 
                    'Interactive content shows the highest engagement, with 1.8x better CTR than static images. Consider incorporating interactive elements in upcoming creative projects.' : 
                   selectedRole === 'marketing' ? 
                    'Video and interactive formats show the best ROI, with interactive formats achieving a 35% lower CPA than static images. Reallocate budget towards these formats for improved efficiency.' : 
                    'Interactive and video formats consistently outperform other formats across platforms. These formats show 25-40% better ROAS and should be prioritized for ad spend.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Creative Recommendations
  const CreativeRecommendations = () => (
    <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">AI-Generated Recommendations</h2>
        <p className="text-sm text-gray-500">Actionable insights to improve creative performance</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Recommendation 1 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Update Call-to-Action Colors</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>CTAs using orange (#FF8800) outperform blue (#1250C4) by 18% in click-through rate. Consider updating your primary CTAs to this higher-performing color.</p>
                </div>
                <div className="mt-3">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      high impact
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      easy to implement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommendation 2 */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Create More Video Testimonials</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Customer testimonial videos have a 2.3x higher conversion rate than product-focused videos. Prioritize collecting and creating more customer success story content.</p>
                </div>
                <div className="mt-3">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      high impact
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      medium effort
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommendation 3 */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-purple-800">Refresh Underperforming Ad Sets</h3>
                <div className="mt-2 text-sm text-purple-700">
                  <p>5 ad sets have been running for 45+ days with declining performance. Refreshing creative on ads with 20%+ performance drop can restore 40-60% of original performance.</p>
                </div>
                <div className="mt-3">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      urgent
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      medium effort
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // AI Assistant button (floating)
  const AIAssistant = () => (
    <div className="fixed bottom-4 right-4">
      <button className="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-colors duration-150">
        <FontAwesomeIcon icon={faRobot} className="h-5 w-5" />
        <span className="sr-only">Get AI Insights</span>
      </button>
    </div>
  );

  const RenderRoleSpecificContent = () => {
    // Designer View
    if (selectedRole === 'designer') {
      return (
        <>
          <CreativePerformanceOverview />
          <CreativeTestingOptimization />
          <CreativeFormatAnalysis />
          <CreativeRecommendations />
        </>
      );
    }
    
    // Marketing Manager View
    if (selectedRole === 'marketing') {
      return (
        <>
          <CreativeRecommendations />
          <CreativeFormatAnalysis />
          <CreativePerformanceOverview />
          <CreativeTestingOptimization />
        </>
      );
    }
    
    // Media Buyer View
    return (
      <>
        <CreativeFormatAnalysis />
        <CreativePerformanceOverview />
        <CreativeRecommendations />
        <CreativeTestingOptimization />
      </>
    );
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faImages} className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">{getRoleTitle()}</h1>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <FontAwesomeIcon icon={faFilter} className="h-5 w-5 text-gray-500 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <FontAwesomeIcon icon={faSyncAlt} className="h-5 w-5 text-gray-500 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
        
        {/* Role Selector */}
        <RoleSelector />
        
        {/* Role-specific content */}
        <RenderRoleSpecificContent />
        
        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </main>
  );
};

export default CreativeMetrics; 