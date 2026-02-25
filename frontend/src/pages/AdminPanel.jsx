import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Shield, Trash2, CheckCircle, Clock, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { IMAGE_BASE_URL } from '../utils/constants';

const AdminPanel = () => {
    const [items, setItems] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [adminView, setAdminView] = useState('items'); // 'items' or 'claims'

    useEffect(() => {
        fetchData();
    }, [adminView]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (adminView === 'items') {
                const response = await api.get('/items');
                setItems(response.data);
            } else {
                // We need an admin route for ALL claims, but using getClaims for now
                // if it only returns user-owned claims, we might need a dedicated admin route.
                // Assuming admin can see all for now or adding a new route.
                const response = await api.get('/claims');
                setClaims(response.data.data || response.data);
            }
        } catch (error) {
            toast.error(`Failed to load ${adminView}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to remove this report from Nexus?')) return;
        try {
            await api.delete(`/items/${id}`);
            toast.success('Entry removed from the system');
            fetchData();
        } catch (error) {
            toast.error('Cleanup operation failed');
        }
    };

    const handleDeleteClaim = async (id) => {
        if (!window.confirm('Are you sure you want to delete this claim?')) return;
        try {
            await api.delete(`/claims/${id}`);
            toast.success('Claim removed successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to remove claim');
        }
    };

    const filteredItems = items.filter(item => {
        const title = item.title || '';
        const desc = item.description || '';
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            desc.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-mcc-maroon border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in px-4 py-8 child-ani">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mcc-maroon/10 text-mcc-maroon text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Shield size={12} /> Restricted Access
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Admin <span className="text-mcc-maroon">Nexus</span>
                    </h1>
                    <p className="text-gray-500">Moderating campus activity and protecting the system.</p>
                </div>

                <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
                    <button
                        onClick={() => setAdminView('items')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminView === 'items' ? 'bg-white text-mcc-maroon shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Items
                    </button>
                    <button
                        onClick={() => setAdminView('claims')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${adminView === 'claims' ? 'bg-white text-mcc-maroon shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Claims
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={adminView === 'items' ? "Search reports..." : "Search claims..."}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-mcc-maroon/10 outline-none font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {adminView === 'items' ? 'Resource' : 'Claim Detail'}
                                </th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {adminView === 'items' ? 'Reporter' : 'Claimant'}
                                </th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {adminView === 'items' ? (
                                filteredItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                                                    {(item.images?.length > 0 || item.imageUrl) && (
                                                        <img
                                                            src={item.images?.length > 0
                                                                ? (item.images[0].startsWith('http') ? item.images[0] : `${IMAGE_BASE_URL}${item.images[0]}`)
                                                                : (item.imageUrl?.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`)}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-600">{item.postedBy?.username}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'open' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => handleDeleteItem(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                claims.map((claim) => (
                                    <tr key={claim._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-gray-900">{claim.item?.title}</p>
                                            <p className="text-xs text-gray-400 line-clamp-1">{claim.description}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-600">{claim.claimant?.username}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${claim.status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button onClick={() => handleDeleteClaim(claim._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
