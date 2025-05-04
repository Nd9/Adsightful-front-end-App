import React from 'react';

// Forecast performance chart
export const ForecastChart: React.FC = () => {
  return (
    <div className="h-48 w-full">
      <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
        {/* Chart Background Grid */}
        <g className="grid">
          <line x1="50" y1="20" x2="50" y2="180" stroke="#eaeaea" strokeWidth="1" />
          <line x1="150" y1="20" x2="150" y2="180" stroke="#eaeaea" strokeWidth="1" />
          <line x1="250" y1="20" x2="250" y2="180" stroke="#eaeaea" strokeWidth="1" />
          <line x1="350" y1="20" x2="350" y2="180" stroke="#eaeaea" strokeWidth="1" />
          <line x1="450" y1="20" x2="450" y2="180" stroke="#eaeaea" strokeWidth="1" />
          <line x1="550" y1="20" x2="550" y2="180" stroke="#eaeaea" strokeWidth="1" />
          <line x1="650" y1="20" x2="650" y2="180" stroke="#eaeaea" strokeWidth="1" />
          <line x1="750" y1="20" x2="750" y2="180" stroke="#eaeaea" strokeWidth="1" />
          
          <line x1="50" y1="20" x2="750" y2="20" stroke="#eaeaea" strokeWidth="1" />
          <line x1="50" y1="60" x2="750" y2="60" stroke="#eaeaea" strokeWidth="1" />
          <line x1="50" y1="100" x2="750" y2="100" stroke="#eaeaea" strokeWidth="1" />
          <line x1="50" y1="140" x2="750" y2="140" stroke="#eaeaea" strokeWidth="1" />
          <line x1="50" y1="180" x2="750" y2="180" stroke="#eaeaea" strokeWidth="1" />
        </g>
        
        {/* Axis Labels */}
        <g className="axis-labels" fontSize="10" fontFamily="Arial, sans-serif" fill="#666">
          <text x="50" y="195" textAnchor="middle">Day 1</text>
          <text x="150" y="195" textAnchor="middle">Day 3</text>
          <text x="250" y="195" textAnchor="middle">Day 5</text>
          <text x="350" y="195" textAnchor="middle">Day 7</text>
          <text x="450" y="195" textAnchor="middle">Day 9</text>
          <text x="550" y="195" textAnchor="middle">Day 11</text>
          <text x="650" y="195" textAnchor="middle">Day 13</text>
          <text x="750" y="195" textAnchor="middle">Day 14</text>
          
          <text x="45" y="180" textAnchor="end">2.0x</text>
          <text x="45" y="140" textAnchor="end">2.5x</text>
          <text x="45" y="100" textAnchor="end">3.0x</text>
          <text x="45" y="60" textAnchor="end">3.5x</text>
          <text x="45" y="20" textAnchor="end">4.0x</text>
        </g>
        
        {/* Account Average Line */}
        <line 
          x1="50" y1="140" x2="750" y2="140" 
          stroke="#94a3b8" 
          strokeWidth="2" 
          strokeDasharray="5,5" 
        />
        <text x="755" y="140" textAnchor="start" fontSize="10" fill="#94a3b8" fontWeight="bold">Avg. 2.6x</text>
        
        {/* Campaign ROAS Line */}
        <path 
          d="M50,90 C100,95 150,85 200,90 C250,95 300,85 350,95 C400,105 450,90 500,85 C550,80 600,85 650,75 C700,70 750,75" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="3" 
        />
        
        {/* Data Points */}
        <circle cx="50" cy="90" r="4" fill="#10b981" />
        <circle cx="150" cy="85" r="4" fill="#10b981" />
        <circle cx="250" cy="90" r="4" fill="#10b981" />
        <circle cx="350" cy="95" r="4" fill="#10b981" />
        <circle cx="450" cy="90" r="4" fill="#10b981" />
        <circle cx="550" cy="85" r="4" fill="#10b981" />
        <circle cx="650" cy="75" r="4" fill="#10b981" />
        <circle cx="750" cy="75" r="4" fill="#10b981" />
        
        {/* Forecast Region (with lighter color) */}
        <path 
          d="M750,75 C800,70 850,65" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="3" 
          strokeDasharray="6,3" 
        />
        
        {/* Legend */}
        <g transform="translate(650, 30)">
          <rect x="0" y="0" width="100" height="40" fill="white" fillOpacity="0.8" rx="4" />
          <line x1="10" y1="15" x2="30" y2="15" stroke="#10b981" strokeWidth="3" />
          <text x="35" y="18" fontSize="10" fill="#333">Campaign ROAS</text>
          <line x1="10" y1="30" x2="30" y2="30" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
          <text x="35" y="33" fontSize="10" fill="#333">Account Avg.</text>
        </g>
      </svg>
    </div>
  );
};

