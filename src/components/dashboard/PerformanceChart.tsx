import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

type ChartMetric = 'ctr' | 'impressions' | 'clicks' | 'conversions';
type ChartTimeframe = '30' | '90' | '365';
type Platform = 'facebook' | 'instagram' | 'google' | 'reddit';

const PerformanceChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [currentMetric, setCurrentMetric] = useState<ChartMetric>('ctr');
  const [currentTimeframe, setCurrentTimeframe] = useState<ChartTimeframe>('30');
  const [isLoading, setIsLoading] = useState(false);
  const [chartHighlight, setChartHighlight] = useState('1.54% Avg. CTR');
  const [showPlatforms, setShowPlatforms] = useState(true);

  // Platforms with their respective colors - memoize to avoid recreation on each render
  const platforms = useMemo(() => [
    { id: 'facebook' as Platform, name: 'Facebook', color: '#4267B2' },
    { id: 'instagram' as Platform, name: 'Instagram', color: '#C13584' },
    { id: 'google' as Platform, name: 'Google', color: '#4285F4' },
    { id: 'reddit' as Platform, name: 'Reddit', color: '#FF4500' }
  ], []);

  // Sample data - memoize to avoid recreation on each render
  const chartData = useMemo(() => ({
    ctr: {
      overall: {
        '30': Array.from({length: 30}, (_, i) => 1.2 + Math.random() * 0.6),
        '90': Array.from({length: 90}, (_, i) => 1.1 + Math.random() * 0.7),
        '365': Array.from({length: 365}, (_, i) => 1.0 + Math.random() * 0.8),
      },
      facebook: {
        '30': Array.from({length: 30}, (_, i) => 1.3 + Math.random() * 0.5),
        '90': Array.from({length: 90}, (_, i) => 1.2 + Math.random() * 0.6),
        '365': Array.from({length: 365}, (_, i) => 1.1 + Math.random() * 0.7),
      },
      instagram: {
        '30': Array.from({length: 30}, (_, i) => 1.5 + Math.random() * 0.8),
        '90': Array.from({length: 90}, (_, i) => 1.4 + Math.random() * 0.7),
        '365': Array.from({length: 365}, (_, i) => 1.3 + Math.random() * 0.8),
      },
      google: {
        '30': Array.from({length: 30}, (_, i) => 1.0 + Math.random() * 0.6),
        '90': Array.from({length: 90}, (_, i) => 0.9 + Math.random() * 0.7),
        '365': Array.from({length: 365}, (_, i) => 0.8 + Math.random() * 0.8),
      },
      reddit: {
        '30': Array.from({length: 30}, (_, i) => 0.7 + Math.random() * 0.3),
        '90': Array.from({length: 90}, (_, i) => 0.6 + Math.random() * 0.4),
        '365': Array.from({length: 365}, (_, i) => 0.5 + Math.random() * 0.5),
      }
    },
    impressions: {
      overall: {
        '30': Array.from({length: 30}, (_, i) => 30000 + Math.random() * 50000),
        '90': Array.from({length: 90}, (_, i) => 25000 + Math.random() * 55000),
        '365': Array.from({length: 365}, (_, i) => 20000 + Math.random() * 60000),
      },
      facebook: {
        '30': Array.from({length: 30}, (_, i) => 12000 + Math.random() * 20000),
        '90': Array.from({length: 90}, (_, i) => 10000 + Math.random() * 22000),
        '365': Array.from({length: 365}, (_, i) => 8000 + Math.random() * 24000),
      },
      instagram: {
        '30': Array.from({length: 30}, (_, i) => 10000 + Math.random() * 18000),
        '90': Array.from({length: 90}, (_, i) => 8000 + Math.random() * 20000),
        '365': Array.from({length: 365}, (_, i) => 6000 + Math.random() * 22000),
      },
      google: {
        '30': Array.from({length: 30}, (_, i) => 5000 + Math.random() * 10000),
        '90': Array.from({length: 90}, (_, i) => 4000 + Math.random() * 11000),
        '365': Array.from({length: 365}, (_, i) => 3000 + Math.random() * 12000),
      },
      reddit: {
        '30': Array.from({length: 30}, (_, i) => 3000 + Math.random() * 6000),
        '90': Array.from({length: 90}, (_, i) => 2500 + Math.random() * 6500),
        '365': Array.from({length: 365}, (_, i) => 2000 + Math.random() * 7000),
      }
    },
    clicks: {
      overall: {
        '30': Array.from({length: 30}, (_, i) => 500 + Math.random() * 1000),
        '90': Array.from({length: 90}, (_, i) => 450 + Math.random() * 1100),
        '365': Array.from({length: 365}, (_, i) => 400 + Math.random() * 1200),
      },
      facebook: {
        '30': Array.from({length: 30}, (_, i) => 200 + Math.random() * 400),
        '90': Array.from({length: 90}, (_, i) => 180 + Math.random() * 420),
        '365': Array.from({length: 365}, (_, i) => 160 + Math.random() * 440),
      },
      instagram: {
        '30': Array.from({length: 30}, (_, i) => 150 + Math.random() * 300),
        '90': Array.from({length: 90}, (_, i) => 130 + Math.random() * 320),
        '365': Array.from({length: 365}, (_, i) => 110 + Math.random() * 340),
      },
      google: {
        '30': Array.from({length: 30}, (_, i) => 100 + Math.random() * 200),
        '90': Array.from({length: 90}, (_, i) => 90 + Math.random() * 210),
        '365': Array.from({length: 365}, (_, i) => 80 + Math.random() * 220),
      },
      reddit: {
        '30': Array.from({length: 30}, (_, i) => 50 + Math.random() * 100),
        '90': Array.from({length: 90}, (_, i) => 40 + Math.random() * 110),
        '365': Array.from({length: 365}, (_, i) => 30 + Math.random() * 120),
      }
    },
    conversions: {
      overall: {
        '30': Array.from({length: 30}, (_, i) => 10 + Math.random() * 50),
        '90': Array.from({length: 90}, (_, i) => 8 + Math.random() * 55),
        '365': Array.from({length: 365}, (_, i) => 5 + Math.random() * 60),
      },
      facebook: {
        '30': Array.from({length: 30}, (_, i) => 4 + Math.random() * 20),
        '90': Array.from({length: 90}, (_, i) => 3 + Math.random() * 22),
        '365': Array.from({length: 365}, (_, i) => 2 + Math.random() * 24),
      },
      instagram: {
        '30': Array.from({length: 30}, (_, i) => 3 + Math.random() * 15),
        '90': Array.from({length: 90}, (_, i) => 2.5 + Math.random() * 16),
        '365': Array.from({length: 365}, (_, i) => 2 + Math.random() * 18),
      },
      google: {
        '30': Array.from({length: 30}, (_, i) => 2 + Math.random() * 10),
        '90': Array.from({length: 90}, (_, i) => 1.5 + Math.random() * 11),
        '365': Array.from({length: 365}, (_, i) => 1 + Math.random() * 12),
      },
      reddit: {
        '30': Array.from({length: 30}, (_, i) => 1 + Math.random() * 5),
        '90': Array.from({length: 90}, (_, i) => 0.8 + Math.random() * 5.5),
        '365': Array.from({length: 365}, (_, i) => 0.5 + Math.random() * 6),
      }
    }
  }), []);

  // Generate labels based on timeframe
  const generateLabels = useCallback((timeframe: ChartTimeframe): string[] => {
    const now = new Date();
    return Array.from({length: parseInt(timeframe)}, (_, i) => {
      const date = new Date();
      date.setDate(now.getDate() - (parseInt(timeframe) - i - 1));
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
  }, []);

  // Get highlight text
  const getHighlightText = useCallback((): string => {
    switch (currentMetric) {
      case 'impressions':
        return '1.2M Avg. Impressions';
      case 'clicks':
        return '752 Avg. Clicks';
      case 'conversions':
        return '28 Avg. Conversions';
      default:
        return '1.54% Avg. CTR';
    }
  }, [currentMetric]);

  // Toggle platform visibility
  const togglePlatforms = () => {
    setShowPlatforms(!showPlatforms);
  };

  // Get chart configuration - memoized to avoid recreation each render
  const getChartConfig = useCallback((): ChartConfiguration => {
    const labels = generateLabels(currentTimeframe);
    
    // Create datasets array
    const datasets = [];
    
    // Add overall dataset (always visible)
    datasets.push({
      label: 'Overall',
      data: chartData[currentMetric].overall[currentTimeframe],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3B82F6',
      borderWidth: 2,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#3B82F6',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
      fill: true
    });
    
    // Add platform-specific datasets if showPlatforms is true
    if (showPlatforms) {
      platforms.forEach(platform => {
        datasets.push({
          label: platform.name,
          data: chartData[currentMetric][platform.id][currentTimeframe],
          backgroundColor: 'transparent',
          borderColor: platform.color,
          borderWidth: 2,
          pointBackgroundColor: platform.color,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: platform.color,
          pointRadius: 2,
          pointHoverRadius: 4,
          tension: 0.3,
          fill: false
        });
      });
    }
    
    return {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            padding: 10,
            cornerRadius: 4,
            displayColors: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                if (currentMetric === 'ctr') {
                  return value + '%';
                }
                return value.toLocaleString();
              }
            }
          }
        }
      }
    };
  }, [currentMetric, currentTimeframe, chartData, platforms, showPlatforms, generateLabels]);

  // Update chart when metric or timeframe changes
  const updateChart = useCallback(() => {
    if (!chartInstanceRef.current) return;
    
    // Get chart config
    const config = getChartConfig();
    
    // Update labels
    chartInstanceRef.current.data.labels = config.data.labels;
    
    // Update datasets
    chartInstanceRef.current.data.datasets = config.data.datasets;
    
    // Update Y axis formatter
    if (chartInstanceRef.current.options && chartInstanceRef.current.options.scales && chartInstanceRef.current.options.scales.y) {
      chartInstanceRef.current.options.scales.y.ticks = {
        callback: function(value) {
          if (currentMetric === 'ctr') {
            return value + '%';
          }
          return value.toLocaleString();
        }
      };
    }
    
    // Update the chart
    chartInstanceRef.current.update();
    
    // Update highlight text
    setChartHighlight(getHighlightText());
  }, [currentMetric, getChartConfig, getHighlightText]);

  // Initialize chart
  useEffect(() => {
    const initChart = () => {
      if (!chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Destroy any existing chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      // Create new chart
      chartInstanceRef.current = new Chart(ctx, getChartConfig());
    };

    // Initialize the chart
    initChart();

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [getChartConfig]); // Only depends on getChartConfig

  // Update chart when metric or timeframe changes
  useEffect(() => {
    if (chartInstanceRef.current) {
      // Show loading state
      setIsLoading(true);
      
      // Update chart after a short delay to show loading animation
      const timer = setTimeout(() => {
        updateChart();
        setIsLoading(false);
      }, 600);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentMetric, currentTimeframe, updateChart, showPlatforms]);

  // Handle metric change
  const handleMetricChange = (metric: ChartMetric) => {
    if (metric !== currentMetric) {
      setCurrentMetric(metric);
    }
  };

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: ChartTimeframe) => {
    if (timeframe !== currentTimeframe) {
      setCurrentTimeframe(timeframe);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Campaign Performance Trends</h2>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 ${currentMetric === 'ctr' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-full text-xs font-medium`}
              onClick={() => handleMetricChange('ctr')}
            >
              CTR
            </button>
            <button 
              className={`px-3 py-1 ${currentMetric === 'impressions' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-full text-xs font-medium`}
              onClick={() => handleMetricChange('impressions')}
            >
              Impressions
            </button>
            <button 
              className={`px-3 py-1 ${currentMetric === 'clicks' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-full text-xs font-medium`}
              onClick={() => handleMetricChange('clicks')}
            >
              Clicks
            </button>
            <button 
              className={`px-3 py-1 ${currentMetric === 'conversions' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-full text-xs font-medium`}
              onClick={() => handleMetricChange('conversions')}
            >
              Conversions
            </button>
          </div>
        </div>
        
        {/* Interactive Chart container */}
        <div className="w-full h-64 bg-gray-50 rounded-lg border border-gray-200 relative">
          <canvas id="performanceChart" ref={chartRef} className="w-full h-full" aria-label="Campaign performance chart" role="img"></canvas>
          
          {/* Chart highlights label */}
          <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-md text-xs font-medium text-blue-600 shadow-sm animate-fade-in">
            <div id="chartHighlight">{chartHighlight}</div>
          </div>
          
          {/* Loading indicator */}
          {isLoading && (
            <div id="chart-loading" className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center">
              <div className="animate-pulse text-blue-600">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {/* Chart context controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button 
              className={`text-xs px-3 py-1 ${currentTimeframe === '30' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              onClick={() => handleTimeframeChange('30')}
            >
              30 Days
            </button>
            <button 
              className={`text-xs px-3 py-1 ${currentTimeframe === '90' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              onClick={() => handleTimeframeChange('90')}
            >
              90 Days
            </button>
            <button 
              className={`text-xs px-3 py-1 ${currentTimeframe === '365' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              onClick={() => handleTimeframeChange('365')}
            >
              Year
            </button>
          </div>
          <div className="flex space-x-2">
            <button 
              className={`text-xs px-3 py-1 ${showPlatforms ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'} rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              onClick={togglePlatforms}
            >
              {showPlatforms ? 'Hide Platforms' : 'Show Platforms'}
            </button>
            <button className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center">
              <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Chart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart; 