import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ShieldCheck, ChevronLeft, Send, AlertCircle, Info, Tag, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { IMAGE_BASE_URL } from '../utils/constants';
import ChatWindow from '../components/ChatWindow';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claimDesc, setClaimDesc] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const { data } = await api.get(`/items/${id}`);
                setItem(data.data || data); // Handle both wrapped and unwrapped data
            } catch (err) {
                toast.error('Item not found');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id, navigate]);

    const handleClaim = async (e) => {
        e.preventDefault();
        if (!claimDesc.trim()) return toast.error('Please describe how this item belongs to you');

        setSubmitting(true);
        try {
            await api.post('/claims', { itemId: id, description: claimDesc });
            toast.success('Claim submitted! The reporter will be notified.');
            setClaimDesc('');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit claim');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-mcc-maroon font-bold">Loading Details...</div>;
    if (!item) return null;

    const isOwner = item.postedBy?._id === user?.id || item.postedBy === user?.id;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-mcc-maroon font-bold uppercase tracking-widest text-[10px] transition-colors">
                <ChevronLeft size={16} /> Hub Directory
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Visuals */}
                <div className="space-y-6">
                    <div className="aspect-square bg-white rounded-[3rem] border border-gray-100 shadow-soft overflow-hidden group">
                        {item.imageUrl ? (
                            <>
                                <img
                                    src={`${IMAGE_BASE_URL}${item.imageUrl}`}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                    <AlertCircle size={64} />
                                    <span className="font-bold uppercase tracking-widest text-xs">Visual Intel Unavailable</span>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                <AlertCircle size={64} />
                                <span className="font-bold uppercase tracking-widest text-xs">No Photo Available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Intel */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                {item.type}
                            </span>
                            <span className="px-4 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                {item.category}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none">{item.title}</h1>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <MapPin size={18} className="text-mcc-maroon" /> {item.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <Clock size={18} /> {formatDistanceToNow(new Date(item.createdAt))} ago
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                            <div className="flex-1 flex items-center gap-3">
                                <Info size={20} className="text-mcc-maroon" />
                                <h3 className="font-black uppercase tracking-widest text-xs text-gray-400">Description & Context</h3>
                            </div>
                            {!isOwner && user && (
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="px-4 py-2 bg-mcc-maroon/10 text-mcc-maroon rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-mcc-maroon hover:text-white transition-all flex items-center gap-2"
                                >
                                    <MessageSquare size={12} /> Contact Owner
                                </button>
                            )}
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            {item.description}
                        </p>
                    </div>

                    {!isOwner && item.status === 'open' && (
                        <div className="bg-mcc-maroon p-8 rounded-[2.5rem] shadow-xl shadow-mcc-maroon/20 text-white space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight">Claim this item</h3>
                                <p className="text-mcc-light/80 text-sm">Provide unique details to prove ownership.</p>
                            </div>
                            <form onSubmit={handleClaim} className="space-y-4">
                                <textarea
                                    className="w-full bg-white/10 border-white/20 rounded-2xl p-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 transition-all font-medium resize-none text-sm"
                                    rows="3"
                                    placeholder="Enter proof of ownership (e.g., wallpaper, serial no...)"
                                    value={claimDesc}
                                    onChange={(e) => setClaimDesc(e.target.value)}
                                    required
                                ></textarea>
                                <button
                                    disabled={submitting}
                                    className="w-full bg-white text-mcc-maroon font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : <><Send size={18} /> Send Authenticated Claim</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {isOwner && (
                        <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-4">
                            <ShieldCheck size={32} className="text-emerald-500" />
                            <div>
                                <h4 className="font-bold text-emerald-900">Owner Perspective</h4>
                                <p className="text-xs text-emerald-600/80">You are the author of this report. Manage claims in the "Active Claims" tab.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window Overlay */}
            {isChatOpen && (
                <ChatWindow
                    itemId={id}
                    receiverId={item.postedBy?._id || item.postedBy}
                    receiverName={item.postedBy?.name || 'Item Owner'}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </div>
    );
};

export default ItemDetails;
