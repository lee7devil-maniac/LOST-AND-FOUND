import { useState, useEffect } from 'react';
import { History, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Claims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClaims = async () => {
        try {
            const { data } = await api.get('/claims');
            setClaims(data.data);
        } catch (err) {
            console.error('Failed to fetch claims');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/claims/${id}`, { status });
            toast.success(`Claim ${status} successfully`);
            fetchClaims();
        } catch (err) {
            toast.error('Action failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mcc-maroon/10 text-mcc-maroon text-[10px] font-bold uppercase tracking-widest">
                        <History size={12} /> Verification Desk
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Active <span className="text-mcc-maroon">Claims</span>
                    </h1>
                    <p className="text-gray-500 max-w-md">
                        Manage requests for items you've found or track items you're claiming.
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-24 bg-white rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : claims.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No active claims</h2>
                    <p className="text-gray-500 max-w-xs mx-auto">There are no pending requests or claims at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6 pb-12">
                    {claims.map(claim => (
                        <div key={claim._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-mcc-maroon/10 text-mcc-maroon rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">
                                        Claim for: <span className="text-mcc-maroon">{claim.item?.title}</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        From: <span className="font-semibold">{claim.claimant?.name}</span>
                                    </p>
                                    <p className="text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                                        "{claim.description}"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {claim.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => updateStatus(claim._id, 'approved')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <CheckCircle2 size={18} /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(claim._id, 'rejected')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {claim.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Claims;
