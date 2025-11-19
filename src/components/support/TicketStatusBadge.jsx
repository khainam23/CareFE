const TicketStatusBadge = ({ status }) => {
  const statusConfig = {
    OPEN: {
      label: 'Open',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    RESOLVED: {
      label: 'Resolved',
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    CLOSED: {
      label: 'Closed',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    ESCALATED: {
      label: 'Escalated',
      className: 'bg-purple-100 text-purple-700 border-purple-200',
    },
  };

  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default TicketStatusBadge;
