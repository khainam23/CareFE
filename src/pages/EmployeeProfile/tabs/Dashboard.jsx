const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Placeholder cards for dashboard stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Large content area */}
      <div className="md:col-span-2 lg:col-span-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            <div className="h-4 bg-gray-100 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;