import { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
    const [stats, setStats] = useState({ items: 0, users: 0, claims: 0 });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const { data } = await api.get('/items'); // This would ideally be an admin specific route
                setItems(data.data);
                setStats({ items: data.data.length, users: 154, claims: 24 });
            } catch (err) {
                toast.error('Failed to load administrative data');
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this report from Nexus?')) return;
        try {
            await api.delete(`/items/${id}`);
            setItems(items.filter(i => i._id !== id));
            toast.success('Report purged successfully');
        } catch (err) {
            toast.error('Purge failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mcc-maroon/10 text-mcc-maroon text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Shield size={12} /> Restricted Access
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Admin <span className="text-mcc-maroon">Lost 'n' Found</span>
                    </h1>
                    <p className="text-gray-500">Moderating campus activity and system health.</p>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Platform Reports', value: stats.items, color: 'text-mcc-maroon', bg: 'bg-mcc-maroon/5' },
                    { label: 'Verified Users', value: stats.users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending Claims', value: stats.claims, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Management Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-gray-900">Active Reports Management</h3>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="bg-gray-50 border-none rounded-2xl py-2.5 pl-11 pr-6 text-sm w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity / Item</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reporter</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status / Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                                {item.imageUrl ? <img src={`http://localhost:5000${item.imageUrl}`} alt="" className="w-full h-full object-cover" /> : <Shield className="text-gray-300" size={20} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.title}</p>
                                                <p className="text-[11px] text-gray-500 font-medium italic">{item.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                        {item.postedBy?.name}
                                        <p className="text-[10px] text-gray-400 font-normal">{item.postedBy?.username}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.type === 'lost' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                                {item.type}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500">
                                                {item.category}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
