import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faFilter,
  faChevronDown,
  faEllipsisH,
  faEdit,
  faChartBar,
  faPause,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook,
  faInstagram,
  faGoogle,
  faReddit
} from '@fortawesome/free-brands-svg-icons';

interface Campaign {
  id: number;
  platform: 'facebook' | 'instagram' | 'google' | 'reddit';
  name: string;
  type: string;
  status: 'high' | 'medium' | 'low';
  statusText: string;
  impressions: number;
  impressionsChange: number;
  clicks: number;
  clicksChange: number;
  ctr: number;
  ctrStatus: 'green' | 'yellow' | 'red';
  budget: number;
  spent: number;
  spentPercentage: number;
  conversions: number;
  conversionsChange: number;
}

// Sample data
const campaignData: Campaign[] = [
  {
    id: 1,
    platform: 'facebook',
    name: 'Always ON - Facebook',
    type: 'Conversion',
    status: 'low',
    statusText: 'Needs attention',
    impressions: 1282920,
    impressionsChange: 5,
    clicks: 45,
    clicksChange: -12,
    ctr: 0.35,
    ctrStatus: 'red',
    budget: 6510,
    spent: 921,
    spentPercentage: 14,
    conversions: 7,
    conversionsChange: -15,
  },
  {
    id: 2,
    platform: 'instagram',
    name: 'Interest: 19 - 25, Soccer fans',
    type: 'Awareness',
    status: 'high',
    statusText: 'Top performer',
    impressions: 2190182,
    impressionsChange: 18,
    clicks: 362,
    clicksChange: 23,
    ctr: 1.65,
    ctrStatus: 'green',
    budget: 3688,
    spent: 285,
    spentPercentage: 8,
    conversions: 46,
    conversionsChange: 32,
  },
  {
    id: 3,
    platform: 'google',
    name: 'Shopping - Summer Collection',
    type: 'Conversion',
    status: 'medium',
    statusText: 'Average',
    impressions: 762510,
    impressionsChange: 2,
    clicks: 142,
    clicksChange: 5,
    ctr: 1.86,
    ctrStatus: 'green',
    budget: 2200,
    spent: 1350,
    spentPercentage: 61,
    conversions: 22,
    conversionsChange: 8,
  },
  {
    id: 4,
    platform: 'facebook',
    name: 'Retargeting - Cart Abandoners',
    type: 'Conversion',
    status: 'high',
    statusText: 'Top performer',
    impressions: 358760,
    impressionsChange: -3,
    clicks: 215,
    clicksChange: 18,
    ctr: 5.99,
    ctrStatus: 'green',
    budget: 1800,
    spent: 950,
    spentPercentage: 53,
    conversions: 38,
    conversionsChange: 25,
  },
  {
    id: 5,
    platform: 'reddit',
    name: 'Subreddit: r/gaming',
    type: 'Awareness',
    status: 'low',
    statusText: 'Needs attention',
    impressions: 523890,
    impressionsChange: 15,
    clicks: 18,
    clicksChange: -22,
    ctr: 0.34,
    ctrStatus: 'red',
    budget: 1200,
    spent: 505,
    spentPercentage: 42,
    conversions: 3,
    conversionsChange: -30,
  }
];

