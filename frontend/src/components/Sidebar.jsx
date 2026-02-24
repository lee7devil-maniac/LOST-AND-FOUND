import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Search, History, User, ShieldCheck, LogOut, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Report Item', icon: PlusCircle, path: '/report' },
        { name: 'Search Engine', icon: Search, path: '/search' },
        { name: 'Active Claims', icon: History, path: '/claims' },
        { name: 'My Activity', icon: History, path: '/my-posts' },
        { name: 'Profile', icon: User, path: '/profile' },
        { name: 'Admin Hub', icon: ShieldCheck, path: '/admin', adminOnly: true },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm sm:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            <aside className={twMerge(
                clsx(
                    "fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-all duration-300 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900",
                    isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
                )
            )}>
                <div className="h-full px-4 pb-4 flex flex-col justify-between overflow-y-auto">
                    <div>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Menu</span>
                        </div>
                        <ul className="space-y-1.5">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => twMerge(
                                            clsx(
                                                "flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group relative",
                                                isActive
                                                    ? "bg-mcc-maroon/5 text-mcc-maroon font-semibold"
                                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                                            )
                                        )}
                                    >
                                        <item.icon size={20} className="transition-transform group-hover:scale-110" />
                                        <span className="text-sm">{item.name}</span>
                                        <div className={twMerge(
                                            clsx(
                                                "absolute left-0 w-1 h-6 bg-mcc-maroon rounded-r-full transition-opacity",
                                                "invisible group-[.active]:visible"
                                            )
                                        )}></div>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
                        <button className="flex items-center gap-3 p-3 w-full rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all group">
                            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">System Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
