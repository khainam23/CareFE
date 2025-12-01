import { useState, useEffect } from 'react';
import chatService from '@/services/chatService';

const OnlineStatusBadge = ({ userId }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Subscribe to presence updates
    const subscription = chatService.subscribeToPresence(userId, (presence) => {
      setIsOnline(presence.isOnline);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [userId]);

  return (
    <div
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      }`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  );
};

export default OnlineStatusBadge;
