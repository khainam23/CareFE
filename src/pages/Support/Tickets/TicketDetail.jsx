import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Tag, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Swal from 'sweetalert2';
import supportService from '@services/supportService';
import Loading from '@components/common/Loading';
import TicketStatusBadge from '@components/support/TicketStatusBadge';
import TicketPriorityBadge from '@components/support/TicketPriorityBadge';
import ResolveTicketModal from '@components/support/ResolveTicketModal';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  const fetchTicketDetail = async () => {
    try {
      setLoading(true);
      const response = await supportService.getTicketById(id);
      
      if (response.success) {
        setTicket(response.data);
      } else {
        throw new Error(response.message || 'Failed to load ticket');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      Swal.fire({
        icon: 'error',
        title: 'Ticket Not Found',
        text: error.message || 'The ticket you are looking for does not exist or you do not have permission to view it.',
        confirmButtonColor: '#06b6d4',
      }).then(() => {
        navigate('/support/tickets');
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === ticket.status) {
      return; // No change
    }

    try {
      setUpdatingStatus(true);
      const response = await supportService.updateTicketStatus(id, newStatus);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Ticket status has been updated to ${newStatus}`,
          confirmButtonColor: '#06b6d4',
          timer: 2000,
        });
        
        // Refresh ticket details
        await fetchTicketDetail();
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update ticket status. Please try again.',
        confirmButtonColor: '#06b6d4',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleResolveTicket = async (resolution) => {
    try {
      const response = await supportService.resolveTicket(id, resolution);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Ticket Resolved',
          text: 'The ticket has been successfully resolved.',
          confirmButtonColor: '#06b6d4',
          timer: 2000,
        });
        
        // Close modal
        setShowResolveModal(false);
        
        // Refresh ticket details
        await fetchTicketDetail();
      } else {
        throw new Error(response.message || 'Failed to resolve ticket');
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
      Swal.fire({
        icon: 'error',
        title: 'Resolution Failed',
        text: error.message || 'Failed to resolve ticket. Please try again.',
        confirmButtonColor: '#06b6d4',
      });
      throw error; // Re-throw to let modal handle the error state
    }
  };

  const handleEscalateTicket = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Escalate to Admin?',
      text: 'This ticket will be escalated to an administrator. This action cannot be undone.',
      input: 'textarea',
      inputLabel: 'Escalation Reason (Optional)',
      inputPlaceholder: 'Enter reason for escalation...',
      showCancelButton: true,
      confirmButtonText: 'Escalate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      inputValidator: (value) => {
        if (value && value.length > 500) {
          return 'Reason must be less than 500 characters';
        }
      }
    });

    if (result.isConfirmed) {
      try {
        const reason = result.value || '';
        const response = await supportService.escalateTicket(id, reason);
        
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Ticket Escalated',
            text: 'The ticket has been successfully escalated to an administrator.',
            confirmButtonColor: '#06b6d4',
            timer: 2000,
          }).then(() => {
            // Navigate back to tickets list
            navigate('/support/tickets');
          });
        } else {
          throw new Error(response.message || 'Failed to escalate ticket');
        }
      } catch (error) {
        console.error('Error escalating ticket:', error);
        Swal.fire({
          icon: 'error',
          title: 'Escalation Failed',
          text: error.message || 'Failed to escalate ticket. Please try again.',
          confirmButtonColor: '#06b6d4',
        });
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => navigate('/support/tickets')}
            className="p-2 hover:bg-chilled-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-chilled-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900">
              Ticket #{ticket.ticketNumber}
            </h1>
            <p className="text-xs sm:text-sm text-chilled-gray-600 mt-1">
              Created {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <TicketStatusBadge status={ticket.status} />
          <TicketPriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject */}
          <div className="bg-white rounded-lg shadow-sm border border-chilled-gray-200 p-6">
            <h2 className="text-lg font-semibold text-charcoal-900 mb-2">
              {ticket.subject}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-chilled-gray-600">
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{ticket.category}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-chilled-gray-200 p-6">
            <h3 className="text-base font-semibold text-charcoal-900 mb-3">
              Description
            </h3>
            <p className="text-chilled-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Resolution */}
          {ticket.resolution && (
            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-green-900 mb-2">
                    Resolution
                  </h3>
                  <p className="text-green-800 whitespace-pre-wrap">
                    {ticket.resolution}
                  </p>
                  {ticket.resolvedAt && (
                    <p className="text-sm text-green-700 mt-3">
                      Resolved on {formatDate(ticket.resolvedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-chilled-gray-200 p-6">
            <h3 className="text-base font-semibold text-charcoal-900 mb-4">
              Customer Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-chilled-gray-600">Name</p>
                  <p className="text-sm font-medium text-charcoal-900">
                    {ticket.customerName}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-chilled-gray-600">Email</p>
                  <a
                    href={`mailto:${ticket.customerEmail}`}
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
                  >
                    {ticket.customerEmail}
                  </a>
                </div>
              </div>
              {ticket.customerPhone && (
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-chilled-gray-600">Phone</p>
                    <a
                      href={`tel:${ticket.customerPhone}`}
                      className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
                    >
                      {ticket.customerPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Information */}
          <div className="bg-white rounded-lg shadow-sm border border-chilled-gray-200 p-6">
            <h3 className="text-base font-semibold text-charcoal-900 mb-4">
              Ticket Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-chilled-gray-600">Created</p>
                  <p className="text-sm font-medium text-charcoal-900">
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-chilled-gray-600">Last Updated</p>
                  <p className="text-sm font-medium text-charcoal-900">
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-chilled-gray-600">Assigned To</p>
                  <p className="text-sm font-medium text-charcoal-900">
                    {ticket.assignedToName || 'Unassigned'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-chilled-gray-600">Priority</p>
                  <p className="text-sm font-medium text-charcoal-900">
                    {ticket.priority}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-chilled-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-chilled-gray-600">Category</p>
                  <p className="text-sm font-medium text-charcoal-900">
                    {ticket.category}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-chilled-gray-200 p-6">
            <h3 className="text-base font-semibold text-charcoal-900 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              {/* Status Update Dropdown */}
              <div>
                <label className="block text-sm font-medium text-chilled-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updatingStatus}
                  className="w-full px-3 py-2 border border-chilled-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-chilled-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                {updatingStatus && (
                  <p className="text-xs text-chilled-gray-500 mt-1">
                    Updating status...
                  </p>
                )}
              </div>

              {/* Resolve Ticket Button */}
              {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolve Ticket</span>
                </button>
              )}

              {/* Escalate to Admin Button */}
              {ticket.status !== 'ESCALATED' && ticket.status !== 'CLOSED' && (
                <button
                  onClick={handleEscalateTicket}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Escalate to Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resolve Ticket Modal */}
      <ResolveTicketModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onSubmit={handleResolveTicket}
        ticketNumber={ticket.ticketNumber}
      />
    </div>
  );
};

export default TicketDetail;
