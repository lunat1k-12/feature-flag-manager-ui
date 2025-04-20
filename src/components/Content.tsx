import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

// Helper function to format date strings
function formatDate(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (e) {
    return dateString;
  }
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Error message component
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p className="font-medium">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default function Content() {
  const { 
    activeTab, 
    sidebarCollapsed,
    isLoading,
    error,
    dashboardData,
    analyticsData,
    reportsData,
    refreshDashboardData
  } = useAppContext();
  
  // Function to render dashboard metrics
  const renderDashboardMetrics = () => {
    if (!dashboardData) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dashboardData.metrics.map(metric => {
          const colorClasses = {
            blue: 'bg-blue-50 border-blue-100 text-blue-800 text-blue-600 text-blue-500',
            green: 'bg-green-50 border-green-100 text-green-800 text-green-600 text-green-500',
            purple: 'bg-purple-50 border-purple-100 text-purple-800 text-purple-600 text-purple-500',
            yellow: 'bg-yellow-50 border-yellow-100 text-yellow-800 text-yellow-600 text-yellow-500',
            red: 'bg-red-50 border-red-100 text-red-800 text-red-600 text-red-500'
          }[metric.color] || 'bg-gray-50 border-gray-100 text-gray-800 text-gray-600 text-gray-500';
          
          const [bgColor, borderColor, titleColor, valueColor, changeColor] = colorClasses.split(' ');
          
          return (
            <div key={metric.id} className={`${bgColor} p-4 rounded-md border ${borderColor}`}>
              <h4 className={`text-sm font-medium ${titleColor}`}>{metric.label}</h4>
              <p className={`text-2xl font-bold ${valueColor}`}>{metric.value}</p>
              <p className={`text-xs ${changeColor}`}>
                {metric.trend === 'up' && '↑ '}
                {metric.trend === 'down' && '↓ '}
                {metric.change > 0 && '+'}
                {metric.change}% {metric.changeLabel}
              </p>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Function to render recent activity
  const renderRecentActivity = () => {
    if (!dashboardData) return null;
    
    return (
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Recent Activity</h4>
          <button 
            onClick={() => refreshDashboardData(true)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>
        <ul className="space-y-2">
          {dashboardData.recentActivity.map(activity => (
            <li 
              key={activity.id} 
              className="text-sm text-gray-600 p-2 hover:bg-gray-100 rounded-md flex justify-between"
            >
              <span>{activity.message}</span>
              <span className="text-xs text-gray-400">
                {formatDate(activity.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  // Function to render analytics content
  const renderAnalyticsContent = () => {
    if (!analyticsData) return <p>No analytics data available.</p>;
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Analytics Overview</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-bold text-gray-800">{analyticsData.totals.users}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold text-gray-800">${analyticsData.totals.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold text-gray-800">{analyticsData.totals.orders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Data Points</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyticsData.dataPoints.map((point, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{point.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{point.users}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">${point.revenue}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{point.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Function to render reports content
  const renderReportsContent = () => {
    if (!reportsData) return <p>No reports data available.</p>;
    
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Reports</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportsData.reports.map(report => (
                  <tr key={report.id}>
                    <td className="px-4 py-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-500">{report.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 capitalize">{report.type}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'ready' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{formatDate(report.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <main 
      className={`bg-gray-100 min-h-screen pt-24 pb-6 px-6 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {activeTab === 'dashboard' && 'Dashboard Overview'}
          {activeTab === 'analytics' && 'Analytics Data'}
          {activeTab === 'reports' && 'Reports Summary'}
          {activeTab === 'settings' && 'Settings Panel'}
        </h3>
        
        {/* Error message */}
        {error && <ErrorMessage message={error} />}
        
        {/* Loading indicator */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {renderDashboardMetrics()}
                {renderRecentActivity()}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                {renderAnalyticsContent()}
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div>
                {renderReportsContent()}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="text-gray-600">
                <p>Settings content will be displayed here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
