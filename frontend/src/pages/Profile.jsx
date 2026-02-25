import { useAuth } from '../context/AuthContext';
import { User, Mail, Hash, Shield, Calendar, Edit2, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                    User <span className="text-mcc-maroon">Profile</span>
                </h1>
                <p className="text-gray-500">Manage your institutional identity and account settings.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft text-center">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-mcc-maroon to-mcc-light rounded-3xl p-1 mb-6 shadow-xl shadow-mcc-maroon/20">
                            <div className="w-full h-full bg-white rounded-[20px] flex items-center justify-center overflow-hidden">
                                <User size={48} className="text-mcc-maroon" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
                        <p className="text-sm font-bold text-mcc-maroon/80 uppercase tracking-widest mb-6">{user?.role} Account</p>

                        <div className="flex flex-col gap-2">
                            <button className="w-full bg-gray-50 text-gray-900 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all border border-gray-100">
                                <Edit2 size={18} /> Edit Profile
                            </button>
                            <button
                                onClick={logout}
                                className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all border border-red-100"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-soft">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-mcc-maroon/10 rounded-xl flex items-center justify-center text-mcc-maroon">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Institutional Records</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                <div className="flex items-center gap-3 text-gray-900 font-bold">
                                    <User size={18} className="text-gray-400" /> {user?.name}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unique Username</label>
                                <div className="flex items-center gap-3 text-gray-900 font-bold">
                                    <Hash size={18} className="text-gray-400" /> {user?.username}
                                </div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Status</label>
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">Account Verified</p>
                                        <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Madrasians Community Member</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
