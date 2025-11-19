import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, AlertCircle, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import supportService from '@services/supportService';
import { useAuthStore } from '@store/authStore';
import Loading from '@components/common/Loading';
import TicketStatusBadge from '@components/support/TicketStatusBadge';
import TicketPriorityBadge from '@components/support/TicketPriorityBadge';

const MyTicketsList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getAssignedTickets();
      if (response.success) {
        // Filter tickets by current user's ID
        const myTickets = (response.data || []).filter(
          (ticket) => ticket.assignedToId === user?.id
        );
        setTickets(myTickets);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load assigned tickets',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort tickets
  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets;

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Sort by priority (Urgent first) and creation date
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    
    return filtered.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tickets, statusFilter]);

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

  // Count tickets by status
  const statusCounts = useMemo(() => {
    return {
      OPEN: tickets.filter((t) => t.status === 'OPEN').length,
      IN_PROGRESS: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
      RESOLVED: tickets.filter((t) => t.status === 'RESOLVED').length,
    };
  }, [tickets]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">My Tickets</h1>
          <p className="text-xs sm:text-sm text-chilled-gray-600 mt-1">
            Tickets assigned to you
          </p>
        </div>
        
        {/* Assigned Count Badge */}
        <div className="bg-primary-100 text-primary-800 px-4 py-2 rounded-lg text-center sm:text-left">
          <div className="text-2xl font-bold">{tickets.length}</div>
          <div className="text-xs font-medium">Assigned to Me</div>
        </div>
      </div>

      {/* Status Filter and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter Dropdown */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Filter by Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open ({statusCounts.OPEN})</option>
            <option value="IN_PROGRESS">In Progress ({statusCounts.IN_PROGRESS})</option>
            <option value="RESOLVED">Resolved ({statusCounts.RESOLVED})</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-800">
              {statusCounts.OPEN}
            </div>
            <div className="text-xs font-medium text-orange-700">Open</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-800">
              {statusCounts.IN_PROGRESS}
            </div>
            <div className="text-xs font-medium text-blue-700">In Progress</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-800">
              {statusCounts.RESOLVED}
            </div>
            <div className="text-xs font-medium text-green-700">Resolved</div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      {filteredAndSortedTickets.length === 0 ? (
        <div className="bg-white border border-chilled-gray-200 rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-chilled-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
            No tickets found
          </h3>
          <p className="text-chilled-gray-600">
            {statusFilter
              ? `You don't have any ${statusFilter.toLowerCase().replace('_', ' ')} tickets.`
              : 'You don\'t have any assigned tickets yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-chilled-gray-200 rounded-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-chilled-gray-50 border-b border-chilled-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-700 uppercase tracking-wider">
                    Ticket #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-700 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-chilled-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-chilled-gray-200">
                {filteredAndSortedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-chilled-gray-50 cursor-pointer transition-colors ${
                      ticket.priority === 'URGENT' ? 'bg-red-50' : ''
                    }`}
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {ticket.priority === 'URGENT' && (
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                        )}
                        <Ticket className="w-4 h-4 text-chilled-gray-400 mr-2" />
                        <span className="text-sm font-medium text-charcoal-900">
                          {ticket.ticketNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-charcoal-900">
                        {ticket.customerName}
                      </div>
                      <div className="text-xs text-chilled-gray-600">
                        {ticket.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-chilled-gray-700">
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
                      <span className="text-sm text-chilled-gray-600">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTicketClick(ticket.id);
                        }}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
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
            {filteredAndSortedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-4 hover:bg-chilled-gray-50 cursor-pointer transition-colors ${
                  ticket.priority === 'URGENT' ? 'bg-red-50 border-l-4 border-red-600' : ''
                }`}
                onClick={() => handleTicketClick(ticket.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {ticket.priority === 'URGENT' && (
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <Ticket className="w-4 h-4 text-chilled-gray-400 mr-2" />
                    <span className="text-sm font-medium text-charcoal-900">
                      {ticket.ticketNumber}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium text-charcoal-900">
                    {ticket.customerName}
                  </p>
                  <p className="text-xs text-chilled-gray-600">{ticket.subject}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-chilled-gray-600">
                  <span>{ticket.category}</span>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsList;
