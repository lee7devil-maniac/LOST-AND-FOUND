import { useEffect } from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const NotificationDrawer = ({ isOpen, onClose, notifications = [] }) => {
    // Backdrop effect
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>
            )}

            <div className={twMerge(
                clsx(
                    "fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )
            )}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-mcc-maroon/10 rounded-lg flex items-center justify-center text-mcc-maroon">
                                <Bell size={18} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activity Feed</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                <Bell size={48} className="mb-4 text-gray-300" />
                                <p className="text-sm font-medium">All caught up! No new notifications.</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={twMerge(
                                        clsx(
                                            "p-4 rounded-2xl border transition-all cursor-pointer group hover:shadow-soft",
                                            notif.isRead
                                                ? "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 opacity-60"
                                                : "bg-mcc-maroon/[0.03] dark:bg-mcc-maroon/5 border-mcc-maroon/10"
                                        )
                                    )}
                                >
                                    <div className="flex gap-4">
                                        <div className={twMerge(
                                            clsx(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                notif.type === 'claim' ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                                            )
                                        )}>
                                            {notif.type === 'claim' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                <Clock size={12} />
                                                <span>{formatDistanceToNow(new Date(notif.createdAt))} ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 dark:border-slate-800">
                        <button className="w-full bg-gray-50 dark:bg-slate-800 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            Mark all as read
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationDrawer;
