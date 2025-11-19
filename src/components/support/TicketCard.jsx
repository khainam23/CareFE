import { Clock, User as UserIcon } from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';

const TicketCard = ({ ticket, onAssign, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className="bg-white border border-chilled-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-charcoal-900 mb-1">
            #{ticket.ticketNumber}
          </h3>
          <p className="text-sm text-chilled-gray-600">{ticket.subject}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketStatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-3">
        <p className="text-sm text-chilled-gray-700">
          <span className="font-medium">Customer:</span> {ticket.customerName}
        </p>
        <p className="text-sm text-chilled-gray-700">
          <span className="font-medium">Category:</span> {ticket.category}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-chilled-gray-100">
        <div className="flex items-center gap-4 text-xs text-chilled-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          {ticket.assignedToName && (
            <div className="flex items-center gap-1">
              <UserIcon size={14} />
              <span>{ticket.assignedToName}</span>
            </div>
          )}
        </div>

        {/* Assign Button */}
        {onAssign && !ticket.assignedToId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign(ticket.id);
            }}
            className="px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
          >
            Assign to Me
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
