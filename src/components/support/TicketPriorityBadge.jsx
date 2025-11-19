const TicketPriorityBadge = ({ priority }) => {
  const priorityConfig = {
    LOW: {
      label: 'Low',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    MEDIUM: {
      label: 'Medium',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    HIGH: {
      label: 'High',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    URGENT: {
      label: 'Urgent',
      className: 'bg-red-100 text-red-700 border-red-200',
    },
  };

  const config = priorityConfig[priority] || priorityConfig.LOW;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default TicketPriorityBadge;
