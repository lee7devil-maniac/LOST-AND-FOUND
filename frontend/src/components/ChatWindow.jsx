import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { X, Send, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChatWindow = ({ itemId, receiverId, receiverName, onClose }) => {
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const currentUserId = currentUser?._id || currentUser?.id;

    useEffect(() => {
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
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col z-[100] animate-slide-up overflow-hidden ring-1 ring-black/5">
            {/* Header */}
            <div className="p-5 bg-mcc-maroon text-white flex items-center justify-between shadow-lg shadow-mcc-maroon/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-black leading-tight tracking-tight">{receiverName}</p>
                        <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Active Thread</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-6 h-6 border-2 border-mcc-maroon border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center text-gray-200 shadow-soft">
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">Nexus Connection Established</p>
                            <p className="text-xs text-gray-400 font-medium">Be the first to send a message</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // Compare ID as string to be safe
                        const msgSenderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                        const isSender = msgSenderId.toString() === currentUserId?.toString();

                        return (
                            <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed transition-all shadow-sm ${isSender
                                        ? 'bg-mcc-maroon text-white rounded-tr-none shadow-mcc-maroon/10'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-gray-200/50'
                                    }`}>
                                    <p className="font-medium">{msg.text}</p>
                                    <p className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-40 ${isSender ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-50 flex gap-3">
                <input
                    type="text"
                    placeholder="Brief report..."
                    className="flex-1 px-5 py-3 bg-gray-50 rounded-2xl text-sm font-medium outline-none border border-gray-100 focus:ring-4 focus:ring-mcc-maroon/5 focus:bg-white transition-all"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="p-3 bg-mcc-maroon text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-mcc-maroon/20"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
