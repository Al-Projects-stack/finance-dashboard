import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="7" height="7" x="3" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="14" rx="1"/>
    <rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);

const TransactionsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m16 3 4 4-4 4"/>
    <path d="M20 7H4"/>
    <path d="m8 21-4-4 4-4"/>
    <path d="M4 17h16"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const NAV = [
  { to: '/dashboard',    label: 'Dashboard',    Icon: DashboardIcon },
  { to: '/transactions', label: 'Transactions', Icon: TransactionsIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}><LogoIcon /></span>
        <span className={styles.logoText}>FinanceOS</span>
      </div>

      <nav className={styles.nav} aria-label="App navigation">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar} aria-hidden="true">
            {user?.full_name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user?.full_name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}
