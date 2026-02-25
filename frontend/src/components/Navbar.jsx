import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Search, Menu, X, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import NotificationDrawer from './NotificationDrawer';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const { user } = useAuth();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch Notifications
                const { data: notifData } = await api.get('/notifications');
                setNotifications(notifData.data || []);

                // Fetch Chat Threads for unread count
                const { data: chatData } = await api.get('/messages/threads');
                if (chatData.data) {
                    const unreadTotal = chatData.data.reduce((acc, thread) => acc + (thread.unread ? 1 : 0), 0);
                    setUnreadMessages(unreadTotal);
                }
            } catch (err) {
                console.error('Failed to fetch navbar data');
            }
        };
        fetchData();
        // Set up polling
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 transition-colors duration-300">
                <div className="px-4 py-3 lg:px-6">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 lg:hidden"
                            >
                                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <Link to="/dashboard" className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-mcc-maroon rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-mcc-maroon/20 font-sans">
                                    M
                                </div>
                                <span className="text-base sm:text-xl font-bold tracking-tight text-gray-900 line-clamp-1">
                                    MCC <span className="text-mcc-maroon font-black hidden xs:inline">Lost 'n' Found</span>
                                </span>
                            </Link>
                        </div>

                        <div className="flex-1 max-w-sm mx-4 hidden md:block">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-gray-50 border-none rounded-2xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-mcc-maroon/20 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Chat Badge */}
                            <Link to="/messages" className="relative p-2 sm:p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all group">
                                <MessageSquare size={18} />
                                {unreadMessages > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                                        {unreadMessages}
                                    </span>
                                )}
                            </Link>

                            <button
                                onClick={() => setIsNotificationsOpen(true)}
                                className="relative p-2 sm:p-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all group"
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-mcc-maroon text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <div className="h-6 w-px bg-gray-200 mx-0.5 sm:mx-1 hidden xs:block"></div>

                            <Link to="/profile" className="flex items-center gap-2 pl-1 group hover:opacity-80 transition-opacity cursor-pointer">
                                <div className="text-right hidden sm:block leading-tight">
                                    <p className="text-sm font-black text-gray-900 mb-0.5 truncate max-w-[100px]">{user?.name || 'Session'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{user?.role || 'Guest'}</p>
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-mcc-maroon to-mcc-light p-0.5 shadow-soft shrink-0">
                                    <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center overflow-hidden">
                                        <User size={18} className="text-mcc-maroon" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <NotificationDrawer
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
            />
        </>
    );
};

export default Navbar;
