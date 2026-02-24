import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Search, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationDrawer from './NotificationDrawer';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const { user } = useAuth();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800 transition-colors duration-300">
                <div className="px-4 py-3 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 sm:hidden"
                            >
                                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-mcc-maroon rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-mcc-maroon/20 font-sans">
                                    M
                                </div>
                                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:block">
                                    MCC <span className="text-mcc-maroon font-black">Nexus</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 max-w-md mx-8 hidden md:block">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Deep search items..."
                                    className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-mcc-maroon/20 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsNotificationsOpen(true)}
                                className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all group"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-mcc-maroon rounded-full border-2 border-white dark:border-slate-700"></span>
                            </button>

                            <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                            <div className="flex items-center gap-3 pl-1">
                                <div className="text-right hidden sm:block leading-tight">
                                    <p className="text-sm font-black text-gray-900 dark:text-white mb-0.5">{user?.name || 'Session'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role || 'Guest'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mcc-maroon to-mcc-light p-0.5 shadow-soft">
                                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                                        <User size={20} className="text-mcc-maroon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <NotificationDrawer
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={[]} // Will be populated from hook/API soon
            />
        </>
    );
};

export default Navbar;
