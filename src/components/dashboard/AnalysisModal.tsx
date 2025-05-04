import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChartLine, faCalendarAlt, faUsers, faBullseye, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { ForecastChart, HeatMapChart, CreativePerformanceChart, AudienceOverlapChart, AbandonmentChart } from './MockCharts';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisType: string;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, analysisType }) => {
  if (!isOpen) return null;

  const renderAnalysisContent = () => {
    switch (analysisType) {
      case 'forecast':
        return (
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Instagram Shopping Campaign Forecast Analysis</h3>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current ROAS</span>
                <span className="text-sm font-semibold text-green-600">3.7x</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Account Average ROAS</span>
                <span className="text-sm font-medium text-gray-600">2.6x</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Performance vs Average</span>
                <span className="text-sm font-semibold text-green-600">+42%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Current Daily Budget</span>
                <span className="text-sm font-medium text-gray-600">$120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Recommended Daily Budget</span>
                <span className="text-sm font-semibold text-blue-600">$150</span>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Weekly Performance Trends</h4>
            <div className="bg-white rounded-lg border border-gray-200 mb-4 p-3">
              <ForecastChart />
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Forecast Analysis</h4>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Our ML models analyzed your Instagram Shopping campaign performance data over the past 14 days alongside historical performance of similar campaigns in your industry. Key findings:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Campaign has maintained steady 3.7x ROAS over 2-week period with negligible variance (±0.2x)</li>
                <li>Current budget is being fully utilized with impression share at 85% of available inventory</li>
                <li>Market demand signals show additional 15% available audience in same targeting parameters</li>
                <li>With 25% budget increase, analytics predict 18-22 additional weekly conversions based on current conversion rate (3.2%)</li>
                <li>Forecast confidence: 92% based on performance stability and market consistency</li>
              </ul>
            </div>
          </div>
        );
      
      case 'performance-data':
        return (
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faLayerGroup} className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Facebook Creative Performance Analysis</h3>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Ad Creative Performance by Type</h4>
            <div className="bg-white rounded-lg border border-gray-200 mb-4 p-3">
              <CreativePerformanceChart />
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Top Testimonial Themes</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-xs text-gray-900 mb-1">Product Durability</div>
                <div className="text-xs text-gray-600">Engagement: <span className="text-green-600 font-medium">+37%</span></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-xs text-gray-900 mb-1">Value for Money</div>
                <div className="text-xs text-gray-600">Engagement: <span className="text-green-600 font-medium">+34%</span></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-xs text-gray-900 mb-1">Customer Service</div>
                <div className="text-xs text-gray-600">Engagement: <span className="text-gray-600">+12%</span></div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-xs text-gray-900 mb-1">Ease of Use</div>
                <div className="text-xs text-gray-600">Engagement: <span className="text-gray-600">+9%</span></div>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Top Customer Testimonials</h4>
            <div className="space-y-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 italic">"I've tried similar products from 3 other brands, but yours has lasted twice as long with daily use. Definitely worth the investment." - Jessica T.</p>
                <p className="text-xs text-blue-600 mt-1">Site Engagement: 147 reactions, 32 comments</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 italic">"Initially hesitant about the price, but after 6 months of use I can honestly say it's been worth every penny. Quality that speaks for itself." - Michael R.</p>
                <p className="text-xs text-blue-600 mt-1">Site Engagement: 123 reactions, 28 comments</p>
              </div>
            </div>
          </div>
        );
      
      case 'hourly-performance':
        return (
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Campaign Schedule Analysis</h3>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Hourly Performance Heat Map</h4>
            <div className="bg-white rounded-lg border border-gray-200 mb-4 p-3">
              <HeatMapChart />
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Performance by Time Segment</h4>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Segment</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Alloc.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-green-50">
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Weekend (10am-2pm)</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">4.7%</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">$22.40</td>
                    <td className="px-3 py-2 text-xs text-gray-600">18%</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Weekday (6:30pm-8:45pm)</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">4.3%</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">$24.75</td>
                    <td className="px-3 py-2 text-xs text-gray-600">22%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Weekday (8am-11am)</td>
                    <td className="px-3 py-2 text-xs text-gray-600">2.8%</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$38.20</td>
                    <td className="px-3 py-2 text-xs text-red-600 font-medium">40%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Other times</td>
                    <td className="px-3 py-2 text-xs text-gray-600">3.1%</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$35.60</td>
                    <td className="px-3 py-2 text-xs text-gray-600">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Insights</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-4">
              <li>Weekend mid-day hours consistently outperform by 42% vs. average</li>
              <li>Weekday evening performance spiked in the past 2 weeks, now 31% above average</li>
              <li>Morning budget allocation (40%) shows poorest ROI with highest CPA</li>
              <li>"Summer Collection" campaigns show strongest time variance pattern</li>
              <li>Competitive analysis shows lower ad competition during weekend hours</li>
            </ul>
          </div>
        );
        
      case 'audience-insights':
        return (
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faBullseye} className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Cross-Platform Audience Analysis</h3>
            </div>
            
            {/* Platform Source Selector */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                All Platforms
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-full flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                Facebook
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-full flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                Google
              </button>
              <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-full flex items-center">
                <div className="w-2 h-2 bg-black rounded-full mr-1"></div>
                TikTok
              </button>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Top Performing Segments</h4>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROAS</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-purple-50">
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Home Decor Enthusiasts</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                        <span className="text-xs text-gray-600">Facebook</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">$32.75</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">2.8x</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">3.2%</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">DIY Homeowners</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-xs text-gray-600">Google</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">$33.20</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">2.5x</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">3.0%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Interior Design Fans</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-black rounded-full mr-1"></div>
                        <span className="text-xs text-gray-600">TikTok</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-yellow-600 font-medium">$38.45</td>
                    <td className="px-3 py-2 text-xs text-yellow-600 font-medium">2.2x</td>
                    <td className="px-3 py-2 text-xs text-yellow-600 font-medium">2.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Performance by Platform</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex justify-between mb-2">
                    <div className="text-xs font-medium text-gray-500">Platform</div>
                    <div className="text-xs font-medium text-gray-500">Avg CPA</div>
                  </div>
                  
                  {/* Platform Bars */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                          <span className="text-xs text-gray-800">Facebook</span>
                        </div>
                        <span className="text-xs text-gray-800">$35.20</span>
                      </div>
                      <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          <span className="text-xs text-gray-800">Google</span>
                        </div>
                        <span className="text-xs text-gray-800">$38.90</span>
                      </div>
                      <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-black rounded-full mr-1"></div>
                          <span className="text-xs text-gray-800">TikTok</span>
                        </div>
                        <span className="text-xs text-gray-800">$42.60</span>
                      </div>
                      <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Cross-Platform Audience Overlap</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <AudienceOverlapChart />
                </div>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Unified Audience Insights</h4>
            <div className="p-3 bg-purple-50 rounded-lg mb-4">
              <p className="text-xs text-gray-700 mb-2">
                <span className="font-medium">Key Finding:</span> Your audience engagement patterns show strong similarities across platforms, with a 38% overlap between Facebook and Google audiences.
              </p>
              <p className="text-xs text-gray-700 mb-2">
                <span className="font-medium">Unified Persona:</span> Primary audience is 28-45, homeowners interested in interior design and DIY projects, with higher engagement on weekends.
              </p>
              <p className="text-xs text-gray-700">
                <span className="font-medium">Cross-Platform Recommendation:</span> Create consistent messaging with platform-specific creative formats to reinforce brand identity across channels.
              </p>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Platform-Specific Audience Opportunities</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                  <div className="font-medium text-xs text-gray-900">Facebook Opportunity</div>
                </div>
                <p className="text-xs text-gray-600 mb-2">Home Renovation Planners showing strong engagement with carousel ads</p>
                <p className="text-xs text-purple-600">Est. additional ROAS: +0.4x</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  <div className="font-medium text-xs text-gray-900">Google Opportunity</div>
                </div>
                <p className="text-xs text-gray-600 mb-2">In-market segments for "kitchen renovation" showing higher CTR</p>
                <p className="text-xs text-purple-600">Est. additional ROAS: +0.3x</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-black rounded-full mr-1"></div>
                  <div className="font-medium text-xs text-gray-900">TikTok Opportunity</div>
                </div>
                <p className="text-xs text-gray-600 mb-2">DIY video viewers aged 25-34 showing highest engagement rates</p>
                <p className="text-xs text-purple-600">Est. additional ROAS: +0.5x</p>
              </div>
            </div>
          </div>
        );
        
      case 'abandonment-analysis':
        return (
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">Cart Abandonment Analysis</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Abandonment by Product Line</h4>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <AbandonmentChart />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Session Duration vs. Conversion</h4>
                <div className="h-32 bg-white rounded-lg border border-gray-200 p-3 flex items-center justify-center">
                  {/* Placeholder for chart */}
                  <span className="text-xs text-gray-500">Scatter plot showing conversion by time spent</span>
                </div>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">High-Value Abandonment Segments</h4>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cart Value</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abandonment Rate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recovery Potential</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="bg-red-50">
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Premium Collection (3+ min view)</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$175.40</td>
                    <td className="px-3 py-2 text-xs text-gray-600">68%</td>
                    <td className="px-3 py-2 text-xs text-green-600 font-medium">High (35%)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">First-time visitors</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$92.30</td>
                    <td className="px-3 py-2 text-xs text-gray-600">82%</td>
                    <td className="px-3 py-2 text-xs text-yellow-600">Medium (22%)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">Mobile users</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$68.50</td>
                    <td className="px-3 py-2 text-xs text-gray-600">76%</td>
                    <td className="px-3 py-2 text-xs text-yellow-600">Medium (18%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h4 className="text-sm font-medium text-gray-900 mb-2">Premium Collection Items</h4>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time Viewed</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abandonment Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">#PR-120</td>
                    <td className="px-3 py-2 text-xs text-gray-600">Premium Table Lamp</td>
                    <td className="px-3 py-2 text-xs text-gray-600">4m 12s</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$3,240</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">#PR-135</td>
                    <td className="px-3 py-2 text-xs text-gray-600">Artisan Wall Decor</td>
                    <td className="px-3 py-2 text-xs text-gray-600">3m 47s</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$2,870</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-xs font-medium text-gray-900">#PR-142</td>
                    <td className="px-3 py-2 text-xs text-gray-600">Designer Throw Pillows (Set)</td>
                    <td className="px-3 py-2 text-xs text-gray-600">3m 22s</td>
                    <td className="px-3 py-2 text-xs text-gray-600">$2,590</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      default:
        return <div className="text-center text-gray-500 py-8">No analysis data available</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recommendation Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 70px)' }}>
          {renderAnalysisContent()}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal; 