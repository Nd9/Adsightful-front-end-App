import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie, 
  faChartPie, 
  faUsers, 
  faBullseye, 
  faChartLine,
  faLightbulb,
  faQuestionCircle,
  faRobot,
  faInfoCircle,
  faFilter,
  faArrowUp,
  faArrowDown,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

// Audience Metrics component with role-based UI
const AudienceMetrics: React.FC = () => {
  // State to track selected role
  const [selectedRole, setSelectedRole] = useState<'business' | 'marketing' | 'media'>('business');
  
  // Helper function to get appropriate title based on role
  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'business':
        return 'Audience Performance Overview';
      case 'marketing':
        return 'Audience Analysis & Strategy';
      case 'media':
        return 'Audience Targeting & Optimization';
      default:
        return 'Audience Metrics';
    }
  };

  // Role selection component
  const RoleSelector = () => (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">View dashboard as:</h3>
      <div className="flex flex-wrap gap-2">
        <button 
          className={`px-4 py-2 ${selectedRole === 'business' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium transition-colors duration-150`}
          onClick={() => setSelectedRole('business')}
        >
          <FontAwesomeIcon icon={faUserTie} className="mr-2" />
          Business Owner
        </button>
        <button 
          className={`px-4 py-2 ${selectedRole === 'marketing' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium transition-colors duration-150`}
          onClick={() => setSelectedRole('marketing')}
        >
          <FontAwesomeIcon icon={faChartPie} className="mr-2" />
          Marketing Manager
        </button>
        <button 
          className={`px-4 py-2 ${selectedRole === 'media' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md text-sm font-medium transition-colors duration-150`}
          onClick={() => setSelectedRole('media')}
        >
          <FontAwesomeIcon icon={faBullseye} className="mr-2" />
          Media Buyer
        </button>
      </div>
    </div>
  );

  // Business Owner content
  const BusinessOwnerContent = () => (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-800">Audience Size</h3>
            <span className="text-xs text-green-600 font-medium">+12% ↑</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">587,400</p>
          <p className="text-xs text-gray-500 mt-1">Total across all platforms</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-800">Conversion Rate</h3>
            <span className="text-xs text-green-600 font-medium">+0.5% ↑</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">3.4%</p>
          <p className="text-xs text-gray-500 mt-1">Avg. across all audiences</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-800">Revenue per User</h3>
            <span className="text-xs text-red-600 font-medium">-2.1% ↓</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$4.82</p>
          <p className="text-xs text-gray-500 mt-1">30-day average</p>
        </div>
      </div>
      
      {/* Top Audience Insight */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-900 mb-3">Top Audience Insight</h3>
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Potential Revenue Opportunity</p>
            <p className="text-xs text-gray-500">Based on audience performance</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          Your "Home Decor Enthusiasts" audience performs 42% better than other audiences.
          <strong> Increasing budget for this audience could generate an estimated $2,800 additional revenue this month.</strong>
        </p>
        <button className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors duration-150">
          Apply This Recommendation
        </button>
      </div>
      
      {/* Platform Performance */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-900 mb-4">Audience Performance by Platform</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Facebook</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$26,400</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">75% of revenue</span>
              <span className="text-xs text-green-600">3.8x ROAS</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Google</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$14,300</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: '42%' }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">42% of revenue</span>
              <span className="text-xs text-green-600">2.9x ROAS</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">TikTok</span>
              </div>
              <span className="text-sm font-medium text-gray-900">$8,200</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black" style={{ width: '24%' }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">24% of revenue</span>
              <span className="text-xs text-yellow-600">2.1x ROAS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Marketing Manager content
  const MarketingManagerContent = () => (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Audience Growth</h3>
            <span className="text-xs text-green-600">+14%</span>
          </div>
          <p className="text-xl font-bold text-gray-900">587.4K</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Avg. Engagement</h3>
            <span className="text-xs text-green-600">+3.2%</span>
          </div>
          <p className="text-xl font-bold text-gray-900">7.8%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Audience Overlap</h3>
            <span className="text-xs text-yellow-600">38%</span>
          </div>
          <p className="text-xl font-bold text-gray-900">Medium</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Cross-platform ROAS</h3>
            <span className="text-xs text-green-600">+0.3x</span>
          </div>
          <p className="text-xl font-bold text-gray-900">2.8x</p>
        </div>
      </div>
      
      {/* Audience Overlap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Cross-Platform Audience Overlap</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4" />
            </button>
          </div>
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
            {/* This would be an actual audience overlap chart */}
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">12%</span>
                  </div>
                  <svg width="150" height="120" viewBox="0 0 150 120">
                    <circle cx="60" cy="60" r="40" fillOpacity="0.5" fill="#4285F4" />
                    <circle cx="90" cy="60" r="40" fillOpacity="0.5" fill="#DB4437" />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
                  <span>Facebook</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Google</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-700">
              38% audience overlap between Facebook and Google indicates moderate audience redundancy. Consider refining targeting strategy.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Audience Segment Performance</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center p-2 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Home Decor Enthusiasts</h4>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-500">ROAS: <span className="text-green-600 font-medium">3.8x</span></span>
                  <span className="text-xs text-gray-500">CPA: <span className="text-green-600 font-medium">$32.75</span></span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-2 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowUp} className="text-green-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">DIY Homeowners</h4>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-500">ROAS: <span className="text-green-600 font-medium">3.4x</span></span>
                  <span className="text-xs text-gray-500">CPA: <span className="text-green-600 font-medium">$35.40</span></span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-2 bg-red-50 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowDown} className="text-red-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Urban Apartment Dwellers</h4>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-gray-500">ROAS: <span className="text-red-600 font-medium">1.7x</span></span>
                  <span className="text-xs text-gray-500">CPA: <span className="text-red-600 font-medium">$58.20</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Strategic Recommendations */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-900 mb-3">Strategic Audience Recommendations</h3>
        <div className="space-y-4">
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Expand "Home Renovation Planners" Audience</h4>
                <p className="mt-1 text-xs text-gray-600">
                  Testing on Facebook shows strong early results with Home Renovation Planners (3.6x ROAS). Expand this audience segment with similar interests across all platforms.
                </p>
                <div className="mt-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors duration-150">
                    View Audience Details
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faSyncAlt} className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Consolidate Overlapping Audiences</h4>
                <p className="mt-1 text-xs text-gray-600">
                  High overlap (62%) between "Interior Design Fans" and "Home Decor Enthusiasts" is causing audience competition. Consider consolidating these audiences to reduce redundancy.
                </p>
                <div className="mt-2">
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium hover:bg-yellow-200 transition-colors duration-150">
                    View Consolidation Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Media Buyer content
  const MediaBuyerContent = () => (
    <div className="space-y-6">
      {/* Detailed Performance Metrics */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Audience Performance Details</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Last 30 days</span>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience Segment</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROAS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Home Decor Enthusiasts</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                    <span>Facebook</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">482,360</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">3.8%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">3.2%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">$32.75</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">3.8x</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">DIY Homeowners</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                    <span>Google</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">365,140</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">2.9%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">3.0%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">$33.20</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">3.4x</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Interior Design Fans</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-black rounded-full mr-1"></div>
                    <span>TikTok</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">287,520</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-600">3.4%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-600">2.7%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-600">$38.45</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-yellow-600">2.4x</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Urban Apartment Dwellers</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                    <span>Facebook</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">195,670</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">1.8%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">1.4%</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">$58.20</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">1.7x</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Targeting Optimization */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-900 mb-3">Targeting Optimization</h3>
        <div className="space-y-3">
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Facebook Audience Refinement</h4>
                <p className="mt-1 text-xs text-gray-600">
                  Current: 28-65 age range, all genders, broad interests
                </p>
                <p className="mt-1 text-xs text-blue-700 font-medium">
                  Recommendation: Narrow to 28-42 age range, add home ownership as requirement
                </p>
                <div className="mt-2 flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors duration-150">
                    Apply Changes
                  </button>
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors duration-150">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Google In-Market Expansion</h4>
                <p className="mt-1 text-xs text-gray-600">
                  Current: Home Decor, DIY, Furniture Shopping
                </p>
                <p className="mt-1 text-xs text-green-700 font-medium">
                  Recommendation: Add "Home Improvement Services" and "Interior Design Services"
                </p>
                <div className="mt-2 flex space-x-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors duration-150">
                    Apply Changes
                  </button>
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50 transition-colors duration-150">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Frequency & Saturation */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Audience Frequency & Saturation</h3>
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-2">7-day view</span>
            <button className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faFilter} className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-700">Facebook - Home Decor Enthusiasts</span>
              <span className="text-xs font-medium text-yellow-600">Warning: High Frequency</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: '82%' }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Avg. frequency: 5.8</span>
              <span className="text-xs text-gray-500">Recommended: 2-4</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-700">Google - DIY Homeowners</span>
              <span className="text-xs font-medium text-green-600">Optimal</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Avg. frequency: 3.2</span>
              <span className="text-xs text-gray-500">Recommended: 2-4</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-700">TikTok - Interior Design Fans</span>
              <span className="text-xs font-medium text-blue-600">Low: Room for Growth</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '28%' }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Avg. frequency: 1.4</span>
              <span className="text-xs text-gray-500">Recommended: 2-4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render appropriate content based on selected role
  const renderContent = () => {
    switch (selectedRole) {
      case 'business':
        return <BusinessOwnerContent />;
      case 'marketing':
        return <MarketingManagerContent />;
      case 'media':
        return <MediaBuyerContent />;
      default:
        return <BusinessOwnerContent />;
    }
  };

  // AI Assistant button (floating)
  const AIAssistant = () => (
    <div className="fixed bottom-4 right-4">
      <button className="bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors duration-150">
        <FontAwesomeIcon icon={faRobot} className="h-5 w-5" />
        <span className="sr-only">Get AI Insights</span>
      </button>
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-purple-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">{getRoleTitle()}</h1>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FontAwesomeIcon icon={faFilter} className="h-5 w-5 text-gray-500 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <FontAwesomeIcon icon={faSyncAlt} className="h-5 w-5 text-gray-500 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
        
        {/* Role Selector */}
        <RoleSelector />
        
        {/* Dynamic Content Based on Role */}
        {renderContent()}
        
        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </main>
  );
};

export default AudienceMetrics; 