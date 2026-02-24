import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mcc-maroon/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-mcc-maroon/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <div className="max-w-md w-full space-y-8 relative">
                <div className="text-center">
                    <div className="w-16 h-16 bg-mcc-maroon rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-mcc-maroon/30 mb-8 transform hover:rotate-12 transition-transform duration-300">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Log in to <span className="text-mcc-maroon">Nexus</span>
                    </h2>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center justify-center gap-2">
                        MCC Community Access <span className="w-1.5 h-1.5 bg-mcc-maroon rounded-full animate-pulse"></span>
                    </p>
                </div>

                <form className="mt-10 space-y-6 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-soft" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Institutional Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-4 pl-12 pr-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-mcc-maroon/20 transition-all font-medium placeholder:text-gray-300 dark:placeholder:text-gray-700"
                                    placeholder="yourname@mcc.edu.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 px-1">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-mcc-maroon transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-4 pl-12 pr-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-mcc-maroon/20 transition-all font-medium placeholder:text-gray-300 dark:placeholder:text-gray-700"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs px-1">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-mcc-maroon focus:ring-mcc-maroon border-gray-300 rounded-lg cursor-pointer transition-colors" />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-500 cursor-pointer">Stay logged in</label>
                        </div>
                        <Link to="#" className="font-bold text-mcc-maroon hover:underline decoration-mcc-maroon/30 underline-offset-4">Forgot access?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full group bg-mcc-maroon text-white font-black py-4 rounded-2xl shadow-xl shadow-mcc-maroon/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 overflow-hidden"
                    >
                        {isLoading ? 'Decrypting Session...' : (
                            <>
                                Access Dashboard <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            New on campus?{' '}
                            <Link to="/register" className="font-black text-mcc-maroon hover:text-mcc-dark transition-colors uppercase tracking-widest text-[10px]">
                                Join the network
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
