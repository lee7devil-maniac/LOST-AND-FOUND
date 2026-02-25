import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Shield, Trash2, CheckCircle, Clock, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { IMAGE_BASE_URL } from '../utils/constants';

const AdminPanel = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await api.get('/items');
            setItems(response.data);
        } catch (error) {
            toast.error('Failed to load system reports');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this report from Nexus?')) return;
        try {
            await api.delete(`/items/${id}`);
            toast.success('Entry removed from the system');
            fetchItems();
        } catch (error) {
            toast.error('Cleanup operation failed');
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || item.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-mcc-maroon border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in px-4 py-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Assets</p>
                    <p className="text-3xl font-black text-gray-900">{items.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Open Reports</p>
                    <p className="text-3xl font-black text-yellow-500">{items.filter(i => i.status === 'open').length}</p>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Resolved</p>
                    <p className="text-3xl font-black text-green-500">{items.filter(i => i.status === 'resolved').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by item title or description..."
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-mcc-maroon/10 focus:border-mcc-maroon outline-none transition-all font-medium text-gray-900 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Resource</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Reporter</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                                                {item.imageUrl ? <img src={`${IMAGE_BASE_URL}${item.imageUrl}`} alt="" className="w-full h-full object-cover" /> : <Shield className="text-gray-300" size={20} />}
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
