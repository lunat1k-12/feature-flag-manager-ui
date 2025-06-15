import { MetricDataPoint } from '../../api';
import { useState } from 'react';

interface DataSeries {
  data: MetricDataPoint[];
  label: string;
  color: string;
}

interface MultiLineChartProps {
  series: DataSeries[];
  title: string;
  width?: number;
  height?: number;
}

export default function MultiLineChart({ 
  series, 
  title, 
  width = 800, 
  height = 300 
}: MultiLineChartProps) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: ''
  });

  if (!series || series.length === 0 || series.every(s => !s.data || s.data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available for {title}</p>
      </div>
    );
  }

  // Calculate chart dimensions with padding
  const padding = 60;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  // Find all values across all series for scaling
  const allValues = series.flatMap(s => s.data.map(d => d.value));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue || 1; // Avoid division by zero

  // Get all unique labels (assuming all series have the same labels)
  const labels = series[0]?.data.map(d => d.label) || [];

  // Calculate points for each series
  const seriesPoints = series.map(s => ({
    ...s,
    points: s.data.map((point, index) => {
      const x = padding + (index / (s.data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      return { x, y, ...point };
    })
  }));

  // Generate Y-axis labels
  const yAxisLabels = [];
  const labelCount = 6;
  for (let i = 0; i < labelCount; i++) {
    const value = minValue + (valueRange * i) / (labelCount - 1);
    const y = padding + chartHeight - (i / (labelCount - 1)) * chartHeight;
    yAxisLabels.push({ value: Math.round(value), y });
  }

  const handleMouseEnter = (point: any, series: any, event: React.MouseEvent<SVGCircleElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest('.bg-gradient-to-br')?.getBoundingClientRect();
    
    if (containerRect) {
      const formattedDate = new Date(point.label).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      setTooltip({
        visible: true,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
        content: `${series.label}: ${point.value} (${formattedDate})`
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 relative">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-xl font-semibold text-gray-800">{title}</h5>
        
        {/* Legend */}
        <div className="flex items-center space-x-6">
          {series.map((s, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full shadow-sm" 
                style={{ backgroundColor: s.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <svg width={width} height={height} className="overflow-visible drop-shadow-sm">
        {/* Gradient Definitions */}
        <defs>
          {series.map((s, index) => (
            <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: s.color, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: s.color, stopOpacity: 0.05 }} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid lines */}
        {yAxisLabels.map((label, index) => (
          <g key={index}>
            <line
              x1={padding}
              y1={label.y}
              x2={padding + chartWidth}
              y2={label.y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2,4"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Vertical grid lines */}
        {labels.map((_, index) => {
          if (index % Math.ceil(labels.length / 8) === 0) {
            const x = padding + (index / (labels.length - 1)) * chartWidth;
            return (
              <line
                key={index}
                x1={x}
                y1={padding}
                x2={x}
                y2={padding + chartHeight}
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="2,4"
                opacity="0.4"
              />
            );
          }
          return null;
        })}

        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={padding + chartHeight}
          stroke="#9ca3af"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={padding + chartHeight}
          x2={padding + chartWidth}
          y2={padding + chartHeight}
          stroke="#9ca3af"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <text
            key={index}
            x={padding - 15}
            y={label.y + 4}
            textAnchor="end"
            className="text-xs fill-gray-500 font-medium"
          >
            {label.value}
          </text>
        ))}

        {/* Data lines and points for each series */}
        {seriesPoints.map((series, seriesIndex) => {
          // Create path string for the line
          const pathData = series.points.reduce((path, point, index) => {
            const command = index === 0 ? 'M' : 'L';
            return `${path} ${command} ${point.x} ${point.y}`;
          }, '');

          // Create area path for gradient fill
          const areaPath = series.points.reduce((path, point, index) => {
            if (index === 0) {
              return `M ${point.x} ${padding + chartHeight} L ${point.x} ${point.y}`;
            }
            return `${path} L ${point.x} ${point.y}`;
          }, '') + ` L ${series.points[series.points.length - 1]?.x} ${padding + chartHeight} Z`;

          return (
            <g key={seriesIndex}>
              {/* Gradient area fill */}
              <path
                d={areaPath}
                fill={`url(#gradient-${seriesIndex})`}
                opacity="0.8"
              />
              
              {/* Data line with glow effect */}
              <path
                d={pathData}
                fill="none"
                stroke={series.color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              />

              {/* Data points */}
              {series.points.map((point, pointIndex) => (
                <g key={pointIndex}>
                  {/* Outer glow circle */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="8"
                    fill={series.color}
                    opacity="0.2"
                  />
                  
                  {/* Main data point */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="white"
                    stroke={series.color}
                    strokeWidth="3"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                  />
                  
                  {/* Inner dot */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill={series.color}
                  />
                  
                  {/* Invisible hover area */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="15"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={(e) => handleMouseEnter(point, series, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                </g>
              ))}
            </g>
          );
        })}

        {/* X-axis labels */}
        {labels.map((label, index) => {
          // Show every other label to avoid crowding
          if (index % Math.ceil(labels.length / 8) === 0) {
            const x = padding + (index / (labels.length - 1)) * chartWidth;
            return (
              <text
                key={index}
                x={x}
                y={padding + chartHeight + 25}
                textAnchor="middle"
                className="text-xs fill-gray-500 font-medium"
              >
                {label.split('-').slice(1).join('/')} {/* Format date */}
              </text>
            );
          }
          return null;
        })}
      </svg>

      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-50 px-4 py-3 text-sm text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl pointer-events-none whitespace-nowrap border border-gray-700"
          style={{
            left: tooltip.x,
            top: tooltip.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          {tooltip.content}
          {/* Arrow */}
          <div
            className="absolute w-3 h-3 bg-gradient-to-r from-gray-800 to-gray-900 transform rotate-45 border-r border-b border-gray-700"
            style={{
              left: '50%',
              bottom: '-6px',
              marginLeft: '-6px'
            }}
          />
        </div>
      )}
    </div>
  );
}
