import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch {
      return '';
    }
  };

  const getStatusIcon = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case 'READ':
        return <CheckCheck size={14} className="text-blue-500" />;
      case 'DELIVERED':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'SENT':
        return <Check size={14} className="text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn
            ? 'bg-primary-600 '
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold mb-1 opacity-70">
            {message.senderName}
          </p>
        )}
        <p className="break-words whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
            {formatTime(message.createdAt)}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
