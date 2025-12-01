import { useState, useEffect } from 'react';
import chatService from '@/services/chatService';

export const useChatRoom = (chatRoomId, currentUserId) => {
    const [typingUser, setTypingUser] = useState(null);
    const [otherUserPresence, setOtherUserPresence] = useState(null);

    useEffect(() => {
        if (!chatRoomId) return;

        // Subscribe to typing indicators
        const typingSubscription = chatService.subscribeToTyping(chatRoomId, (typing) => {
            if (typing.userId !== currentUserId) {
                if (typing.isTyping) {
                    setTypingUser(typing.userName);
                    // Auto-clear after 3 seconds is handled by the UI component usually, 
                    // but we can do it here to be safe or if the UI doesn't handle it.
                    // However, the previous implementation in MessageList cleared it after 3s.
                    // Let's keep it simple here and let the component handle the timeout 
                    // or handle it here.
                    setTimeout(() => setTypingUser(null), 3000);
                } else {
                    setTypingUser(null);
                }
            }
        });

        return () => {
            if (typingSubscription) typingSubscription.unsubscribe();
        };
    }, [chatRoomId, currentUserId]);

    const sendTyping = (isTyping) => {
        chatService.sendTypingIndicator(chatRoomId, isTyping);
    };

    return {
        typingUser,
        sendTyping
    };
};

export default useChatRoom;
