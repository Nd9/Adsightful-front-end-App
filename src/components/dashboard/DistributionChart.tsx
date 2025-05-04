import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables, ArcElement, DoughnutController, ChartTypeRegistry, TooltipItem } from 'chart.js';

// Register required Chart.js components
Chart.register(ArcElement, DoughnutController, ...registerables);

// Define a type for the doughnut chart options
interface ChartOptions {
  cutout?: string;
}

// Define the tooltip context type
type TooltipContext = TooltipItem<keyof ChartTypeRegistry>;

const DistributionChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const getChartConfig = React.useCallback((): ChartConfiguration => {
    return {
      type: 'doughnut',
      data: {
        labels: ['Top CTR (>2%)', 'Good CTR (1-2%)', 'Low CTR (<1%)', 'Critical CTR (<0.5%)'],
        datasets: [{
          data: [12, 24, 10, 8],
          backgroundColor: [
            '#10B981', // green
            '#3B82F6', // blue
            '#F59E0B', // yellow
            '#EF4444', // red
          ],
          borderColor: '#FFFFFF',
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: TooltipContext) {
                const label = context.label || '';
                const value = context.parsed as number;
                
                // Get total safely
                const dataArray = context.chart.data.datasets[0].data as number[];
                const total = dataArray.reduce((sum, val) => sum + val, 0);
                
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} campaigns (${percentage}%)`;
              }
            }
          }
        }
      } as any // Type assertion to help TypeScript with Chart.js types
    };
  }, []);

  // Create chart with cutout property
  useEffect(() => {
    const initChart = () => {
      if (!chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      
      // Get the configuration
      const config = getChartConfig();
      
      // Create the chart
      chartInstanceRef.current = new Chart(ctx, config);
      
      // Add cutout property (handled through type assertion)
      if (chartInstanceRef.current.options) {
        (chartInstanceRef.current.options as ChartOptions).cutout = '70%';
        chartInstanceRef.current.update();
      }
    };

    // Initialize the chart
    initChart();
    
    // Clean up function to destroy chart when component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [getChartConfig]); // Add getChartConfig as a dependency

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Performance Distribution</h2>
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-2">Based on:</span>
            <select className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 py-1 px-2 text-xs bg-white">
              <option value="ctr">CTR</option>
              <option value="conversions">Conversions</option>
              <option value="roas">ROAS</option>
              <option value="spend">Spend</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="w-full h-56 relative">
          <canvas ref={chartRef} id="distributionChart"></canvas>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-gray-700">54</span>
            <span className="text-sm text-gray-500">Campaigns</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Top Performers</p>
            <p className="text-lg font-semibold text-gray-800">12 <span className="text-sm font-normal">(22%)</span></p>
            <p className="text-xs text-green-600 mt-1">CTR &gt; 2%</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Critical Attention</p>
            <p className="text-lg font-semibold text-gray-800">8 <span className="text-sm font-normal">(15%)</span></p>
            <p className="text-xs text-red-600 mt-1">CTR &lt; 0.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionChart; 