// Heat map for hourly performance
export const HeatMapChart: React.FC = () => {
  // Heat map data (day of week vs hour of day with intensity value)
  const heatMapData = [
    // Values from 0-10 for intensity (10 being highest performance)
    [3, 2, 2, 3, 4, 4, 3, 2, 2, 4, 5, 6, 8, 9, 7, 6, 5, 6, 7, 6, 5, 4, 3, 2], // Monday
    [2, 1, 1, 2, 3, 4, 3, 2, 3, 4, 5, 5, 6, 7, 6, 5, 6, 7, 8, 7, 5, 4, 3, 2], // Tuesday
    [3, 2, 1, 1, 3, 4, 3, 2, 3, 4, 4, 5, 6, 7, 6, 5, 6, 8, 9, 7, 6, 5, 4, 3], // Wednesday
    [2, 1, 1, 2, 3, 3, 2, 2, 3, 4, 5, 6, 7, 7, 6, 5, 7, 8, 9, 8, 6, 5, 4, 3], // Thursday
    [3, 2, 1, 2, 2, 3, 3, 2, 3, 5, 6, 6, 7, 7, 6, 6, 7, 8, 9, 8, 7, 5, 4, 3], // Friday
    [4, 3, 2, 2, 3, 3, 4, 5, 7, 8, 9, 10, 10, 9, 8, 7, 7, 8, 8, 7, 6, 5, 4, 3], // Saturday
    [3, 2, 2, 1, 2, 3, 4, 5, 7, 9, 10, 10, 9, 8, 7, 7, 7, 8, 7, 6, 5, 4, 3, 2]  // Sunday
  ];
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({length: 24}, (_, i) => i);
  
  const cellSize = 20;
  const width = hours.length * cellSize + 60; // Extra space for labels
  const height = days.length * cellSize + 30; // Extra space for labels
  
  // Color scale function (simplified)
  const getColor = (value: number) => {
    if (value >= 9) return '#047857'; // Very high - dark green
    if (value >= 7) return '#10b981'; // High - green
    if (value >= 5) return '#6ee7b7'; // Medium-high - light green
    if (value >= 3) return '#d1fae5'; // Medium - very light green
    return '#f0f9ff'; // Low - light gray-blue
  };
  
  return (
    <div className="h-72 w-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMin meet">
        {/* X-Axis Labels (Hours) */}
        <g>
          {hours.map((hour, i) => (
            <text 
              key={`hour-${hour}`} 
              x={60 + i * cellSize + cellSize/2} 
              y={20} 
              textAnchor="middle" 
              fontSize="9" 
              fill="#666"
            >
              {hour}
            </text>
          ))}
          <text x={width/2} y={10} textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">Hour of Day</text>
        </g>
        
        {/* Y-Axis Labels (Days) */}
        <g>
          {days.map((day, i) => (
            <text 
              key={`day-${day}`} 
              x={50} 
              y={30 + i * cellSize + cellSize/2 + 4} 
              textAnchor="end" 
              fontSize="10" 
              fill="#666"
            >
              {day}
            </text>
          ))}
          <text 
            x="15" 
            y={height/2} 
            textAnchor="middle" 
            fontSize="10" 
            fill="#333" 
            fontWeight="bold"
            transform={`rotate(-90 15 ${height/2})`}
          >
            Day of Week
          </text>
        </g>
        
        {/* Heat Map Cells */}
        {days.map((day, dayIndex) => (
          <g key={`row-${day}`}>
            {hours.map((hour, hourIndex) => (
              <rect
                key={`cell-${day}-${hour}`}
                x={60 + hourIndex * cellSize}
                y={30 + dayIndex * cellSize}
                width={cellSize - 1}
                height={cellSize - 1}
                fill={getColor(heatMapData[dayIndex][hourIndex])}
                stroke="#fff"
                strokeWidth="1"
              />
            ))}
          </g>
        ))}
        
        {/* Legend */}
        <g transform="translate(60, 170)">
          <text x="0" y="8" fontSize="9" fill="#333">Low</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={`legend-${i}`} x={25 + i*20} y="0" width="20" height="10" fill={getColor(i*2+1)} stroke="#fff" />
          ))}
          <text x="125" y="8" fontSize="9" fill="#333">High</text>
        </g>
      </svg>
    </div>
  );
};

