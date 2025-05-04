import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
  faCalendarAlt, 
  faGlobeAmericas,
  faInfoCircle,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface BudgetData {
  amount: number;
  isDaily: boolean;
  duration: number;
  countries: string[];
  regions: string[];
}

interface BudgetAndGeoProps {
  budget: BudgetData;
  updateBudget: (budget: BudgetData) => void;
}

// Common countries list
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
  'France', 'Italy', 'Spain', 'Japan', 'India', 'Brazil', 'Mexico'
];

const BudgetAndGeo: React.FC<BudgetAndGeoProps> = ({ 
  budget, 
  updateBudget 
}) => {
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  // Calculate estimated reach based on budget
  const estimateReach = () => {
    // This is a very simplified calculation - in a real app, this would be more sophisticated
    const dailyAmount = budget.isDaily ? budget.amount : budget.amount / budget.duration;
    const multiplier = 100; // Placeholder - would vary by platform, industry, etc.
    const estimatedDailyReach = dailyAmount * multiplier;
    const estimatedTotalReach = estimatedDailyReach * budget.duration;
    
    return {
      daily: Math.round(estimatedDailyReach),
      total: Math.round(estimatedTotalReach)
    };
  };

  // Add a country
  const handleAddCountry = () => {
    if (country && !budget.countries.includes(country)) {
      updateBudget({
        ...budget,
        countries: [...budget.countries, country]
      });
      setCountry('');
    }
  };

  // Remove a country
  const handleRemoveCountry = (country: string) => {
    updateBudget({
      ...budget,
      countries: budget.countries.filter(c => c !== country)
    });
  };

  // Add a region
  const handleAddRegion = () => {
    if (region && !budget.regions.includes(region)) {
      updateBudget({
        ...budget,
        regions: [...budget.regions, region]
      });
      setRegion('');
    }
  };

  // Remove a region
  const handleRemoveRegion = (region: string) => {
    updateBudget({
      ...budget,
      regions: budget.regions.filter(r => r !== region)
    });
  };

  const reach = estimateReach();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Budget & Geographic Targeting</h2>
        <p className="text-gray-600 mt-2">
          Set your campaign budget and where you want your ads to be shown
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 text-blue-500 mr-2" />
            Budget Settings
          </h3>
          
          <div className="space-y-4">
            {/* Budget Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Type
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={!budget.isDaily}
                    onChange={() => updateBudget({...budget, isDaily: false})}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Total Budget</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={budget.isDaily}
                    onChange={() => updateBudget({...budget, isDaily: true})}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Daily Budget</span>
                </label>
              </div>
            </div>
            
            {/* Budget Amount */}
            <div>
              <label htmlFor="budget-amount" className="block text-sm font-medium text-gray-700 mb-1">
                {budget.isDaily ? 'Daily Budget' : 'Total Budget'}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="budget-amount"
                  value={budget.amount}
                  onChange={(e) => updateBudget({...budget, amount: Number(e.target.value)})}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  min="1"
                  step="1"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
            </div>
            
            {/* Campaign Duration */}
            <div>
              <label htmlFor="campaign-duration" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Duration (days)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="campaign-duration"
                  value={budget.duration}
                  onChange={(e) => updateBudget({...budget, duration: Number(e.target.value)})}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="30"
                  min="1"
                  max="365"
                />
              </div>
            </div>
            
            {/* Estimated Reach */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="text-sm text-gray-700">
                <div className="font-medium mb-1">Estimated Reach</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">Daily:</span> ~{reach.daily.toLocaleString()} impressions
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span> ~{reach.total.toLocaleString()} impressions
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  <FontAwesomeIcon icon={faInfoCircle} className="h-3 w-3 mr-1" />
                  Estimates based on average industry rates
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Geographic Targeting Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faGlobeAmericas} className="h-5 w-5 text-blue-500 mr-2" />
            Geographic Targeting
          </h3>
          
          <div className="space-y-4">
            {/* Countries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Countries
              </label>
              <div className="flex">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                >
                  <option value="">Select a country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCountry}
                  disabled={!country}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                </button>
              </div>
              
              {/* Selected Countries */}
              {budget.countries.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {budget.countries.map((c, index) => (
                      <span key={index} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-blue-100 text-blue-700">
                        {c}
                        <button
                          type="button"
                          onClick={() => handleRemoveCountry(c)}
                          className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                        >
                          <FontAwesomeIcon icon={faTimes} className="h-2 w-2" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Regions/Cities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Regions or Cities (Optional)
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., New York, California, Toronto"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                />
                <button
                  type="button"
                  onClick={handleAddRegion}
                  disabled={!region}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm leading-4 font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
                </button>
              </div>
              
              {/* Selected Regions */}
              {budget.regions.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {budget.regions.map((r, index) => (
                      <span key={index} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-green-100 text-green-700">
                        {r}
                        <button
                          type="button"
                          onClick={() => handleRemoveRegion(r)}
                          className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none focus:bg-green-500 focus:text-white"
                        >
                          <FontAwesomeIcon icon={faTimes} className="h-2 w-2" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="mt-1 text-xs text-gray-500">
                Add specific regions or cities to narrow your targeting
              </p>
            </div>
            
            {/* Geo-Targeting Tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="text-sm text-blue-700">
                <div className="font-medium mb-1">Geo-Targeting Tips</div>
                <ul className="space-y-1 text-xs list-disc pl-4">
                  <li>Consider targeting regions where your business already has a presence</li>
                  <li>For local businesses, target within 10-15 miles of your location</li>
                  <li>Different regions may have different cost-per-click rates</li>
                  <li>Custom audience targeting can be more effective than broad geo-targeting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Budget Allocation Recommendations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Budget Allocation Recommendations</h3>
        <div className="text-sm text-gray-500">
          <p className="mb-3">
            Based on your selections, here's how we recommend allocating your budget:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-md shadow-sm">
              <div className="font-medium text-blue-700 mb-1">
                {budget.isDaily ? '$' + (budget.amount * 0.6).toFixed(2) + ' / day' : 
                  '$' + (budget.amount * 0.6).toFixed(2) + ' total'}
              </div>
              <div className="text-xs text-gray-600">Allocate 60% to your best-performing platforms</div>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <div className="font-medium text-blue-700 mb-1">
                {budget.isDaily ? '$' + (budget.amount * 0.3).toFixed(2) + ' / day' : 
                  '$' + (budget.amount * 0.3).toFixed(2) + ' total'}
              </div>
              <div className="text-xs text-gray-600">Allocate 30% to secondary platforms with good potential</div>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <div className="font-medium text-blue-700 mb-1">
                {budget.isDaily ? '$' + (budget.amount * 0.1).toFixed(2) + ' / day' : 
                  '$' + (budget.amount * 0.1).toFixed(2) + ' total'}
              </div>
              <div className="text-xs text-gray-600">Allocate 10% to testing new platforms or strategies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAndGeo; 