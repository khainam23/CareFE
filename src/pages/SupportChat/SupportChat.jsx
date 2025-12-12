import { useState, useEffect } from 'react';
import { MessageCircle, Send, ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const SupportChat = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/support-chat' } });
    }
  }, [isAuthenticated, navigate]);

  // Welcome message
  useEffect(() => {
    if (isAuthenticated && user) {
      setMessages([
        {
          id: 1,
          sender: 'support',
          senderName: 'Care Support Team',
          content: `Xin chào ${user.fullName || 'bạn'}! 👋\n\nChúng tôi là đội ngũ hỗ trợ của Care. Chúng tôi có thể giúp gì cho bạn hôm nay?`,
          timestamp: new Date(),
          type: 'system'
        }
      ]);
    }
  }, [isAuthenticated, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      senderName: user?.fullName || 'You',
      content: inputMessage,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      setIsTyping(false);
      const supportMessage = {
        id: Date.now() + 1,
        sender: 'support',
        senderName: 'Care Support Team',
        content: 'Cảm ơn bạn đã liên hệ! Đội ngũ hỗ trợ của chúng tôi sẽ phản hồi trong thời gian sớm nhất. Trong thời gian chờ đợi, bạn có thể xem các câu hỏi thường gặp hoặc liên hệ hotline: 1900-xxxx.',
        timestamp: new Date(),
        type: 'support'
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Quay lại"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 " />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Chat với Care</h1>
                    <p className="text-sm text-gray-500">Đội ngũ hỗ trợ khách hàng</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/about')}
                className="flex items-center space-x-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Trợ giúp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 '
                    : message.type === 'system'
                    ? 'bg-blue-50 border border-blue-200 text-gray-800'
                    : 'bg-white shadow-md text-gray-800'
                } rounded-2xl px-5 py-3 transform transition-all duration-200 hover:scale-[1.02]`}
              >
                {message.type !== 'user' && (
                  <p className="text-xs font-semibold mb-1 text-teal-600">
                    {message.senderName}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md rounded-2xl px-5 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-teal-500 to-teal-600  rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Thời gian phản hồi trung bình: 5-10 phút
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