// Creative performance bar chart
export const CreativePerformanceChart: React.FC = () => {
  const data = [
    { name: 'Testimonial', ctr: 3.46, cpa: 26.75, convRate: 2.87 },
    { name: 'Product', ctr: 2.69, cpa: 32.35, convRate: 2.32 },
    { name: 'Promotional', ctr: 2.81, cpa: 31.28, convRate: 2.21 }
  ];
  
  const barWidth = 60;
  const barSpacing = 30;
  const chartHeight = 150;
  const chartWidth = (barWidth + barSpacing) * data.length * 3 + 80; // 3 metrics per item
  
  // Find max values for scaling
  const maxCtr = Math.max(...data.map(d => d.ctr)) * 1.2; // Add 20% headroom
  const maxCpa = Math.max(...data.map(d => d.cpa)) * 1.2;
  const maxConvRate = Math.max(...data.map(d => d.convRate)) * 1.2;
  
  // Scale helpers
  const scaleCtr = (val: number) => chartHeight - (val / maxCtr) * chartHeight;
  const scaleCpa = (val: number) => chartHeight - (val / maxCpa) * chartHeight;
  const scaleConvRate = (val: number) => chartHeight - (val / maxConvRate) * chartHeight;
  
  return (
    <div className="w-full overflow-x-auto">
      <svg width={chartWidth} height="250" viewBox={`0 0 ${chartWidth} 250`} preserveAspectRatio="xMinYMin meet">
        {/* Y Axis */}
        <line x1="60" y1="40" x2="60" y2={chartHeight + 40} stroke="#ccc" strokeWidth="1" />
        
        {/* X Axis */}
        <line x1="60" y1={chartHeight + 40} x2={chartWidth - 20} y2={chartHeight + 40} stroke="#ccc" strokeWidth="1" />
        
        {/* Chart Title */}
        <text x={chartWidth / 2} y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
          Creative Performance by Type
        </text>
        
        {/* Bars */}
        {data.map((item, i) => {
          const xStart = 80 + i * (barWidth * 3 + barSpacing * 2);
          
          return (
            <g key={`bars-${item.name}`}>
              {/* Group Label */}
              <text x={xStart + barWidth * 1.5} y={chartHeight + 60} textAnchor="middle" fontSize="12" fill="#333">
                {item.name}
              </text>
              
              {/* CTR Bar */}
              <rect 
                x={xStart} 
                y={40 + scaleCtr(item.ctr)} 
                width={barWidth} 
                height={chartHeight - scaleCtr(item.ctr)} 
                fill="#3b82f6" 
                rx="2"
              />
              <text x={xStart + barWidth/2} y={40 + scaleCtr(item.ctr) - 5} textAnchor="middle" fontSize="10" fill="#333">
                {item.ctr}%
              </text>
              <text x={xStart + barWidth/2} y={chartHeight + 75} textAnchor="middle" fontSize="10" fill="#666">
                CTR
              </text>
              
              {/* CPA Bar */}
              <rect 
                x={xStart + barWidth + barSpacing/2} 
                y={40 + scaleCpa(item.cpa)} 
                width={barWidth} 
                height={chartHeight - scaleCpa(item.cpa)} 
                fill="#8b5cf6" 
                rx="2"
              />
              <text x={xStart + barWidth + barSpacing/2 + barWidth/2} y={40 + scaleCpa(item.cpa) - 5} textAnchor="middle" fontSize="10" fill="#333">
                ${item.cpa}
              </text>
              <text x={xStart + barWidth + barSpacing/2 + barWidth/2} y={chartHeight + 75} textAnchor="middle" fontSize="10" fill="#666">
                CPA
              </text>
              
              {/* Conv Rate Bar */}
              <rect 
                x={xStart + barWidth*2 + barSpacing} 
                y={40 + scaleConvRate(item.convRate)} 
                width={barWidth} 
                height={chartHeight - scaleConvRate(item.convRate)} 
                fill="#10b981" 
                rx="2"
              />
              <text x={xStart + barWidth*2 + barSpacing + barWidth/2} y={40 + scaleConvRate(item.convRate) - 5} textAnchor="middle" fontSize="10" fill="#333">
                {item.convRate}%
              </text>
              <text x={xStart + barWidth*2 + barSpacing + barWidth/2} y={chartHeight + 75} textAnchor="middle" fontSize="10" fill="#666">
                Conv Rate
              </text>
            </g>
          );
        })}
        
        {/* Highlight Best Performer */}
        <rect 
          x={75} 
          y={35}
          width={barWidth + 10} 
          height={chartHeight - scaleCtr(data[0].ctr) + 10} 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="2" 
          strokeDasharray="3,2"
          rx="4"
        />
      </svg>
    </div>
  );
};

