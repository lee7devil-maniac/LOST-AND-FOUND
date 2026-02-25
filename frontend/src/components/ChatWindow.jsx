import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { X, Send, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatWindow = ({ itemId, receiverId, receiverName, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        // Get current user ID from local storage or context
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) setCurrentUserId(user.id);

        fetchMessages();

        // Polling for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [itemId, receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/messages/${itemId}/${receiverId}`);
            setMessages(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await api.post('/messages', {
                receiverId,
                itemId,
                text: newMessage
            });

            setMessages([...messages, response.data.data]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 animate-slide-up overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-mcc-maroon text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold leading-tight">{receiverName}</p>
                        <p className="text-[10px] opacity-70">Contacting Reporter</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-mcc-maroon border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                        <div className="p-4 bg-gray-100 rounded-full text-gray-400">
                            <MessageSquare size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-500">No messages yet</p>
                        <p className="text-xs text-gray-400">Start a conversation about this item.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === currentUserId ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm ${msg.sender === currentUserId
                                    ? 'bg-mcc-maroon text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                {msg.text}
                                <p className={`text-[9px] mt-1 opacity-60 ${msg.sender === currentUserId ? 'text-right' : 'text-left'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-mcc-maroon/20"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="p-2 bg-mcc-maroon text-white rounded-xl hover:scale-105 transition-transform"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
