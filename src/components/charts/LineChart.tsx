import { MetricDataPoint } from '../../api';

interface LineChartProps {
  data: MetricDataPoint[];
  title: string;
  color: string;
  width?: number;
  height?: number;
}

export default function LineChart({ 
  data, 
  title, 
  color, 
  width = 400, 
  height = 200 
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>No data available for {title}</p>
      </div>
    );
  }

  // Calculate chart dimensions with padding
  const padding = 40;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  // Find min and max values for scaling
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue - minValue || 1; // Avoid division by zero

  // Calculate points for the line
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
    return { x, y, ...point };
  });

  // Create path string for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Generate Y-axis labels
  const yAxisLabels = [];
  const labelCount = 5;
  for (let i = 0; i < labelCount; i++) {
    const value = minValue + (valueRange * i) / (labelCount - 1);
    const y = padding + chartHeight - (i / (labelCount - 1)) * chartHeight;
    yAxisLabels.push({ value: Math.round(value), y });
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h5 className="text-sm font-medium text-gray-700 mb-3">{title}</h5>
      
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

        {/* Data line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Tooltip on hover */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="transparent"
              className="cursor-pointer"
            >
              <title>{`${point.label}: ${point.value}`}</title>
            </circle>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => {
          // Show every other label to avoid crowding
          if (index % Math.ceil(points.length / 6) === 0) {
            return (
              <text
                key={index}
                x={point.x}
                y={padding + chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {point.label.split('-').slice(1).join('/')} {/* Format date */}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}
