import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, AlertCircle } from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const fetchItems = async () => {
        try {
            const { data } = await api.get(`/items?search=${search}&category=${category}`);
            setItems(data.data);
        } catch (err) {
            console.error('Failed to fetch items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [search, category]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-soft">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mcc-maroon/10 text-mcc-maroon text-[10px] font-bold uppercase tracking-widest">
                        <AlertCircle size={12} /> Live Updates
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                        Discovery <span className="text-mcc-maroon">Hub</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md">
                        Real-time feed of reported items across campus. Help your fellow MCCians find what they've lost.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 focus:ring-2 focus:ring-mcc-maroon/20 w-full lg:w-48 xl:w-64 text-sm transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row items-center gap-3">
                        <select
                            className="flex-1 bg-gray-50 border-none rounded-2xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-mcc-maroon/20 text-sm appearance-none cursor-pointer"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Books">Books</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Keys">Keys</option>
                            <option value="ID Cards">ID Cards</option>
                            <option value="Other">Other</option>
                        </select>

                        <Link to="/report" className="shrink-0 bg-mcc-maroon hover:bg-mcc-dark text-white px-5 sm:px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-mcc-maroon/30 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
                            <Plus size={20} /> <span className="hidden xs:inline">Report</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <div key={n} className="h-80 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
                        <Search size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No items found</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mb-8">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                    {items.map(item => (
                        <ItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
