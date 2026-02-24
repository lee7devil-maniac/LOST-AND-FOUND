import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 font-black text-mcc-maroon animate-pulse">Initializing Nexus...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '1rem',
              fontSize: '14px',
              padding: '12px 20px',
            }
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportItem />} />
            <Route path="/profile" element={<Profile />} />

            {/* Added routes as placeholders/actual page mapping */}
            <Route path="/search" element={<Dashboard />} />
            <Route path="/my-posts" element={<div className="p-8 text-center opacity-40"><p className="text-sm font-black uppercase tracking-widest">Personal Archives Coming Soon</p></div>} />
            <Route path="/claims" element={<div className="p-8 text-center opacity-40"><p className="text-sm font-black uppercase tracking-widest">Claims History Coming Soon</p></div>} />

            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
