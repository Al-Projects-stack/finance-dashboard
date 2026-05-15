import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../components/auth/AuthForm.module.css';

export default function RegisterPage() {
  const { register }  = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]     = useState({ full_name: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.details?.[0]?.message;
      setError(detail || err.response?.data?.error || 'Registration failed');
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

        <p className={styles.heading}>Create your account</p>

        {error && <div className="error-msg">{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text" required autoFocus
              placeholder="Alex Johnson"
              maxLength={100}
              autoComplete="name"
              value={form.full_name}
              onChange={(e) => {
                // Allow letters (including accented), spaces, hyphens, apostrophes
                const clean = e.target.value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ '\-]/g, '');
                set('full_name', clean);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('text');
                const clean = pasted.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ '\-]/g, '');
                set('full_name', clean);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email" required
              placeholder="you@example.com"
              maxLength={255}
              inputMode="email"
              autoComplete="email"
              pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
              value={form.email}
              onChange={(e) => {
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
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password" required
              minLength={8} maxLength={128}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
            />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
