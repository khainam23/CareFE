import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import supportService from '@services/supportService';
import Loading from '@components/common/Loading';
import TicketFilters from '@components/support/TicketFilters';
import TicketStatusBadge from '@components/support/TicketStatusBadge';
import TicketPriorityBadge from '@components/support/TicketPriorityBadge';

const TicketsList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
  });

  // Debounced search value
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTickets();
      if (response.success) {
        setTickets(response.data || []);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load tickets',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on filters
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesTicketNumber = ticket.ticketNumber
          ?.toLowerCase()
          .includes(searchLower);
        const matchesCustomerName = ticket.customerName
          ?.toLowerCase()
          .includes(searchLower);
        if (!matchesTicketNumber && !matchesCustomerName) {
          return false;
        }
      }

      // Status filter
      if (filters.status && ticket.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && ticket.priority !== filters.priority) {
        return false;
      }

      // Category filter
      if (filters.category && ticket.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [tickets, debouncedSearch, filters.status, filters.priority, filters.category]);

  const handleTicketClick = (ticketId) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-500">All Tickets</h1>
          <p className="text-xs sm:text-sm text-chilled-gray-400 mt-1">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </p>
        </div>
      </div>

      {/* Filters */}
      <TicketFilters filters={filters} onFilterChange={setFilters} />

      {/* Tickets Table */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white border border-chilled-gray-200 rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-chilled-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal-500 mb-2">
            No tickets found
          </h3>
          <p className="text-chilled-gray-400">
            {filters.search || filters.status || filters.priority || filters.category
              ? 'Try adjusting your filters to see more results.'
              : 'There are no support tickets in the system yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-chilled-gray-200 rounded-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-chilled-gray-50 border-b border-chilled-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-chilled-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-chilled-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Ticket className="w-4 h-4 text-chilled-gray-400 mr-2" />
                        <span className="text-sm font-medium text-charcoal-500">
                          {ticket.ticketNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-charcoal-500">
                        {ticket.customerName}
                      </div>
                      <div className="text-xs text-chilled-gray-400">
                        {ticket.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-chilled-gray-400">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TicketPriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-chilled-gray-400">
                        {ticket.assignedToName || (
                          <span className="text-chilled-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-chilled-gray-500">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTicketClick(ticket.id);
                        }}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-1 rounded-lg transition-colors active:bg-primary-600 active: active:hover:bg-primary-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-chilled-gray-200">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 hover:bg-chilled-gray-50 cursor-pointer transition-colors"
                onClick={() => handleTicketClick(ticket.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <Ticket className="w-4 h-4 text-chilled-gray-400 mr-2" />
                    <span className="text-sm font-medium text-charcoal-500">
                      {ticket.ticketNumber}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-charcoal-500">
                    {ticket.customerName}
                  </p>
                  <p className="text-xs text-chilled-gray-400">{ticket.subject}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-chilled-gray-400">
                  <span>{ticket.category}</span>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
                {ticket.assignedToName && (
                  <div className="mt-2 text-xs text-chilled-gray-600">
                    Assigned to: {ticket.assignedToName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsList;
