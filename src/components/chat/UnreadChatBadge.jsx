import { MessageCircle } from 'lucide-react';
import useUnreadCount from '@/hooks/useUnreadCount';

const UnreadChatBadge = ({ className = '' }) => {
  const { unreadCount } = useUnreadCount();

  if (unreadCount === 0) return null;

  return (
    <div className={`relative inline-flex ${className}`}>
      <MessageCircle size={20} />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
};

export default UnreadChatBadge;
