import React from 'react';
import MetricsSection from './dashboard/MetricsSection';
import PerformanceChart from './dashboard/PerformanceChart';
import CampaignTable from './dashboard/CampaignTable';
import DistributionChart from './dashboard/DistributionChart';
import QuickActions from './dashboard/QuickActions';

const Dashboard: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Campaign Info Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">Campaign level Metrics</h1>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg className="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Campaign
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg className="h-5 w-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <MetricsSection />

        {/* Performance Chart */}
        <PerformanceChart />

        {/* Campaign Details Table */}
        <CampaignTable />

        {/* Enhanced Campaign Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Distribution Chart - Left Column */}
          <div>
            <DistributionChart />
          </div>
          
          {/* Quick Actions - Right Column */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard; 