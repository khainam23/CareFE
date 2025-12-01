import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = 'http://localhost:8080/ws';
const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

class ChatWebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.subscriptions = new Map();
    this.messageQueue = [];
    this.connectionCallbacks = [];
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve(this.client);
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log('[STOMP Debug]', str);
        },
        reconnectDelay: RECONNECT_DELAY,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected');
          this.connected = true;
          this.reconnectAttempts = 0;
          
          // Process queued messages
          this.processMessageQueue();
          
          // Notify connection callbacks
          this.connectionCallbacks.forEach(callback => callback(true));
          
          resolve(this.client);
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          this.connected = false;
          this.connectionCallbacks.forEach(callback => callback(false));
          reject(new Error('WebSocket connection failed'));
        },
        onWebSocketClose: () => {
          console.log('WebSocket closed');
          this.connected = false;
          this.connectionCallbacks.forEach(callback => callback(false));
          
          // Attempt reconnection
          if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
          }
        },
      });

      this.client.activate();
    });
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
      this.client = null;
    }
  }

  subscribe(destination, callback) {
    if (!this.connected || !this.client) {
      console.warn('Cannot subscribe: WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
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
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  isConnected() {
    return this.connected;
  }
}

export default new ChatWebSocketService();
