import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../components/auth/AuthForm.module.css';

export default function LoginPage() {
  const { login }     = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={`glass-card ${styles.card}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          </span>
          <span className={styles.logoName}>FinanceOS</span>
        </div>

        <p className={styles.heading}>Sign in to your account</p>

        {error && <div className="error-msg">{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email" required autoFocus
              placeholder="you@example.com"
              maxLength={255}
              inputMode="email"
              autoComplete="email"
              pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
              value={form.email}
              onChange={(e) => {
                // Strip characters that can never appear in a valid email
                const clean = e.target.value.replace(/[^a-zA-Z0-9._%+\-@]/g, '');
                set('email', clean);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('text');
                const clean = pasted.trim().replace(/[^a-zA-Z0-9._%+\-@]/g, '');
                set('email', clean);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password" required
              placeholder="••••••••"
              maxLength={128}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
            />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.footer}>
          No account? <Link to="/register" className={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
