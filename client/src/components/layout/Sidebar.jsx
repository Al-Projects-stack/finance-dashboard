import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const NAV = [
  { to: '/',             label: 'Dashboard',    icon: '⬡' },
  { to: '/transactions', label: 'Transactions', icon: '⟳' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>◈</span>
        <span className={styles.logoText}>FinanceOS</span>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user?.full_name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user?.full_name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
        </div>
        <button className={`${styles.logoutBtn}`} onClick={logout} title="Logout">
          ⏻
        </button>
      </div>
    </aside>
  );
}
