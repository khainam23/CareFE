import { useState, useEffect, useCallback, useRef } from 'react';
import chatService from '@/services/chatService';

/**
 * Custom hook to manage WebSocket connection and subscriptions
 * @returns {Object} WebSocket connection state and methods
 */
export const useWebSocket = () => {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const subscriptionsRef = useRef(new Map());

    useEffect(() => {
        // Monitor connection status
        const unsubscribe = chatService.onConnectionChange((isConnected) => {
            setConnected(isConnected);
            setConnecting(false);
        });

        // Check initial connection status
        setConnected(chatService.isConnected());

        return () => {
            unsubscribe();
            // Cleanup all subscriptions
            subscriptionsRef.current.forEach((subscription) => {
                if (subscription && subscription.unsubscribe) {
                    subscription.unsubscribe();
                }
            });
            subscriptionsRef.current.clear();
        };
    }, []);

    /**
     * Subscribe to a WebSocket topic
     * @param {string} topic - The topic to subscribe to
     * @param {Function} callback - Callback function to handle messages
     * @returns {Function} Unsubscribe function
     */
    const subscribe = useCallback((topic, callback) => {
        if (!connected) {
            console.warn(`Cannot subscribe to ${topic}: WebSocket not connected`);
            return () => { };
        }

        // Unsubscribe from existing subscription if any
        if (subscriptionsRef.current.has(topic)) {
            const existingSub = subscriptionsRef.current.get(topic);
            if (existingSub && existingSub.unsubscribe) {
                existingSub.unsubscribe();
            }
        }

        // Create new subscription
        const subscription = chatService.subscribeToRoom(topic, callback);
        subscriptionsRef.current.set(topic, subscription);

        // Return unsubscribe function
        return () => {
            if (subscription && subscription.unsubscribe) {
                subscription.unsubscribe();
            }
            subscriptionsRef.current.delete(topic);
        };
    }, [connected]);

    /**
     * Subscribe to typing indicators for a chat room
     * @param {number} roomId - Chat room ID
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    const subscribeToTyping = useCallback((roomId, callback) => {
        const topic = `/topic/chat/${roomId}/typing`;
        return subscribe(topic, callback);
    }, [subscribe]);

    /**
     * Subscribe to read receipts for a chat room
     * @param {number} roomId - Chat room ID
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    const subscribeToRead = useCallback((roomId, callback) => {
        const topic = `/topic/chat/${roomId}/read`;
        return subscribe(topic, callback);
    }, [subscribe]);

    /**
     * Subscribe to presence updates for a user
     * @param {number} userId - User ID
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    const subscribeToPresence = useCallback((userId, callback) => {
        const topic = `/topic/presence/${userId}`;
        return subscribe(topic, callback);
    }, [subscribe]);

    /**
     * Send a message through WebSocket
     * @param {string} destination - Destination topic
     * @param {Object} message - Message payload
     */
    const send = useCallback((destination, message) => {
        if (!connected) {
            console.warn('Cannot send message: WebSocket not connected');
            return;
        }
        chatService.send(destination, message);
    }, [connected]);

    return {
        connected,
        connecting,
        subscribe,
        subscribeToTyping,
        subscribeToRead,
        subscribeToPresence,
        send,
        isConnected: () => connected,
    };
};

export default useWebSocket;
