import { Search } from 'lucide-react';

const TicketFilters = ({ filters, onFilterChange }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white border border-chilled-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="sm:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-chilled-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chilled-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ticket # or customer..."
              value={filters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-chilled-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-chilled-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Category Filter - Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-chilled-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">All Categories</option>
            <option value="TECHNICAL">Technical</option>
            <option value="ACCOUNT">Account</option>
            <option value="BOOKING">Booking</option>
            <option value="PAYMENT">Payment</option>
            <option value="VERIFICATION">Verification</option>
            <option value="COMPLAINT">Complaint</option>
            <option value="FEEDBACK">Feedback</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() =>
              onFilterChange({
                search: '',
                status: '',
                priority: '',
                category: '',
              })
            }
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-chilled-gray-700 bg-chilled-gray-100 rounded-lg hover:bg-chilled-gray-200 transition-colors active:bg-primary-600 active: active:hover:bg-primary-700"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;
