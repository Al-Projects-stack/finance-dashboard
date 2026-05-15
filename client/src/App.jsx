import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import Sidebar from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import styles from './App.module.css';

function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className={styles.fullCenter}>
      <div className="spinner" />
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className={styles.fullCenter}>
      <div className="spinner" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <TransactionProvider>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </TransactionProvider>
  );
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
