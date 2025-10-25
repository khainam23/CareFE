const Schedule = () => {
  return (
    <div className="space-y-6">
      {/* Filter/Controls */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div className="h-10 bg-gray-100 rounded w-48"></div>
        <div className="h-10 bg-gray-100 rounded w-48"></div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 border-b">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </th>
                <th className="text-left py-3 px-4 border-b">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </th>
                <th className="text-left py-3 px-4 border-b">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </th>
                <th className="text-left py-3 px-4 border-b">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 border-b">
                    <div className="h-4 bg-gray-100 rounded w-28"></div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="h-4 bg-gray-100 rounded w-32"></div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="h-4 bg-gray-100 rounded w-24"></div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div className="h-4 bg-gray-100 rounded w-20"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;