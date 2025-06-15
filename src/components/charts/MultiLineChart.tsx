import { MetricDataPoint } from '../../api';

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

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-medium text-gray-900">{title}</h5>
        
        {/* Legend */}
        <div className="flex items-center space-x-4">
          {series.map((s, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: s.color }}
              ></div>
              <span className="text-sm text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {yAxisLabels.map((label, index) => (
          <g key={index}>
            <line
              x1={padding}
              y1={label.y}
              x2={padding + chartWidth}
              y2={label.y}
              stroke="#f3f4f6"
              strokeWidth="1"
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
                stroke="#f9fafb"
                strokeWidth="1"
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
          stroke="#6b7280"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={padding + chartHeight}
          x2={padding + chartWidth}
          y2={padding + chartHeight}
          stroke="#6b7280"
          strokeWidth="2"
        />

        {/* Y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <text
            key={index}
            x={padding - 10}
            y={label.y + 4}
            textAnchor="end"
            className="text-xs fill-gray-600"
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

          return (
            <g key={seriesIndex}>
              {/* Data line */}
              <path
                d={pathData}
                fill="none"
                stroke={series.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {series.points.map((point, pointIndex) => (
                <g key={pointIndex}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill={series.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  
                  {/* Tooltip on hover */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="10"
                    fill="transparent"
                    className="cursor-pointer"
                  >
                    <title>{`${series.label} - ${point.label}: ${point.value}`}</title>
                  </circle>
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
                y={padding + chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {label.split('-').slice(1).join('/')} {/* Format date */}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}
