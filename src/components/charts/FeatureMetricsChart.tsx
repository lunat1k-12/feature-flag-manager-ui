import { FeatureMetrics } from '../../api';
import MultiLineChart from './MultiLineChart';

interface FeatureMetricsChartProps {
  featureMetrics: FeatureMetrics;
}

export default function FeatureMetricsChart({ featureMetrics }: FeatureMetricsChartProps) {
  const { featureName, enabledAxis, disabledAxis } = featureMetrics;

  // Prepare data series for the multi-line chart with modern, appealing colors
  const chartSeries = [
    {
      data: enabledAxis,
      label: 'Enabled',
      color: '#06d6a0' // Modern teal-green for enabled
    },
    {
      data: disabledAxis,
      label: 'Disabled',
      color: '#f72585' // Modern pink-red for disabled
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
      <div className="mt-6 grid grid-cols-2 gap-6 text-sm text-gray-600">
        <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl p-4 border border-teal-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: '#06d6a0' }}></div>
            <span className="font-semibold text-gray-700">Total Enabled</span>
          </div>
          <p className="text-2xl font-bold text-teal-600 mt-2">
            {enabledAxis.reduce((sum, point) => sum + point.value, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-xl p-4 border border-pink-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: '#f72585' }}></div>
            <span className="font-semibold text-gray-700">Total Disabled</span>
          </div>
          <p className="text-2xl font-bold text-pink-600 mt-2">
            {disabledAxis.reduce((sum, point) => sum + point.value, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
