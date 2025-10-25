const Tasks = () => {
  return (
    <div className="space-y-6">
      {/* Filter/Status buttons */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-2 flex-wrap">
        {['All', 'Pending', 'In Progress', 'Completed'].map((status, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded font-medium text-sm ${
              i === 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                  disabled
                />
              </div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                <div className="flex gap-4 text-sm">
                  <div className="h-4 bg-gray-100 rounded w-24"></div>
                  <div className="h-4 bg-gray-100 rounded w-32"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;