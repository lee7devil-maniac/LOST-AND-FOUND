import { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, User, Clock, ChevronRight, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import ChatWindow from '../components/ChatWindow';

const MyChats = () => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedThread, setSelectedThread] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchThreads();
        const interval = setInterval(fetchThreads, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchThreads = async () => {
        try {
            const response = await api.get('/messages/threads');
            setThreads(response.data.data);
        } catch (error) {
            console.error('Failed to fetch chat threads');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-mcc-maroon border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in px-4 py-8">
            <header className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                    My <span className="text-emerald-500">Conversations</span>
                </h1>
                <p className="text-gray-500">Direct messages regarding your lost and found items.</p>
            </header>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                {threads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
                        <div className="p-6 bg-gray-50 rounded-full text-gray-300">
                            <Inbox size={48} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">No conversations yet</h3>
                            <p className="text-sm text-gray-500">When you message an owner or someone messages you, they will appear here.</p>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-mcc-maroon text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
                        >
                            Explore Hub Directory
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {threads.map((thread, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedThread(thread)}
                                className="w-full flex items-center gap-6 p-6 hover:bg-gray-50 transition-colors text-left group"
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-mcc-maroon/10 group-hover:text-mcc-maroon transition-colors shadow-sm">
                                        <User size={24} />
                                    </div>
                                    {thread.unread && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-base font-bold text-gray-900 truncate">{thread.otherUser.name}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            <Clock size={12} /> {formatDistanceToNow(new Date(thread.timestamp))}
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-mcc-maroon italic mb-2">Re: {thread.item.title}</p>
                                    <p className={`text-sm truncate ${thread.unread ? 'font-bold text-gray-900' : 'text-gray-500 font-medium'}`}>
                                        {thread.lastMessage}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <ChevronRight className="text-gray-300 group-hover:text-mcc-maroon transform group-hover:translate-x-1 transition-all" size={20} />
                                    {thread.unread && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-black rounded-full uppercase">New</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selectedThread && (
                <ChatWindow
                    itemId={selectedThread.item._id}
                    receiverId={selectedThread.otherUser._id}
                    receiverName={selectedThread.otherUser.name}
                    onClose={() => {
                        setSelectedThread(null);
                        fetchThreads(); // Refresh threads to clear unread status
                    }}
                />
            )}
        </div>
    );
};

export default MyChats;
