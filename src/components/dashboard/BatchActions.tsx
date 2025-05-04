import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPause,
  faMoneyBill,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

const BatchActions: React.FC = () => {
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSelectAll = () => {
    setIsChecked(!isChecked);
    setSelectedCount(isChecked ? 0 : 54); // Total number of campaigns
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={isChecked}
                onChange={handleSelectAll}
              />
              <span className="ml-2 text-sm text-gray-700">
                {selectedCount} selected
              </span>
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              className={`px-4 py-2 rounded text-sm font-medium flex items-center ${
                selectedCount > 0 
                  ? 'bg-gray-700 text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } transition-colors duration-150`}
              disabled={selectedCount === 0}
            >
              <FontAwesomeIcon icon={faPause} className="mr-2 h-4 w-4" />
              Pause Selected
            </button>
            
            <button 
              className={`px-4 py-2 rounded text-sm font-medium flex items-center ${
                selectedCount > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-200 text-blue-400 cursor-not-allowed'
              } transition-colors duration-150`}
              disabled={selectedCount === 0}
            >
              <FontAwesomeIcon icon={faMoneyBill} className="mr-2 h-4 w-4" />
              Adjust Budget
            </button>
            
            <button className="px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors duration-150 flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
              New Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchActions; 