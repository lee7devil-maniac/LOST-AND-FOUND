import { Link } from 'react-router-dom';
import { Search, PlusCircle, CheckCircle } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
            {/* Hero Section */}
            <header className="relative py-20 overflow-hidden bg-mcc-maroon">
                <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase">
                            MCC <span className="text-white/80">Lost & Found</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90">
                            The official portal for Madras Christian College students to recover lost belongings and return found items.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4">
                            <Link to="/register" className="bg-white text-mcc-maroon font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
                                Get Started
                            </Link>
                            <Link to="/login" className="bg-mcc-maroon border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-mcc-maroon transition duration-300">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center p-8 glass-card">
                            <div className="bg-mcc-maroon/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-mcc-maroon">
                                <Search size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Search Items</h3>
                            <p className="text-gray-600">Quickly browse through lost or found items by category, location, or keyword.</p>
                        </div>
                        <div className="text-center p-8 glass-card">
                            <div className="bg-mcc-maroon/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-mcc-maroon">
                                <PlusCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Post Reports</h3>
                            <p className="text-gray-600">Easily file a report for an item you've lost or something you've found on campus.</p>
                        </div>
                        <div className="text-center p-8 glass-card">
                            <div className="bg-mcc-maroon/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-mcc-maroon">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Secure Claims</h3>
                            <p className="text-gray-600">Verify owners through our internal claim system and MCC identification.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 text-center">
                <p className="text-gray-400">© 2026 Madras Christian College. All rights reserved.</p>
                <p className="text-xs mt-2 text-gray-500 uppercase tracking-widest">Built for MCCians</p>
            </footer>
        </div>
    );
};

export default Landing;
