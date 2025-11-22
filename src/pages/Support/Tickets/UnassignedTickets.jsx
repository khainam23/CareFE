import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import supportService from '@services/supportService';
import Loading from '@components/common/Loading';
import TicketCard from '@components/support/TicketCard';

const UnassignedTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    fetchUnassignedTickets();
  }, []);

  const fetchUnassignedTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getUnassignedTickets();
      if (response.success) {
        setTickets(response.data || []);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to load unassigned tickets',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTicket = async (ticketId) => {
    try {
      setAssigning(ticketId);
      const response = await supportService.assignTicket(ticketId);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Ticket assigned to you successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Auto-refresh list after successful assignment
        await fetchUnassignedTickets();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to assign ticket',
      });
    } finally {
      setAssigning(null);
    }
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/support/tickets/${ticketId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-charcoal-500">Unassigned Tickets</h1>
          <p className="text-xs sm:text-sm text-chilled-gray-400 mt-1">
            Tickets waiting to be assigned to support staff
          </p>
        </div>
        
        {/* Unassigned Count Badge */}
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-center sm:text-left">
          <div className="text-2xl font-bold">{tickets.length}</div>
          <div className="text-xs font-medium">Unassigned</div>
        </div>
      </div>

      {/* Empty State */}
      {tickets.length === 0 ? (
        <div className="bg-white border border-chilled-gray-200 rounded-lg p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal-500 mb-2">
            All tickets are assigned!
          </h3>
          <p className="text-chilled-gray-400">
            There are no unassigned tickets at the moment. Great work!
          </p>
        </div>
      ) : (
        <>
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">
                Click "Assign to Me" to take ownership of a ticket
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Once assigned, the ticket will appear in your "My Tickets" section
              </p>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="relative">
                <TicketCard
                  ticket={ticket}
                  onAssign={handleAssignTicket}
                  onClick={() => handleTicketClick(ticket.id)}
                />
                
                {/* Loading Overlay */}
                {assigning === ticket.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-2 text-primary-600">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Assigning...</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UnassignedTickets;
