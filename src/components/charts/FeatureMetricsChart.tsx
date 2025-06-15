import { FeatureMetrics } from '../../api';
import MultiLineChart from './MultiLineChart';

interface FeatureMetricsChartProps {
  featureMetrics: FeatureMetrics;
}

export default function FeatureMetricsChart({ featureMetrics }: FeatureMetricsChartProps) {
  const { featureName, enabledAxis, disabledAxis } = featureMetrics;

  // Prepare data series for the multi-line chart
  const chartSeries = [
    {
      data: enabledAxis,
      label: 'Enabled',
      color: '#10b981' // Green color for enabled
    },
    {
      data: disabledAxis,
      label: 'Disabled',
      color: '#ef4444' // Red color for disabled
    }
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        {featureName}
      </h4>
      
      {/* Combined Usage Chart */}
      <MultiLineChart
        series={chartSeries}
        title="Usage Over Time"
        width={900}
        height={350}
      />

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">Total Enabled:</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {enabledAxis.reduce((sum, point) => sum + point.value, 0)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium">Total Disabled:</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            {disabledAxis.reduce((sum, point) => sum + point.value, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
