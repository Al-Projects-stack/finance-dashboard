import { Link } from 'react-router-dom';
import { IconBrandLogo, IconTrendUp, IconArrows, IconWallet, IconPercent } from '../components/Icons';
import styles from './LandingPage.module.css';

/* ── Feature cards data ── */
const FEATURES = [
  {
    icon: <IconArrows width={22} height={22} />,
    title: 'Track Every Transaction',
    desc:  'Log income and expenses with categories, dates, and notes. Full CRUD, add, edit, delete in seconds.',
    color: 'purple',
  },
  {
    icon: <IconTrendUp width={22} height={22} />,
    title: 'Visualise Your Trends',
    desc:  'Line charts, bar charts and doughnut breakdowns reveal patterns you\'d never spot in a spreadsheet.',
    color: 'cyan',
  },
  {
    icon: <IconWallet width={22} height={22} />,
    title: 'Know Your Balance',
    desc:  'Live KPI cards show total balance, income, expenses and savings rate, updated the moment you add a record.',
    color: 'green',
  },
  {
    icon: <IconPercent width={22} height={22} />,
    title: 'Savings Rate at a Glance',
    desc:  'See exactly how much of your income you\'re keeping. Set goals and watch your savings rate climb.',
    color: 'red',
  },
];


/* ── Colour map ── */
const COLOR = {
  purple: { icon: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.22)', text: '#c084fc' },
  cyan:   { icon: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.22)',  text: '#22d3ee' },
  green:  { icon: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.22)', text: '#10b981' },
  red:    { icon: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.22)',  text: '#f87171' },
};

export default function LandingPage() {
  return (
    <div className={styles.page}>

      {/* ── Ambient orbs ── */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* ══════════════════════ NAV ══════════════════════ */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navBrand}>
          <div className={styles.navLogoMark}>
            <IconBrandLogo size={20} />
          </div>
          <span className={styles.navLogoText}>FinanceOS</span>
        </Link>

        <div className={styles.navActions}>
          <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className={styles.hero}>
        {/* Pill badge */}
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} />
          Free · No credit card required
        </div>

        <h1 className={styles.heroHeadline}>
          Your finances,<br />
          <span className={styles.heroGradText}>finally under control.</span>
        </h1>

        <p className={styles.heroSub}>
          Track income, monitor expenses and visualise your financial health,
          all in one beautiful, privacy-first dashboard.
        </p>

        <div className={styles.heroCTAs}>
          <Link to="/register" className={`btn btn-primary ${styles.ctaPrimary}`}>
            Get Started Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/login" className={`btn btn-ghost ${styles.ctaSecondary}`}>
            Sign In
          </Link>
        </div>

        {/* ── Dashboard mockup card ── */}
        <div className={styles.mockupWrap}>
          <div className={styles.mockupFrame}>
            {/* Mini KPI strip */}
            <div className={styles.mockKpis}>
              {[
                { label: 'Balance',  val: 'R 48,500', color: '#c084fc' },
                { label: 'Income',   val: 'R 32,000', color: '#10b981' },
                { label: 'Expenses', val: 'R 14,200', color: '#f43f5e' },
                { label: 'Savings',  val: '55.6%',    color: '#22d3ee' },
              ].map((k) => (
                <div key={k.label} className={styles.mockKpi}>
                  <span className={styles.mockKpiLabel}>{k.label}</span>
                  <span className={styles.mockKpiVal} style={{ color: k.color }}>{k.val}</span>
                </div>
              ))}
            </div>

            {/* Mini chart bars */}
            <div className={styles.mockChart}>
              <div className={styles.mockChartTitle}>Cash Flow</div>
              <div className={styles.mockBars}>
                {[55, 72, 48, 90, 65, 83, 70].map((h, i) => (
                  <div key={i} className={styles.mockBarWrap}>
                    <div
                      className={styles.mockBar}
                      style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mini transaction rows */}
            <div className={styles.mockRows}>
              {[
                { name: 'Salary',       type: 'income',  amt: '+R 32,000' },
                { name: 'Groceries',    type: 'expense', amt: '−R 1,850'  },
                { name: 'Netflix',      type: 'expense', amt: '−R 199'    },
              ].map((r) => (
                <div key={r.name} className={styles.mockRow}>
                  <span className={styles.mockRowName}>{r.name}</span>
                  <span
                    className={styles.mockRowAmt}
                    style={{ color: r.type === 'income' ? '#10b981' : '#f43f5e' }}
                  >
                    {r.amt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Glow behind the card */}
          <div className={styles.mockupGlow} />
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════ */}
      <section className={styles.features}>
        <div className={styles.sectionLabel}>Features</div>
        <h2 className={styles.sectionTitle}>
          Everything you need to master your money
        </h2>
        <p className={styles.sectionSub}>
          Built for individuals who take their finances seriously.
          No fluff, just the data that matters.
        </p>

        <div className={styles.featureGrid}>
          {FEATURES.map((f) => {
            const c = COLOR[f.color];
            return (
              <div
                key={f.title}
                className={`glass-card ${styles.featureCard}`}
                style={{
                  '--fc-icon-bg':  c.icon,
                  '--fc-border':   c.border,
                  '--fc-text':     c.text,
                }}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p  className={styles.featureDesc}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════ BOTTOM CTA ════════════════ */}
      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaCard}>
          <div className={styles.bottomOrb} />
          <h2 className={styles.bottomTitle}>
            Start your financial journey today
          </h2>
          <p className={styles.bottomSub}>
            Create a free account in under 60 seconds. No card required.
          </p>
          <Link to="/register" className={`btn btn-primary ${styles.bottomBtn}`}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ═════════════════════ */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <IconBrandLogo size={18} />
          <span>FinanceOS</span>
        </div>
        <span className={styles.footerCopy}>
          © {new Date().getFullYear()} FinanceOS. Built with ♥
        </span>
        <div className={styles.footerLinks}>
          <Link to="/login"    className={styles.footerLink}>Sign In</Link>
          <Link to="/register" className={styles.footerLink}>Register</Link>
        </div>
      </footer>

    </div>
  );
}
