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
    const [activeImage, setActiveImage] = useState(0);

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
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-mcc-maroon font-bold uppercase tracking-widest text-[9px] sm:text-[10px] transition-colors px-2 sm:px-0">
                <ChevronLeft size={16} /> Hub Directory
            </button>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 pb-12">
                {/* Left: Visuals */}
                <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
                    <div className="aspect-square bg-white rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-soft overflow-hidden group relative">
                        {((item.images && item.images.length > 0) || item.imageUrl) ? (
                            <>
                                <img
                                    src={(item.images && item.images.length > 0)
                                        ? (item.images[activeImage]?.startsWith('http') ? item.images[activeImage] : `${IMAGE_BASE_URL}${item.images[activeImage]?.replace(/^\/?uploads\//, '')}`)
                                        : (item.imageUrl?.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl?.replace(/^\/?uploads\//, '')}`)}
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

                    {/* Thumbnails */}
                    {item.images && item.images.length > 1 && (
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {item.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-mcc-maroon ring-4 ring-mcc-maroon/10 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <img
                                        src={img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img.replace(/^\/?uploads\//, '')}`}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Intel */}
                <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex gap-2">
                            <span className={`px-3 sm:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                {item.type}
                            </span>
                            <span className="px-3 sm:px-4 py-1 bg-gray-100 text-gray-500 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                {item.category}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight sm:leading-none">{item.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
                                <MapPin size={16} className="text-mcc-maroon" /> {item.location}
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
                                <Clock size={16} /> {formatDistanceToNow(new Date(item.createdAt))} ago
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-soft space-y-4 sm:space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Info size={18} sm:size={20} className="text-mcc-maroon" />
                                <h3 className="font-black uppercase tracking-widest text-[10px] sm:text-xs text-gray-400">Context</h3>
                            </div>
                            {!isOwner && user && (
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="px-3 py-1.5 bg-mcc-maroon/10 text-mcc-maroon rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-mcc-maroon hover:text-white transition-all flex items-center gap-2"
                                >
                                    <MessageSquare size={12} /> Chat
                                </button>
                            )}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                            {item.description}
                        </p>
                    </div>

                    {!isOwner && item.status === 'open' && (
                        <div className="bg-mcc-maroon p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-mcc-maroon/20 text-white space-y-6">
                            <div className="space-y-1 text-center sm:text-left">
                                <h3 className="text-xl sm:text-2xl font-black tracking-tight">Claim this item</h3>
                                <p className="text-mcc-light/80 text-xs sm:text-sm">Provide unique details to prove ownership.</p>
                            </div>
                            <form onSubmit={handleClaim} className="space-y-4">
                                <textarea
                                    className="w-full bg-white/10 border-white/20 rounded-2xl p-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 transition-all font-medium resize-none text-sm"
                                    rows="3"
                                    placeholder="Enter proof of ownership..."
                                    value={claimDesc}
                                    onChange={(e) => setClaimDesc(e.target.value)}
                                    required
                                ></textarea>
                                <button
                                    disabled={submitting}
                                    className="w-full bg-white text-mcc-maroon font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm sm:text-base"
                                >
                                    {submitting ? 'Submitting...' : <><Send size={18} /> Send Claim</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {isOwner && (
                        <div className="p-6 sm:p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-4">
                            <ShieldCheck size={32} className="text-emerald-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-emerald-900 text-sm sm:text-base">Owner Perspective</h4>
                                <p className="text-[10px] sm:text-xs text-emerald-600/80">Manage claims in the "Active Claims" tab.</p>
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
