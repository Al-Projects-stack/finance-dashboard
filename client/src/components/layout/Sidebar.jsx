import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconBrandLogo,
  IconGrid,
  IconArrows,
  IconLogOut,
} from '../Icons';
import styles from './Sidebar.module.css';

const NAV = [
  { to: '/dashboard',    label: 'Dashboard',    Icon: IconGrid    },
  { to: '/transactions', label: 'Transactions', Icon: IconArrows  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  /* Show up to two initials */
  const initials = (user?.full_name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className={styles.sidebar}>
      {/* ── Brand ── */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <IconBrandLogo size={20} />
        </div>
        <span className={styles.logoText}>FinanceOS</span>
      </div>

      {/* ── Nav ── */}
      <span className={styles.sectionLabel}>Main Menu</span>
      <nav className={styles.nav}>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}><Icon /></span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.spacer} />

      {/* ── User ── */}
      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user?.full_name}</span>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={logout}
            title="Sign out"
          >
            <IconLogOut width={15} height={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
