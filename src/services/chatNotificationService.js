// Browser notification utilities for chat messages

class ChatNotificationService {
    constructor() {
        this.permission = 'default';
        this.soundEnabled = this.getSoundPreference();
        this.notificationSound = null;
    }

    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            this.permission = 'granted';
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        }

        return false;
    }

    // Show notification for new message
    showMessageNotification(senderName, messagePreview, chatRoomId, onClick) {
        if (this.permission !== 'granted') return;

        // Don't show if window is focused
        if (document.hasFocus()) return;

        const notification = new Notification(`New message from ${senderName}`, {
            body: messagePreview,
            icon: '/logo.png', // Add your app logo here
            badge: '/logo.png',
            tag: `chat-${chatRoomId}`, // Prevent duplicate notifications
            requireInteraction: false,
            silent: false,
        });

        notification.onclick = () => {
            window.focus();
            if (onClick) onClick();
            notification.close();
        };

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        // Play sound if enabled
        if (this.soundEnabled) {
            this.playNotificationSound();
        }
    }

    // Play notification sound
    playNotificationSound() {
        try {
            // Create audio element if not exists
            if (!this.notificationSound) {
                this.notificationSound = new Audio('/notification.mp3'); // Add your sound file
                this.notificationSound.volume = 0.5;
            }

            // Play sound
            this.notificationSound.currentTime = 0;
            this.notificationSound.play().catch(err => {
                console.warn('Failed to play notification sound:', err);
            });
        } catch (error) {
            console.warn('Error playing notification sound:', error);
        }
    }

    // Toggle sound preference
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('chatNotificationSound', this.soundEnabled ? 'enabled' : 'disabled');
        return this.soundEnabled;
    }

    // Get sound preference from localStorage
    getSoundPreference() {
        const preference = localStorage.getItem('chatNotificationSound');
        return preference !== 'disabled'; // Default to enabled
    }

    // Check if notifications are enabled
    isEnabled() {
        return this.permission === 'granted';
    }
}

// Export singleton instance
export const chatNotificationService = new ChatNotificationService();
export default chatNotificationService;
