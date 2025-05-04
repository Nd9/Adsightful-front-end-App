import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faArrowDown,
  faArrowUp,
  faExclamationTriangle,
  faTag,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center p-3 bg-red-50 rounded-lg text-left hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Underperforming</p>
              <p className="text-xs text-gray-500 mt-1">8 campaigns need attention</p>
            </div>
          </button>
          
          <button className="flex items-center p-3 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Top Performers</p>
              <p className="text-xs text-gray-500 mt-1">12 campaigns doing well</p>
            </div>
          </button>
          
          <button className="flex items-center p-3 bg-yellow-50 rounded-lg text-left hover:bg-yellow-100 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Budget Alerts</p>
              <p className="text-xs text-gray-500 mt-1">5 campaigns over budget</p>
            </div>
          </button>
          
          <button className="flex items-center p-3 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Create Filter</p>
              <p className="text-xs text-gray-500 mt-1">Custom campaign filter</p>
            </div>
          </button>
        </div>
        
        <div className="border-t border-gray-100 mt-4 pt-4">
          <div className="flex justify-between space-x-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
              <FontAwesomeIcon icon={faTag} className="h-4 w-4 mr-2" />
              Campaign Tags
            </button>
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 mr-2" />
              Auto Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions; 