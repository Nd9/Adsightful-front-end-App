import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faExclamationCircle,
  faCheckCircle,
  faShield
} from '@fortawesome/free-solid-svg-icons';

const AlertsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Performance Insights & Alerts</h2>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
              3 Critical
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="h-3 w-3 mr-1" />
              5 Warnings
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 mr-1" />
              2 Opportunities
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Critical Alert */}
          <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg flex">
            <div className="flex-shrink-0 mr-3">
              <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-red-900">Budget Depletion Risk: 4 Facebook Campaigns</p>
                <span className="text-xs text-red-800 font-medium">Detected 2 hours ago</span>
              </div>
              <p className="text-sm text-red-700 mt-1">4 high-performing campaigns are projected to deplete their budget 7 days before month-end at current spend rates. Consider budget reallocation.</p>
              <div className="flex mt-2 space-x-2">
                <button className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors">
                  View Campaigns
                </button>
                <button className="text-xs px-3 py-1 border border-red-600 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors">
                  Adjust Budgets
                </button>
              </div>
            </div>
          </div>
          
          {/* Warning Alert */}
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg flex">
            <div className="flex-shrink-0 mr-3">
              <FontAwesomeIcon icon={faShield} className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-yellow-900">CTR Decline: Google Shopping Campaigns</p>
                <span className="text-xs text-yellow-800 font-medium">-18% vs last week</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">Your click-through rates for Shopping campaigns have declined significantly compared to last week. AI analysis suggests creative fatigue may be the cause.</p>
              <div className="flex mt-2 space-x-2">
                <button className="text-xs px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition-colors">
                  View Analysis
                </button>
                <button className="text-xs px-3 py-1 border border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 transition-colors">
                  Generate Creative Ideas
                </button>
              </div>
            </div>
          </div>
          
          {/* Opportunity Alert */}
          <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg flex">
            <div className="flex-shrink-0 mr-3">
              <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-green-900">New Opportunity: Facebook Campaigns</p>
                <span className="text-xs text-green-800 font-medium">Detected 1 day ago</span>
              </div>
              <p className="text-sm text-green-700 mt-1">A new campaign has been launched on Facebook. It's performing well above industry benchmarks. Consider expanding the budget.</p>
              <div className="flex mt-2 space-x-2">
                <button className="text-xs px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors">
                  View Campaign
                </button>
                <button className="text-xs px-3 py-1 border border-green-600 text-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors">
                  Analyze Performance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsSection; 