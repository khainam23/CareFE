import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const WEBSOCKET_URL = `${API_BASE_URL}/ws`;
const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

class ChatWebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.subscriptions = new Map(); // Map<destination, callback>
    this.stompSubscriptions = new Map(); // Map<destination, StompSubscription>
    this.messageQueue = [];
    this.connectionCallbacks = [];
    this.token = null;
  }

  connect(token) {
    if (token) this.token = token;

    return new Promise((resolve, reject) => {
      if (this.connected && this.client && this.client.active) {
        resolve(this.client);
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),
        connectHeaders: {
          Authorization: `Bearer ${this.token}`,
        },
        debug: (str) => {
          // console.log('[STOMP Debug]', str);
        },
        reconnectDelay: RECONNECT_DELAY,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected');
          this.connected = true;
          this.reconnectAttempts = 0;

          // Resubscribe to all topics
          this.resubscribeAll();

          // Process queued messages
          this.processMessageQueue();

          // Notify connection callbacks
          this.connectionCallbacks.forEach(callback => callback(true));

          resolve(this.client);
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          // Don't set connected = false here immediately, let the client handle reconnect
        },
        onWebSocketClose: () => {
          console.log('WebSocket closed');
          this.connected = false;
          this.connectionCallbacks.forEach(callback => callback(false));
        },
      });

      this.client.activate();
    });
  }

  disconnect() {
    if (this.client) {
      this.stompSubscriptions.forEach((sub) => sub.unsubscribe());
      this.stompSubscriptions.clear();
      this.client.deactivate();
      this.connected = false;
      this.client = null;
    }
  }

  subscribe(destination, callback) {
    // Initialize set for this destination if not exists
    if (!this.subscriptions.has(destination)) {
      this.subscriptions.set(destination, new Set());
    }

    // Add callback to the set
    this.subscriptions.get(destination).add(callback);

    // If connected and not yet subscribed to STOMP for this destination, do it
    if (this.connected && this.client && !this.stompSubscriptions.has(destination)) {
      this._doSubscribe(destination);
    } else if (!this.connected) {
      console.log(`Queueing subscription for ${destination}`);
    }

    // Return an unsubscribe function specific to this callback
    return {
      unsubscribe: () => this.unsubscribe(destination, callback)
    };
  }

  _doSubscribe(destination) {
    // Avoid double subscription
    if (this.stompSubscriptions.has(destination)) {
      return;
    }

    try {
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          // Notify all subscribers for this destination
          const callbacks = this.subscriptions.get(destination);
          if (callbacks) {
            callbacks.forEach(cb => {
              try {
                cb(data);
              } catch (err) {
                console.error('Error in subscription callback:', err);
              }
            });
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
      this.stompSubscriptions.set(destination, subscription);
      console.log(`Subscribed to ${destination}`);
    } catch (error) {
      console.error(`Failed to subscribe to ${destination}:`, error);
    }
  }

  resubscribeAll() {
    console.log('Resubscribing to all topics...');
    this.subscriptions.forEach((callbacks, destination) => {
      this._doSubscribe(destination);
    });
  }

  unsubscribe(destination, callback) {
    // Remove specific callback
    const callbacks = this.subscriptions.get(destination);
    if (callbacks) {
      callbacks.delete(callback);

      // If no more callbacks for this destination, unsubscribe from STOMP
      if (callbacks.size === 0) {
        this.subscriptions.delete(destination);

        const subscription = this.stompSubscriptions.get(destination);
        if (subscription) {
          subscription.unsubscribe();
          this.stompSubscriptions.delete(destination);
          console.log(`Unsubscribed from ${destination}`);
        }
      }
    }
  }

  send(destination, body) {
    if (!this.connected || !this.client) {
      console.warn('Cannot send: WebSocket not connected. Queueing message...');
      this.messageQueue.push({ destination, body });
      return;
    }

    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      this.messageQueue.push({ destination, body });
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { destination, body } = this.messageQueue.shift();
      this.send(destination, body);
    }
  }

  onConnectionChange(callback) {
    this.connectionCallbacks.push(callback);
    // Immediately notify current state
    callback(this.connected);
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  isConnected() {
    return this.connected;
  }
}

export default new ChatWebSocketService();