// Audience overlap visualization
export const AudienceOverlapChart: React.FC = () => {
  return (
    <div className="h-32 w-full">
      <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet">
        {/* Legend */}
        <g transform="translate(5, 15)">
          <rect width="8" height="8" fill="#4285F4" rx="1" />
          <text x="12" y="8" fontSize="8" fill="#333">Facebook (245K)</text>
          
          <rect width="8" height="8" fill="#DB4437" rx="1" transform="translate(82, 0)" />
          <text x="94" y="8" fontSize="8" fill="#333">Google (180K)</text>
          
          <rect width="8" height="8" fill="#000000" rx="1" transform="translate(164, 0)" />
          <text x="176" y="8" fontSize="8" fill="#333">TikTok (120K)</text>
        </g>

        {/* Multi-platform Venn Diagram */}
        <g transform="translate(150, 70)">
          {/* Facebook Circle */}
          <circle 
            cx="-40" 
            cy="-15" 
            r="40" 
            fillOpacity="0.5" 
            fill="#4285F4" 
            stroke="#4285F4" 
            strokeWidth="1" 
          />
          
          {/* Google Circle */}
          <circle 
            cx="10" 
            cy="15" 
            r="35" 
            fillOpacity="0.5" 
            fill="#DB4437" 
            stroke="#DB4437" 
            strokeWidth="1" 
          />
          
          {/* TikTok Circle */}
          <circle 
            cx="45" 
            cy="-20" 
            r="30" 
            fillOpacity="0.5" 
            fill="#000000" 
            stroke="#000000" 
            strokeWidth="1" 
          />
          
          {/* Overlap Labels */}
          <text x="-18" y="0" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">38%</text>
          <text x="12" y="-20" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">22%</text>
          <text x="28" y="2" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">17%</text>
          <text x="0" y="-5" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">12%</text>
        </g>
      </svg>
    </div>
  );
};

// Cart abandonment analysis chart
export const AbandonmentChart: React.FC = () => {
  const data = [
    { category: 'Premium', value: 68, amount: 8740 },
    { category: 'Standard', value: 52, amount: 5230 },
    { category: 'Essentials', value: 43, amount: 3820 },
    { category: 'Accessories', value: 37, amount: 2180 }
  ];
  
  const barHeight = 24;
  const barSpacing = 16;
  const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // 10% headroom
  const chartWidth = 280;
  const scaleValue = (val: number) => (val / maxValue) * (chartWidth - 120);
  
  return (
    <div className="h-32 w-full">
      <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="xMinYMin meet">
        {/* Chart Title */}
        <text x="10" y="15" fontSize="11" fontWeight="bold" fill="#333">Abandonment Rate by Product Line</text>
        
        {/* Y-Axis Labels and Bars */}
        {data.map((item, i) => {
          const y = 30 + i * (barHeight + barSpacing);
          return (
            <g key={`bar-${item.category}`}>
              {/* Y-Axis Label */}
              <text x="5" y={y + barHeight/2 + 4} fontSize="10" fill="#666" textAnchor="start">{item.category}</text>
              
              {/* Bar Background */}
              <rect x="80" y={y} width={chartWidth - 120} height={barHeight} fill="#f1f5f9" rx="2" />
              
              {/* Bar Value */}
              <rect 
                x="80" 
                y={y} 
                width={scaleValue(item.value)} 
                height={barHeight} 
                fill={i === 0 ? "#ef4444" : "#f87171"} 
                rx="2" 
                fillOpacity={i === 0 ? 1 : 0.7}
              />
              
              {/* Value Label */}
              <text 
                x={80 + scaleValue(item.value) + 5} 
                y={y + barHeight/2 + 4} 
                fontSize="10" 
                fill="#333"
              >
                {item.value}%
              </text>
              
              {/* Amount */}
              <text 
                x={chartWidth - 10} 
                y={y + barHeight/2 + 4} 
                fontSize="10" 
                fill="#666" 
                textAnchor="end"
              >
                ${item.amount}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}; 