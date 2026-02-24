import { MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ItemCard = ({ item }) => {
    return (
        <div className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-soft hover:shadow-2xl hover:shadow-mcc-maroon/10 transition-all duration-500 transform hover:-translate-y-2">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                {item.imageUrl ? (
                    <img
                        src={`http://localhost:5000${item.imageUrl}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-slate-500 italic text-sm">No Preview Image</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className={(`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${item.type === 'lost'
                            ? 'bg-red-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`)}>
                        {item.type}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-gray-200 backdrop-blur-sm">
                        {item.category}
                    </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button className="w-full bg-white text-gray-900 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        View Item <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-mcc-maroon transition-colors line-clamp-1">
                        {item.title}
                    </h3>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
                    {item.description}
                </p>

                <div className="flex flex-col gap-3 pt-4 border-t border-gray-50 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={14} className="text-mcc-maroon" />
                        <span className="font-medium truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <Clock size={14} />
                            <span>{formatDistanceToNow(new Date(item.createdAt))} ago</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-bold uppercase">
                            <ShieldCheck size={14} />
                            Verified
                        </div>
                    </div>
                </div>
            </div>

            {/* Claim Overlay Trigger */}
            <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-mcc-maroon rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                <PlusCircle size={20} />
            </button>
        </div>
    );
};

export default ItemCard;