const CampaignTable: React.FC = () => {
  const [campaigns] = useState<Campaign[]>(campaignData);
  const [sortField, setSortField] = useState<keyof Campaign | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map(campaign => campaign.id));
    }
    setAllSelected(!allSelected);
  };

  const toggleSelectCampaign = (id: number) => {
    if (selectedCampaigns.includes(id)) {
      setSelectedCampaigns(selectedCampaigns.filter(campaignId => campaignId !== id));
      if (allSelected) {
        setAllSelected(false);
      }
    } else {
      setSelectedCampaigns([...selectedCampaigns, id]);
      if (selectedCampaigns.length + 1 === campaigns.length) {
        setAllSelected(true);
      }
    }
  };

  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Campaign) => {
    if (sortField !== field) {
      return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400 h-3 w-3" />;
    }
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-600 h-3 w-3" />
      : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-600 h-3 w-3" />;
  };

  // Sort campaigns if sort field is set
  const sortedCampaigns = sortField 
    ? [...campaigns].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : campaigns;

  const renderPlatformIcon = (platform: 'facebook' | 'instagram' | 'google' | 'reddit') => {
    switch (platform) {
      case 'facebook':
        return <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 text-[#4267B2]" />;
      case 'instagram':
        return <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 text-[#C13584]" />;
      case 'google':
        return <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-[#4285F4]" />;
      case 'reddit':
        return <FontAwesomeIcon icon={faReddit} className="h-5 w-5 text-[#FF4500]" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-20">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Campaign Details</h2>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 text-sm flex items-center hover:bg-gray-50"
              onClick={toggleFilters}
            >
              <FontAwesomeIcon icon={faFilter} className="h-4 w-4 mr-1 text-gray-500" />
              Filters
              <FontAwesomeIcon icon={faChevronDown} className={`h-3 w-3 ml-1 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50">
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters section */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="platform-filter" className="block text-xs font-medium text-gray-700 mb-1">Platform</label>
              <select id="platform-filter" className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="google">Google</option>
                <option value="reddit">Reddit</option>
              </select>
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select id="status-filter" className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Status</option>
                <option value="high">Top performers</option>
                <option value="medium">Average</option>
                <option value="low">Needs attention</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget-filter" className="block text-xs font-medium text-gray-700 mb-1">Budget Range</label>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="Min" className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                <span className="text-gray-500">to</span>
                <input type="number" placeholder="Max" className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="type-filter" className="block text-xs font-medium text-gray-700 mb-1">Campaign Type</label>
              <select id="type-filter" className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Types</option>
                <option value="awareness">Awareness</option>
                <option value="conversion">Conversion</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">Reset</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Apply Filters</button>
          </div>
        </div>
      )}
      
      {/* Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center cursor-pointer" onClick={() => handleSort('platform')}>
                  Platform {getSortIcon('platform')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                  Campaign {getSortIcon('name')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('impressions')}>
                  Impressions {getSortIcon('impressions')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('clicks')}>
                  Clicks {getSortIcon('clicks')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('ctr')}>
                  CTR {getSortIcon('ctr')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('budget')}>
                  Budget {getSortIcon('budget')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('spent')}>
                  Spent {getSortIcon('spent')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('conversions')}>
                  Conversions {getSortIcon('conversions')}
                </span>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCampaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  campaign.status === 'low' ? 'bg-red-50' : campaign.status === 'high' ? 'bg-green-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedCampaigns.includes(campaign.id)}
                    onChange={() => toggleSelectCampaign(campaign.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                      {renderPlatformIcon(campaign.platform)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      {campaign.name}
                      <span className={`ml-2 inline-block h-2 w-2 rounded-full ${
                        campaign.status === 'high' ? 'bg-green-500' : 
                        campaign.status === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{campaign.type}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{campaign.impressions.toLocaleString()}</div>
                  <div className={`text-xs ${campaign.impressionsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {campaign.impressionsChange > 0 ? '+' : ''}{campaign.impressionsChange}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{campaign.clicks.toLocaleString()}</div>
                  <div className={`text-xs ${campaign.clicksChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {campaign.clicksChange > 0 ? '+' : ''}{campaign.clicksChange}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className={`text-sm font-medium ${
                    campaign.ctrStatus === 'green' ? 'text-green-600' : 
                    campaign.ctrStatus === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {campaign.ctr.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">${campaign.budget.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">${campaign.spent.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">{campaign.spentPercentage}% used</div>
                  <div className="w-16 h-1 bg-gray-200 rounded ml-auto mt-1">
                    <div 
                      className={`h-1 rounded ${
                        campaign.spentPercentage > 85 ? 'bg-red-500' : 
                        campaign.spentPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${campaign.spentPercentage}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{campaign.conversions}</div>
                  <div className={`text-xs ${campaign.conversionsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {campaign.conversionsChange > 0 ? '+' : ''}{campaign.conversionsChange}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="relative inline-block text-left">
                    <button className="bg-gray-100 rounded-full p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4 text-gray-500" />
                    </button>
                    {/* Dropdown menu would go here */}
                    <div className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                      <div className="py-1">
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <FontAwesomeIcon icon={faEdit} className="mr-3 h-4 w-4 text-gray-500" />
                          Edit
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <FontAwesomeIcon icon={faChartBar} className="mr-3 h-4 w-4 text-gray-500" />
                          View Reports
                        </button>
                      </div>
                      <div className="py-1">
                        <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                          <FontAwesomeIcon icon={faPause} className="mr-3 h-4 w-4 text-gray-500" />
                          Pause
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left">
                          <FontAwesomeIcon icon={faTrash} className="mr-3 h-4 w-4 text-red-500" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">54</span> campaigns
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                11
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTable; 