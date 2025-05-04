import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faCheckCircle,
  faArrowUp,
  faEye,
  faTimes,
  faChartLine,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import AnalysisModal from './AnalysisModal';

const RecommendationsPanel: React.FC = () => {
  // State for the analysis modal
  const [modalOpen, setModalOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState('');
  
  // Function to open the modal with a specific analysis type
  const openAnalysis = (type: string) => {
    setAnalysisType(type);
    setModalOpen(true);
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">AI-powered Recommendations</h2>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Updated 2h ago</span>
        </div>
      </div>
      <div className="p-6">
        <ul className="space-y-8">
          {/* Recommendation 1: Instagram Shopping - More specific with exact metrics */}
          <li className="flex pb-6">
            <div className="flex-shrink-0 mr-4">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faBolt} className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Instagram Shopping Campaign - #INS-45782</p>
                <span className="text-xs text-green-600 font-medium">High impact</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                This campaign is delivering a 3.7x ROAS over the last 14 days, which is 42% higher than your account average. 
                Data shows that increasing daily budget from $120 to $150 (25% increase) could capture an estimated 
                18-22 additional conversions per week based on current performance metrics.
              </p>
              <div className="flex space-x-3">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5 h-3 w-3" />
                  Apply Budget Increase
                </button>
                <button 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center"
                  onClick={() => openAnalysis('forecast')}
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1.5 h-3 w-3" />
                  View Forecast Analysis
                </button>
                <button className="px-3 py-1.5 text-gray-400 text-xs hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faTimes} className="mr-1.5 h-3 w-3" />
                  Dismiss
                </button>
              </div>
            </div>
          </li>

          {/* Recommendation 2: Facebook Testimonial Ads - More specific creative suggestion */}
          <li className="flex pb-6">
            <div className="flex-shrink-0 mr-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowUp} className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Facebook Product Ad Creative Optimization</p>
                <span className="text-xs text-blue-600 font-medium">Medium impact</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Analysis of your 8 active ad sets shows that creatives featuring customer testimonials have a 28.7% higher CTR 
                and 17.3% lower CPA. Specifically, testimonials highlighting product durability and value-for-money are resonating best 
                with your 35-49 age demographic. We recommend generating 3 new creative variations using testimonials from verified purchasers 
                Jessica T. and Michael R., whose reviews received the highest engagement on your website.
              </p>
              <div className="flex space-x-3">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5 h-3 w-3" />
                  Generate Testimonial Creatives
                </button>
                <button 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center"
                  onClick={() => openAnalysis('performance-data')}
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1.5 h-3 w-3" />
                  View Performance Data
                </button>
                <button className="px-3 py-1.5 text-gray-400 text-xs hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faTimes} className="mr-1.5 h-3 w-3" />
                  Dismiss
                </button>
              </div>
            </div>
          </li>

          {/* Recommendation 3: Schedule Optimization - More specific time recommendations */}
          <li className="flex pb-6">
            <div className="flex-shrink-0 mr-4">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Campaign Schedule Optimization</p>
                <span className="text-xs text-yellow-600 font-medium">Medium impact</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Last 30-day data reveals specific high-performance time windows: Saturday (10am-1pm) and Sunday (11am-2pm) show 
                42% higher conversion rates while weekday evenings (6:30pm-8:45pm) outperform other times by 31%. Reallocating 
                40% of your budget from morning hours (8am-11am) to these peak times could increase overall conversion 
                volume by approximately 23-27% without additional spend. This pattern is particularly strong in your 
                "Summer Collection" campaign group.
              </p>
              <div className="flex space-x-3">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5 h-3 w-3" />
                  Apply Optimized Schedule
                </button>
                <button 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center"
                  onClick={() => openAnalysis('hourly-performance')}
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1.5 h-3 w-3" />
                  View Hourly Performance
                </button>
                <button className="px-3 py-1.5 text-gray-400 text-xs hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faTimes} className="mr-1.5 h-3 w-3" />
                  Dismiss
                </button>
              </div>
            </div>
          </li>

          {/* Recommendation 4: Google Audience Expansion - More specific audiences */}
          <li className="flex pb-6">
            <div className="flex-shrink-0 mr-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Google Ads Audience Expansion</p>
                <span className="text-xs text-purple-600 font-medium">Medium impact</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Your "Home Decor Enthusiasts" and "DIY Homeowners" similar audiences are performing 28% better than 
                other segments with a $32.75 CPA (vs. $45.20 account average). We recommend creating three expanded 
                audience segments: "Home Renovation Planners" with in-market signals, "Interior Design Professionals" with 
                job title targeting, and "Home Improvement Content Viewers" based on YouTube engagement. This expansion 
                could reach approximately 142,000 additional prospects with similar conversion potential.
              </p>
              <div className="flex space-x-3">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5 h-3 w-3" />
                  Create Expanded Audiences
                </button>
                <button 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center"
                  onClick={() => openAnalysis('audience-insights')}
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1.5 h-3 w-3" />
                  Review Audience Insights
                </button>
                <button className="px-3 py-1.5 text-gray-400 text-xs hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faTimes} className="mr-1.5 h-3 w-3" />
                  Dismiss
                </button>
              </div>
            </div>
          </li>

          {/* Recommendation 5: Retargeting Optimization - More specific segment recommendations */}
          <li className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Cart Abandonment Retargeting Strategy</p>
                <span className="text-xs text-red-600 font-medium">High impact</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Cart abandoners from the past 7 days have a 68.5% higher conversion probability when shown sequential 
                creative messaging. Based on product page analysis, customers who viewed "Premium Collection" items 
                (SKUs #PR-120, #PR-135, #PR-142) for 3+ minutes but didn't purchase represent your highest-value abandoned 
                segment. Implementing a 3-step sequential retargeting flow with increasing urgency/offer value could 
                recover approximately $8,700 in abandoned cart revenue per month based on current traffic patterns.
              </p>
              <div className="flex space-x-3">
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1.5 h-3 w-3" />
                  Set Up Sequential Retargeting
                </button>
                <button 
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center"
                  onClick={() => openAnalysis('abandonment-analysis')}
                >
                  <FontAwesomeIcon icon={faEye} className="mr-1.5 h-3 w-3" />
                  View Abandonment Analysis
                </button>
                <button className="px-3 py-1.5 text-gray-400 text-xs hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
                  <FontAwesomeIcon icon={faTimes} className="mr-1.5 h-3 w-3" />
                  Dismiss
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      {/* Analysis Modal */}
      <AnalysisModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        analysisType={analysisType} 
      />
    </div>
  );
};

export default RecommendationsPanel; 