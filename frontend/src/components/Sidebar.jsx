import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Search, User, History, LogOut, ShieldCheck, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const menuItems = [
    { icon: Search, label: 'Discovery Hub', path: '/dashboard' },
    { icon: PlusCircle, label: 'Report Item', path: '/report' },
    { icon: History, label: 'Active Claims', path: '/claims' },
    { icon: MessageSquare, label: 'Conversations', path: '/messages' },
    { icon: User, label: 'My Identity', path: '/profile' },
    { icon: Bell, label: 'My Archives', path: '/my-posts' },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout, user } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={twMerge(
                    clsx(
                        "fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 z-50 transition-all duration-500 ease-nexus flex flex-col shadow-2xl lg:translate-x-0",
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    )
                )}
            >
                {/* User Presence Card */}
                <div className="p-8 pb-4">
                    <div className="bg-mcc-maroon/5 rounded-[2rem] p-6 border border-mcc-maroon/10 relative overflow-hidden group">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-mcc-maroon shadow-soft">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-mcc-maroon/60 uppercase tracking-widest">Operator</p>
                                <h3 className="font-black text-gray-900 leading-tight truncate w-32">{user?.name}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Flow */}
                <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
                    <div className="pb-4 px-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Menu</span>
                    </div>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            className={({ isActive }) =>
                                twMerge(
                                    clsx(
                                        "group flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-300",
                                        isActive
                                            ? "bg-mcc-maroon text-white shadow-xl shadow-mcc-maroon/20 scale-[1.02]"
                                            : "text-gray-500 hover:bg-gray-50"
                                    )
                                )
                            }
                        >
                            <item.icon size={20} className="transition-transform group-hover:scale-110" />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Action */}
                <div className="p-6 border-t border-gray-50 mt-auto">
                    <button
                        onClick={logout}
                        className="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 font-black hover:bg-red-50 transition-all duration-300"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 group-hover:bg-white group-hover:shadow-soft transition-all">
                            <LogOut size={20} />
                        </div>
                        <span className="text-sm uppercase tracking-widest">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
