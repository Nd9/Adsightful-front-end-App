import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faArrowUp,
  faArrowDown,
  faHandPointer
} from '@fortawesome/free-solid-svg-icons';

const MetricsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Active Campaigns Card */}
      <div className="bg-white rounded-lg shadow p-6 metric-card border-l-4 border-blue-500" 
        data-tippy-content="<div class='tooltip-title'>Active Campaigns</div><div>Shows the total number of active ad campaigns across all platforms.</div><div class='mt-2'><b>12% increase</b> from previous period (48 campaigns)</div>">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
            <div className="flex items-end mt-2">
              <h3 className="text-3xl font-bold text-gray-900 data-update">54</h3>
              <span className="ml-2 flex items-center text-sm font-medium trend-up">
                <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5 mr-1" />
                12%
              </span>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <FontAwesomeIcon icon={faChartBar} className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">Compared to previous period</p>
          <button className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded transition-colors duration-150" aria-label="Show campaign details">
            Details
          </button>
        </div>
      </div>

      {/* Average CTR Card */}
      <div className="bg-white rounded-lg shadow p-6 metric-card border-l-4 border-green-500"
        data-tippy-content="<div class='tooltip-title'>Average CTR</div><div>Measures the Click-through Rate across all active campaigns.</div><div class='mt-2'><b>0.2% increase</b> from previous period (1.34%)</div><div>Industry benchmark: 1.2%</div>">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Average CTR</p>
            <div className="flex items-end mt-2">
              <h3 className="text-3xl font-bold text-gray-900 data-update">1.54%</h3>
              <span className="ml-2 flex items-center text-sm font-medium trend-up">
                <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5 mr-1" />
                0.2%
              </span>
            </div>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">Compared to industry benchmark (1.2%)</p>
          <button className="text-xs text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded transition-colors duration-150" aria-label="Show CTR breakdown">
            Breakdown
          </button>
        </div>
      </div>

      {/* Total Clicks Card */}
      <div className="bg-white rounded-lg shadow p-6 metric-card border-l-4 border-purple-500"
        data-tippy-content="<div class='tooltip-title'>Total Clicks</div><div>Measures the total number of clicks across all campaigns.</div><div class='mt-2'><b>18% increase</b> from previous period (1,944 clicks)</div>">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Clicks</p>
            <div className="flex items-end mt-2">
              <h3 className="text-3xl font-bold text-gray-900 data-update">2,292</h3>
              <span className="ml-2 flex items-center text-sm font-medium trend-up">
                <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5 mr-1" />
                18%
              </span>
            </div>
          </div>
          <div className="bg-purple-100 p-2 rounded-lg">
            <FontAwesomeIcon icon={faHandPointer} className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">Compared to previous period</p>
          <button className="text-xs text-purple-600 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded transition-colors duration-150" aria-label="Show click details">
            Details
          </button>
        </div>
      </div>

      {/* Total Spend Card */}
      <div className="bg-white rounded-lg shadow p-6 metric-card border-l-4 border-orange-500"
        data-tippy-content="<div class='tooltip-title'>Total Spend</div><div>Shows the total amount spent across all campaigns.</div><div class='mt-2'><b>5% decrease</b> from previous period ($3,169)</div><div>Currently 5% under allocated budget</div>">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Spend</p>
            <div className="flex items-end mt-2">
              <h3 className="text-3xl font-bold text-gray-900 data-update">$3,011</h3>
              <span className="ml-2 flex items-center text-sm font-medium trend-down">
                <FontAwesomeIcon icon={faArrowDown} className="h-5 w-5 mr-1" />
                5%
              </span>
            </div>
          </div>
          <div className="bg-orange-100 p-2 rounded-lg">
            <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">5% under budget</p>
          <button className="text-xs text-orange-600 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded transition-colors duration-150" aria-label="Show spend breakdown">
            Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsSection; 