import { useState, useEffect } from 'react';
import { History, Search, Package, ArrowRight } from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyActivity = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyItems = async () => {
        try {
            const { data } = await api.get('/items/me');
            setItems(data.data);
        } catch (err) {
            console.error('Failed to fetch my items');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/items/${id}`);
            toast.success('Report deleted successfully');
            setItems(items.filter(item => item._id !== id));
        } catch (err) {
            toast.error('Failed to delete report');
        }
    };

    useEffect(() => {
        fetchMyItems();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mcc-maroon/10 text-mcc-maroon text-[10px] font-bold uppercase tracking-widest">
                        <History size={12} /> Personal Archives
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        My <span className="text-mcc-maroon">Activity</span>
                    </h1>
                    <p className="text-gray-500 max-w-md">
                        Track every item you've reported. Keep the campus connected.
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="h-80 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
                        <Package size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No reports yet</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">You haven't reported any lost or found items yet.</p>
                    <Link to="/report" className="bg-mcc-maroon text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-mcc-maroon/20 hover:scale-105 transition-all">
                        Report an Item
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                    {items.map(item => (
                        <ItemCard key={item._id} item={item} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyActivity;
