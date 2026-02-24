import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Hash, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        registerNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        setIsLoading(true);
        const success = await register({
            name: formData.name,
            registerNumber: formData.registerNumber,
            email: formData.email,
            password: formData.password
        });
        setIsLoading(false);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mcc-maroon/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

            <div className="max-w-xl w-full space-y-8 relative">
                <div className="text-center">
                    <div className="w-16 h-16 bg-mcc-maroon rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-mcc-maroon/30 mb-8">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Create your <span className="text-mcc-maroon">Nexus ID</span>
                    </h2>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Complete institutional verification to start sharing.
                    </p>
                </div>

                <form className="mt-10 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-soft" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 px-1">Full Legal Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-mcc-maroon/20 font-medium"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 px-1">Register ID</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon" size={18} />
                                <input
                                    name="registerNumber"
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-mcc-maroon/20 font-medium"
                                    placeholder="22-BCA-001"
                                    value={formData.registerNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="group md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 px-1">Institutional Email (@mcc.edu.in)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-mcc-maroon/20 font-medium"
                                    placeholder="name@mcc.edu.in"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 px-1">Master Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-mcc-maroon/20 font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 px-1">Confirm Secret</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon" size={18} />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-mcc-maroon/20 font-medium"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-mcc-maroon text-white font-black py-4 rounded-2xl shadow-xl shadow-mcc-maroon/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Verifying Credentials...' : <><UserPlus size={20} /> Establish Account</>}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Already a member?{' '}
                            <Link to="/login" className="font-black text-mcc-maroon hover:text-mcc-dark transition-colors uppercase tracking-widest text-[10px]">
                                Secure Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
